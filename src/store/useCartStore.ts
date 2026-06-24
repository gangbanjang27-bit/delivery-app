import { create } from 'zustand';

export interface CartItem {
  menuId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

interface CartStore {
  restaurantId: number | null;
  restaurantName: string | null;
  items: CartItem[];
  
  // return false if trying to add from a different restaurant
  addItem: (item: Omit<CartItem, 'quantity'>, restId: number, restName: string) => boolean;
  
  // force add, clears existing cart if from different restaurant
  forceAddItem: (item: Omit<CartItem, 'quantity'>, restId: number, restName: string) => void;
  
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clearCart: () => void;
  
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  restaurantId: null,
  restaurantName: null,
  items: [],

  addItem: (item, restId, restName) => {
    const state = get();
    
    // Check for different restaurant
    if (state.restaurantId !== null && state.restaurantId !== restId) {
      return false; // UI should handle this by asking user to clear cart
    }

    set((state) => {
      const existingItem = state.items.find(i => i.menuId === item.menuId);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(i => 
            i.menuId === item.menuId ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      }
      return {
        ...state,
        restaurantId: restId,
        restaurantName: restName,
        items: [...state.items, { ...item, quantity: 1 }]
      };
    });
    
    return true;
  },

  forceAddItem: (item, restId, restName) => {
    set({
      restaurantId: restId,
      restaurantName: restName,
      items: [{ ...item, quantity: 1 }]
    });
  },

  removeItem: (menuId) => {
    set((state) => {
      const newItems = state.items.filter(i => i.menuId !== menuId);
      return {
        ...state,
        items: newItems,
        // Reset restaurant if cart is empty
        restaurantId: newItems.length === 0 ? null : state.restaurantId,
        restaurantName: newItems.length === 0 ? null : state.restaurantName,
      };
    });
  },

  updateQuantity: (menuId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(menuId);
      return;
    }
    
    set((state) => ({
      ...state,
      items: state.items.map(i => 
        i.menuId === menuId ? { ...i, quantity } : i
      )
    }));
  },

  clearCart: () => {
    set({ restaurantId: null, restaurantName: null, items: [] });
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getTotalQuantity: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  }
}));
