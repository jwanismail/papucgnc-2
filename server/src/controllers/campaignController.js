import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tüm kampanyaları getir
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        products: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Kampanyalar getirilirken hata oluştu', message: error.message });
  }
};

// Tekil kampanya getir
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        products: true
      }
    });
    
    if (!campaign) {
      return res.status(404).json({ error: 'Kampanya bulunamadı' });
    }
    
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Kampanya getirilirken hata oluştu', message: error.message });
  }
};

// Yeni kampanya ekle
export const createCampaign = async (req, res) => {
  try {
    const { name, description, type, isActive } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ error: 'Kampanya adı ve tipi zorunludur' });
    }
    
    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        type,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Kampanya eklenirken hata oluştu', message: error.message });
  }
};

// Kampanya güncelle
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, isActive } = req.body;
    
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        description,
        type,
        isActive
      }
    });
    
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Kampanya güncellenirken hata oluştu', message: error.message });
  }
};

// Kampanya sil
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.campaign.delete({
      where: { id }
    });
    
    res.json({ message: 'Kampanya başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Kampanya silinirken hata oluştu', message: error.message });
  }
};

