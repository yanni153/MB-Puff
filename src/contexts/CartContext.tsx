'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartProduct = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
  mainImage: string;
  basePrice: number | string;
  salePrice?: number | string | null;
  stock?: number;
  flavor?: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: CartProduct, quantity?: number) => void;
  updateQuantity: (productId: string, flavor: string | undefined, quantity: number) => void;
  removeItem: (productId: string, flavor: string | undefined) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'mbpuff-cart';

function itemPrice(item: CartProduct) {
  return Number(item.salePrice ?? item.basePrice ?? 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [hydrated, items]);

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id && item.flavor === product.flavor);
      if (existing) {
        return current.map((item) =>
          item.id === product.id && item.flavor === product.flavor
            ? { ...item, quantity: Math.max(1, item.quantity + quantity) }
            : item,
        );
      }
      return [...current, { ...product, quantity: Math.max(1, quantity) }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, flavor: string | undefined, quantity: number) => {
    setItems((current) =>
      current
        .map((item) => (item.id === productId && item.flavor === flavor ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((productId: string, flavor: string | undefined) => {
    setItems((current) => current.filter((item) => !(item.id === productId && item.flavor === flavor)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + itemPrice(item) * item.quantity, 0);
    return { items, count, subtotal, addItem, updateQuantity, removeItem, clearCart };
  }, [addItem, clearCart, items, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
