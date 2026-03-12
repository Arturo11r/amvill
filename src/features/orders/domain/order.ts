export interface Order {
    id: string
    user_id: string | null
    customer_name: string
    customer_phone: string
    customer_email: string | null
    notes: string | null
    status: 'pending' | 'confirmed' | 'cancelled'
    created_at: string
    items?: OrderItem[]
}

export interface OrderItem {
    id: string
    order_id: string
    variant_id: string
    quantity: number
    unit_price: number
    product?: {
        name: string
        brand: string
    }
}
