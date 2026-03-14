import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    variantId: string
    productId: string
    name: string
    brand: string
    size: number
    price: number
    quantity: number
    image: string
}

interface CartState {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (variantId: string) => void
    updateQuantity: (variantId: string, quantity: number) => void
    clearCart: () => void
    getTotal: () => number
    getItemCount: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const items = get().items
                const existingItem = items.find((i) => i.variantId === item.variantId)

                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    })
                } else {
                    set({ items: [...items, item] })
                }
            },
            removeItem: (variantId) => {
                set({ items: get().items.filter((i) => i.variantId !== variantId) })
            },
            updateQuantity: (variantId, quantity) => {
                set({
                    items: get().items.map((i) =>
                        i.variantId === variantId ? { ...i, quantity: Math.max(0, quantity) } : i
                    ),
                })
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
            },
            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0)
            },
        }),
        {
            name: 'amvill-cart-storage',
            version: 2,
            migrate: (persistedState: unknown) => {
                const state = persistedState as { items?: Array<CartItem & { id?: string }> }

                if (!state.items) {
                    return { items: [] }
                }

                return {
                    ...state,
                    items: state.items.map((item) => ({
                        ...item,
                        variantId: item.variantId ?? item.id ?? '',
                    })),
                }
            },
        }
    )
)
