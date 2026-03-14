import { createClient } from "@/utils/supabase/server"
import { CatalogProduct } from "../domain/product"
import { Database } from "@/types/database.types"
import { hasSupabasePublicEnv } from "@/utils/supabase/env"

type ProductRow = Database["public"]["Tables"]["products"]["Row"]
type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"]
type ProductWithVariants = ProductRow & { product_variants: ProductVariantRow[] | null }

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
    if (!hasSupabasePublicEnv()) {
        console.warn('Supabase env vars are missing. Returning empty catalog during prerender.')
        return []
    }

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      product_variants (*)
    `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

    if (error) {
        console.error('Error fetching catalog:', error)
        return []
    }

    return ((data ?? []) as ProductWithVariants[]).map((product) => {
        const variants = product.product_variants ?? []
        const activeVariants = variants.filter((variant) => variant.is_active)
        const gender =
            product.gender === "hombre" || product.gender === "mujer" || product.gender === "unisex"
                ? product.gender
                : "unisex"
        const minPrice = activeVariants.length > 0
            ? Math.min(...activeVariants.map((variant) => variant.price))
            : 0

        return {
            ...product,
            gender,
            variants: activeVariants,
            minPrice
        }
    })
}
