import { createClient } from "@/utils/supabase/server"
import { Order } from "../domain/order"

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

    return (data as any[]).map(order => ({
        ...order,
        items: order.order_items?.map((item: any) => ({
            ...item,
            product: item.product_variants?.products
        }))
    }))
}
