import { createClient } from "@/utils/supabase/server"
import { Order } from "../domain/order"
import { Database } from "@/types/database.types"

type OrderRow = Database["public"]["Tables"]["orders"]["Row"]
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"]

interface OrderWithItems extends OrderRow {
    order_items?: Array<OrderItemRow & {
        product_variants?: {
            products?: {
                name: string
                brand: string
            } | null
        } | null
    }> | null
}

export async function getUserOrders(): Promise<Order[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (
        *,
        product_variants (
          product_id,
          products (name, brand)
        )
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching orders:', error)
        return []
    }

    return ((data ?? []) as OrderWithItems[]).map((order) => {
        const status =
            order.status === "pending" || order.status === "confirmed" || order.status === "cancelled"
                ? order.status
                : "pending"

        return {
            ...order,
            status,
            items: order.order_items?.map((item) => ({
                ...item,
                product: item.product_variants?.products ?? undefined,
            })),
        }
    })
}
