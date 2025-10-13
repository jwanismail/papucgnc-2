import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed işlemi başlatılıyor...')

  // Kampanyaları oluştur
  const campaign1 = await prisma.campaign.create({
    data: {
      name: '2. Çift 699 TL',
      description: 'İkinci ürün sadece 699 TL! Kaçırmayın!',
      type: 'second_pair_699',
      isActive: true
    }
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      name: 'Yeni Sezon İndirimi',
      description: 'Yeni sezon ürünlerinde özel indirim',
      type: 'normal',
      isActive: true
    }
  })

  console.log('✅ Kampanyalar oluşturuldu:', { campaign1, campaign2 })

  // Örnek ürünler oluştur
  const products = [
    {
      name: 'Nike Air Max 2024',
      description: 'Rahat ve şık spor ayakkabı. Tüm gün rahatlık için tasarlandı.',
      price: 2499.99,
      stock: 50,
      image: '',
      campaignId: campaign1.id
    },
    {
      name: 'Adidas Ultraboost',
      description: 'Yüksek performanslı koşu ayakkabısı. Boost teknolojisi ile maksimum enerji geri dönüşü.',
      price: 2799.99,
      stock: 30,
      image: '',
      campaignId: campaign1.id
    },
    {
      name: 'Puma Suede Classic',
      description: 'Zamansız tasarım, günlük kullanım için ideal.',
      price: 1499.99,
      stock: 75,
      image: '',
      campaignId: campaign2.id
    },
    {
      name: 'Reebok Classic Leather',
      description: 'Klasik deri spor ayakkabı. Her kombine uyum sağlar.',
      price: 1799.99,
      stock: 40,
      image: '',
      campaignId: null
    },
    {
      name: 'New Balance 574',
      description: 'İkonik tasarım ve konfor bir arada.',
      price: 1999.99,
      stock: 60,
      image: '',
      campaignId: campaign1.id
    }
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log('✅ Örnek ürünler oluşturuldu')
  console.log('🎉 Seed işlemi tamamlandı!')
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

