export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    slug: string
                    brand: string
                    name: string
                    flanker: string | null
                    gender: string
                    concentration: string | null
                    description: string | null
                    image_url: string | null
                    is_active: boolean
                    sort_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    brand: string
                    name: string
                    flanker?: string | null
                    gender?: string
                    concentration?: string | null
                    description?: string | null
                    image_url?: string | null
                    is_active?: boolean
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    brand?: string
                    name?: string
                    flanker?: string | null
                    gender?: string
                    concentration?: string | null
                    description?: string | null
                    image_url?: string | null
                    is_active?: boolean
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            product_variants: {
                Row: {
                    id: string
                    product_id: string
                    size_ml: number
                    price: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    size_ml: number
                    price: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    size_ml?: number
                    price?: number
                    is_active?: boolean
                    created_at?: string
                }
            }
            product_accords: {
                Row: {
                    id: string
                    product_id: string
                    accord: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    accord: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    accord?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    customer_name: string
                    customer_phone: string
                    customer_email: string | null
                    notes: string | null
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    customer_name: string
                    customer_phone: string
                    customer_email?: string | null
                    notes?: string | null
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    customer_name?: string
                    customer_phone?: string
                    customer_email?: string | null
                    notes?: string | null
                    status?: string
                    created_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    variant_id: string
                    quantity: number
                    unit_price: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    variant_id: string
                    quantity?: number
                    unit_price: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    variant_id?: string
                    quantity?: number
                    unit_price?: number
                    created_at?: string
                }
            }
            user_roles: {
                Row: {
                    user_id: string
                    role: string
                    created_at: string
                }
                Insert: {
                    user_id: string
                    role: string
                    created_at?: string
                }
                Update: {
                    user_id?: string
                    role?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            is_admin: {
                Args: Record<PropertyKey, never>
                Returns: boolean
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
