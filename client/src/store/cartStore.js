import { create } from 'zustand';

const useCartStore = create((set, get) => ({
      items: [],
      
      // Sepete ürün ekle (renk ve numara seçeneği ile)
      addItem: (product, selectedColor = null, selectedSize = null) => {
        const items = get().items;
        
        // Unique key oluştur (ürün ID + renk + numara)
        const cartKey = `${product.id}${selectedColor ? `_color_${selectedColor.index}` : ''}${selectedSize ? `_size_${selectedSize}` : ''}`;
        
        const existingItem = items.find(item => item.cartKey === cartKey);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.cartKey === cartKey
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ 
            items: [...items, { 
              ...product, 
              quantity: 1,
              cartKey,
              selectedColor, // Renk bilgisini sakla
              selectedSize // Numara bilgisini sakla
            }] 
          });
        }
      },
      
      // Sepetten ürün çıkar (cartKey ile)
      removeItem: (cartKey) => {
        set({ items: get().items.filter(item => item.cartKey !== cartKey) });
      },
      
      // Ürün miktarını güncelle (cartKey ile)
      updateQuantity: (cartKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartKey);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.cartKey === cartKey ? { ...item, quantity } : item
          )
        });
      },
      
      // Sepeti temizle
      clearCart: () => set({ items: [] }),
      
      // Toplam ürün sayısı
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Toplam fiyat
      getTotalPrice: () => {
        const items = get().items;
        let total = 0;
        
        // "2 çift 699" kampanyasına dahil ürünleri grupla
        const campaign699Items = [];
        const regularItems = [];
        
        items.forEach(item => {
          // Kampanya kontrolü - type veya name'e göre
          const isCampaign699 = item.campaign && 
            (item.campaign.type === 'second_pair_699' || 
             item.campaign.name?.includes('2 çift 699') ||
             item.campaign.name?.includes('2 Çift 699'));
          
          if (isCampaign699) {
            // Her adet için ayrı item ekle (quantity'yi açıyoruz)
            for (let i = 0; i < item.quantity; i++) {
              campaign699Items.push(item);
            }
          } else {
            regularItems.push(item);
          }
        });
        
        // "2 çift 699" kampanyası hesaplama
        // Her 2 üründe 699 TL, tek kalan varsa normal fiyatı
        const campaign699Pairs = Math.floor(campaign699Items.length / 2);
        const campaign699Singles = campaign699Items.length % 2;
        
        total += campaign699Pairs * 699; // Her çift için 699 TL
        
        // Tek kalan ürünler normal fiyatıyla
        if (campaign699Singles > 0) {
          total += campaign699Items.slice(-campaign699Singles).reduce((sum, item) => sum + item.price, 0);
        }
        
        // Normal ürünler
        total += regularItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return total;
      },
      
      // Kampanya indirimini hesapla
      getCampaignDiscount: () => {
        const items = get().items;
        let discount = 0;
        
        // "2 çift 699" kampanyasına dahil ürünleri say
        const campaign699Items = [];
        
        items.forEach(item => {
          const isCampaign699 = item.campaign && 
            (item.campaign.type === 'second_pair_699' || 
             item.campaign.name?.includes('2 çift 699') ||
             item.campaign.name?.includes('2 Çift 699'));
          
          if (isCampaign699) {
            for (let i = 0; i < item.quantity; i++) {
              campaign699Items.push(item);
            }
          }
        });
        
        // İndirim hesapla
        const campaign699Pairs = Math.floor(campaign699Items.length / 2);
        if (campaign699Pairs > 0) {
          const originalPrice = campaign699Items.slice(0, campaign699Pairs * 2)
            .reduce((sum, item) => sum + item.price, 0);
          const discountedPrice = campaign699Pairs * 699;
          discount = originalPrice - discountedPrice;
        }
        
        return discount;
      }
    })
);

export default useCartStore;

