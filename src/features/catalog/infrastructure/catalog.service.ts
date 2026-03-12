import { createClient } from "@/utils/supabase/server"
import { CatalogProduct } from "../domain/product"

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
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

    return (data as any[]).map(product => {
        const variants = product.product_variants || []
        const activeVariants = variants.filter((v: any) => v.is_active)
        const minPrice = activeVariants.length > 0
            ? Math.min(...activeVariants.map((v: any) => v.price))
            : 0

        return {
            ...product,
            variants: activeVariants,
            minPrice
        }
    })
}
