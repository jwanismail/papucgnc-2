import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sipariş numarası oluştur
const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `PAP-${year}${month}${day}-${random}`;
};

// Sipariş oluştur
export const createOrder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      detailedAddress,
      city,
      district,
      orderNote,
      billingAddressDifferent,
      items,
      totalAmount,
      campaignDiscount,
      shippingCost,
      paymentMethod,
      shippingMethod
    } = req.body;

    // Gerekli alanları kontrol et
    if (!firstName || !lastName || !phone || !email || !address || !detailedAddress || !city || !district || !paymentMethod || !shippingMethod) {
      return res.status(400).json({
        error: 'Eksik bilgi',
        message: 'Tüm gerekli alanları doldurunuz'
      });
    }

    // Sipariş numarası oluştur
    const orderNumber = generateOrderNumber();

    // Siparişi veritabanına kaydet
    const order = await prisma.order.create({
      data: {
        orderNumber,
        firstName,
        lastName,
        phone,
        email,
        address,
        detailedAddress: detailedAddress || null,
        city,
        district,
        orderNote: orderNote || null,
        billingAddressDifferent: billingAddressDifferent || false,
        items: JSON.stringify(items),
        totalAmount: parseFloat(totalAmount),
        campaignDiscount: parseFloat(campaignDiscount || 0),
        shippingCost: parseFloat(shippingCost || 0),
        paymentMethod,
        shippingMethod,
        status: 'pending',
        paymentStatus: 'pending'
      }
    });

    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    res.status(500).json({
      error: 'Sipariş oluşturulurken hata oluştu',
      message: error.message
    });
  }
};

// Tüm siparişleri getir (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const where = status ? { status } : {};
    
    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    // Sipariş sayısını al
    const total = await prisma.order.count({ where });

    res.json({
      orders: orders.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Siparişler getirme hatası:', error);
    res.status(500).json({
      error: 'Siparişler getirilirken hata oluştu',
      message: error.message
    });
  }
};

// Sipariş detayını getir
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Sipariş bulunamadı'
      });
    }

    res.json({
      ...order,
      items: JSON.parse(order.items)
    });

  } catch (error) {
    console.error('Sipariş getirme hatası:', error);
    res.status(500).json({
      error: 'Sipariş getirilirken hata oluştu',
      message: error.message
    });
  }
};

// Sipariş durumunu güncelle
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    // Sipariş bilgisini al
    const currentOrder = await prisma.order.findUnique({ where: { id } });
    
    if (!currentOrder) {
      return res.status(404).json({ error: 'Sipariş bulunamadı' });
    }

    const updateData = {};
    
    if (status) {
      updateData.status = status;
      if (status === 'confirmed') {
        updateData.confirmedAt = new Date();
        
        // Sipariş onaylandığında stokları azalt
        const items = JSON.parse(currentOrder.items);
        
        for (const item of items) {
          if (item.selectedSize) {
            // Ürün bilgisini al
            const product = await prisma.product.findUnique({
              where: { id: item.id }
            });
            
            if (product && product.sizeStock) {
              const sizeStock = typeof product.sizeStock === 'string' 
                ? JSON.parse(product.sizeStock) 
                : product.sizeStock;
              
              // Seçili numaranın stokunu azalt
              if (sizeStock[item.selectedSize] !== undefined) {
                sizeStock[item.selectedSize] = Math.max(0, sizeStock[item.selectedSize] - item.quantity);
                
                // Toplam stoğu hesapla
                const totalStock = Object.values(sizeStock).reduce((sum, val) => sum + val, 0);
                
                // Ürünü güncelle
                await prisma.product.update({
                  where: { id: item.id },
                  data: {
                    sizeStock: JSON.stringify(sizeStock),
                    stock: totalStock
                  }
                });
                
                console.log(`✅ Stok azaltıldı: ${item.name} - Numara ${item.selectedSize} (${item.quantity} adet)`);
              }
            }
          }
        }
      } else if (status === 'shipped') {
        updateData.shippedAt = new Date();
      } else if (status === 'delivered') {
        updateData.deliveredAt = new Date();
      }
    }
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      order: {
        ...order,
        items: JSON.parse(order.items)
      }
    });

  } catch (error) {
    console.error('Sipariş güncelleme hatası:', error);
    res.status(500).json({
      error: 'Sipariş güncellenirken hata oluştu',
      message: error.message
    });
  }
};

// Toplu sipariş durumu güncelle
export const updateBulkOrderStatus = async (req, res) => {
  try {
    const { orderIds, status, paymentStatus } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        error: 'Geçersiz veri',
        message: 'En az bir sipariş ID\'si gönderilmelidir'
      });
    }

    if (orderIds.length > 10) {
      return res.status(400).json({
        error: 'Limit aşıldı',
        message: 'En fazla 10 sipariş aynı anda güncellenebilir'
      });
    }

    // Mevcut siparişleri kontrol et
    const existingOrders = await prisma.order.findMany({
      where: {
        id: { in: orderIds }
      }
    });

    if (existingOrders.length !== orderIds.length) {
      return res.status(400).json({
        error: 'Sipariş bulunamadı',
        message: 'Bazı siparişler bulunamadı'
      });
    }

    // Transaction kullanarak toplu güncelleme
    const results = await prisma.$transaction(async (tx) => {
      const updatedOrders = [];

      for (const orderId of orderIds) {
        const currentOrder = await tx.order.findUnique({ where: { id: orderId } });
        
        const updateData = {};
        
        if (status) {
          updateData.status = status;
          if (status === 'confirmed') {
            updateData.confirmedAt = new Date();
            
            // Sipariş onaylandığında stokları azalt
            const items = JSON.parse(currentOrder.items);
            
            for (const item of items) {
              if (item.selectedSize) {
                const product = await tx.product.findUnique({
                  where: { id: item.id }
                });
                
                if (product && product.sizeStock) {
                  const sizeStock = typeof product.sizeStock === 'string' 
                    ? JSON.parse(product.sizeStock) 
                    : product.sizeStock;
                  
                  if (sizeStock[item.selectedSize] !== undefined) {
                    sizeStock[item.selectedSize] = Math.max(0, sizeStock[item.selectedSize] - item.quantity);
                    
                    const totalStock = Object.values(sizeStock).reduce((sum, val) => sum + val, 0);
                    
                    await tx.product.update({
                      where: { id: item.id },
                      data: {
                        sizeStock: JSON.stringify(sizeStock),
                        stock: totalStock
                      }
                    });
                    
                    console.log(`✅ Toplu stok azaltıldı: ${item.name} - Numara ${item.selectedSize} (${item.quantity} adet)`);
                  }
                }
              }
            }
          } else if (status === 'shipped') {
            updateData.shippedAt = new Date();
          } else if (status === 'delivered') {
            updateData.deliveredAt = new Date();
          }
        }
        
        if (paymentStatus) {
          updateData.paymentStatus = paymentStatus;
        }

        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: updateData
        });

        updatedOrders.push(updatedOrder);
      }

      return updatedOrders;
    });

    res.json({
      success: true,
      message: `${results.length} sipariş başarıyla güncellendi`,
      updatedOrders: results.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      }))
    });

  } catch (error) {
    console.error('Toplu sipariş güncelleme hatası:', error);
    res.status(500).json({
      error: 'Toplu sipariş güncelleme hatası',
      message: error.message
    });
  }
};

// Sipariş sil
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Sipariş başarıyla silindi'
    });

  } catch (error) {
    console.error('Sipariş silme hatası:', error);
    res.status(500).json({
      error: 'Sipariş silinirken hata oluştu',
      message: error.message
    });
  }
};
