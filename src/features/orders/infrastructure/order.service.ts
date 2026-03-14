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

type OrderStatus = Order["status"]

function normalizeOrderStatus(status: string): OrderStatus {
    if (status === "pending" || status === "confirmed" || status === "cancelled") {
        return status
    }

    return "pending"
}

function mapOrders(data: OrderWithItems[] | null): Order[] {
    return (data ?? []).map((order) => ({
        ...order,
        status: normalizeOrderStatus(order.status),
        items: order.order_items?.map((item) => ({
            ...item,
            product: item.product_variants?.products ?? undefined,
        })),
    }))
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

    return mapOrders((data ?? []) as OrderWithItems[])
}

export async function getAllOrders(): Promise<Order[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle()

    const isAdmin = (roleData as { role?: string } | null)?.role === "admin"

    if (roleError || !isAdmin) {
        console.error("Error validating admin role:", roleError)
        return []
    }

    const { data, error } = await supabase
        .from("orders")
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
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching all orders:", error)
        return []
    }

    return mapOrders((data ?? []) as OrderWithItems[])
}
