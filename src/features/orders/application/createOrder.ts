"use server"

import { createClient } from "@/utils/supabase/server"
import { CartItem } from "@/store/useCartStore"

export async function createOrder(items: CartItem[], customerInfo: { name: string; phone: string; email: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Guest orders are allowed in the DB but user requested auth to generate order
    if (!user) {
        return { error: 'Debes iniciar sesión para realizar un pedido.' }
    }

    // 1. Create the order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            customer_name: customerInfo.name,
            customer_phone: customerInfo.phone,
            customer_email: customerInfo.email || null,
            status: 'pending' as string
        } as any) // Casting to any temporarily to bypass the registry inference issue if persists
        .select()
        .single()

    if (orderError) return { error: orderError.message }

    const orderObj = order as any

    // 2. Create order items
    const orderItems = items.map(item => ({
        order_id: orderObj.id as string,
        variant_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems as any)

    if (itemsError) return { error: itemsError.message }

    return { success: true, orderId: orderObj.id }
}
