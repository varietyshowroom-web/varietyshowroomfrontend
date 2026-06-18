import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      user: null,
      token: null,
      deliveryConfig: { charge_upto_two: 50, charge_more_than_two: 100 },

      setDeliveryConfig: (config) => set({ deliveryConfig: config }),
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      
      addToCart: (product, variant, quantity = 1) => set((state) => {
        const existingItemIndex = state.cart.findIndex(
          item => item.product.id === product.id && item.variant.id === variant.id
        );

        if (existingItemIndex >= 0) {
          const newCart = [...state.cart];
          newCart[existingItemIndex].quantity += quantity;
          return { cart: newCart };
        }

        return {
          cart: [...state.cart, { product, variant, quantity }]
        };
      }),

      removeFromCart: (productId, variantId) => set((state) => ({
        cart: state.cart.filter(item => !(item.product.id === productId && item.variant.id === variantId))
      })),

      updateQuantity: (productId, variantId, quantity) => set((state) => ({
        cart: state.cart.map(item => 
          item.product.id === productId && item.variant.id === variantId
            ? { ...item, quantity }
            : item
        )
      })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (product) => set((state) => {
        const exists = state.wishlist.some(item => item.id === product.id);
        if (exists) {
          return { wishlist: state.wishlist.filter(item => item.id !== product.id) };
        }
        return { wishlist: [...state.wishlist, product] };
      }),
      
      isInWishlist: (productId) => {
        // We handle this in components via derived state, but this helper can be useful
        return false; 
      }
    }),
    {
      name: 'variety-showroom-storage',
    }
  )
);
