import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (cake, size, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.cakeId === cake.id && item.sizeId === size.id
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.cakeId === cake.id && item.sizeId === size.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                cakeId: cake.id,
                cakeName: cake.name,
                cakeImageUrl: cake.imageUrl,
                sizeId: size.id,
                sizeLabel: size.label,
                slices: size.slices,
                price: size.price,
                quantity,
              },
            ],
          };
        });
      },

      removeItem: (cakeId, sizeId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.cakeId === cakeId && item.sizeId === sizeId)
          ),
        }));
      },

      updateQuantity: (cakeId, sizeId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cakeId, sizeId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.cakeId === cakeId && item.sizeId === sizeId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'angelas-cakes-cart',
    }
  )
);

export default useCartStore;
