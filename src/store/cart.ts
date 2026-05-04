import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string; // product id + size + color key
  productId: string;
  slug: string;
  name: string;
  image?: string;
  price: number; // unit price (after discount if any)
  size?: string;
  color?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  totalCount: () => number;
  totalPrice: () => number;
};

const keyOf = (productId: string, size?: string, color?: string) =>
  `${productId}::${size ?? ""}::${color ?? ""}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (v) => set({ isOpen: v }),
      addItem: (item) => {
        const id = keyOf(item.productId, item.size, item.color);
        const qty = item.quantity ?? 1;
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set({
            items: get().items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + qty } : i)),
          });
        } else {
          set({ items: [...get().items, { ...item, id, quantity: qty }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQty: (id, qty) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
        }),
      clear: () => set({ items: [] }),
      totalCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "genz-cart" }
  )
);
