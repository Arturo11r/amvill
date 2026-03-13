"use server"

import { createClient } from "@/utils/supabase/server"
import { CartItem } from "@/store/useCartStore"
import { Database } from "@/types/database.types"

type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

interface OrderInsertResult {
    data: { id: string } | null
    error: { message: string } | null
}

interface OrderItemsInsertResult {
    error: { message: string } | null
}

interface CreateOrderCustomerInfo {
    name: string
    phone: string
    email?: string
}

export async function createOrder(items: CartItem[], customerInfo: CreateOrderCustomerInfo) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Create the order
    const newOrder: OrderInsert = {
        user_id: user?.id ?? null,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email || null,
        status: 'pending'
    }

    const ordersTable = supabase.from('orders') as unknown as {
        insert: (values: OrderInsert) => {
            select: (columns: string) => { single: () => Promise<OrderInsertResult> }
        }
    }

    const { data: order, error: orderError } = await ordersTable
        .insert(newOrder)
        .select('id')
        .single()

    if (orderError) return { error: orderError.message }
    if (!order) return { error: 'No se pudo crear la orden.' }

    // 2. Create order items
    const orderItems: OrderItemInsert[] = items.map(item => ({
        order_id: order.id,
        variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: item.price
    }))

    const orderItemsTable = supabase.from('order_items') as unknown as {
        insert: (values: OrderItemInsert[]) => Promise<OrderItemsInsertResult>
    }

    const { error: itemsError } = await orderItemsTable.insert(orderItems)

    if (itemsError) return { error: itemsError.message }

    return { success: true, orderId: order.id }
}
