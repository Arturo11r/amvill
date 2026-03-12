export interface Product {
    id: string
    slug: string
    brand: string
    name: string
    flanker?: string | null
    gender: 'hombre' | 'mujer' | 'unisex'
    concentration?: string | null
    description?: string | null
    image_url?: string | null
    variants?: ProductVariant[]
}

export interface ProductVariant {
    id: string
    product_id: string
    size_ml: number
    price: number
    is_active: boolean
}

export interface CatalogProduct extends Product {
    minPrice: number
}
