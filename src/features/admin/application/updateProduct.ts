"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { Database } from "@/types/database.types"

type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]
type ProductVariantInsert = Database["public"]["Tables"]["product_variants"]["Insert"]

interface FormVariant {
    size_ml: string
    price: string
}

interface ProductUpdateResult {
    error: { message: string } | null
}

interface VariantsInsertResult {
    error: { message: string } | null
}

export async function updateProduct(formData: FormData, productId: string) {
    const supabase = await createClient()

    const name = formData.get("name") as string
    const brand = formData.get("brand") as string
    const gender = formData.get("gender") as string
    const description = formData.get("description") as string
    const imageFile = formData.get("image") as File
    const existingImageUrl = formData.get("existing_image_url") as string

    let image_url = existingImageUrl

    // 1. Handle Image Upload if new one provided
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: storageError } = await supabase.storage
            .from('products')
            .upload(fileName, imageFile)

        if (!storageError) {
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName)
            image_url = publicUrl
        }
    }

    // 2. Update Product
    const productToUpdate: ProductUpdate = {
        name,
        brand,
        gender,
        description,
        image_url,
        updated_at: new Date().toISOString(),
    }

    const productsTable = supabase.from("products") as unknown as {
        update: (values: ProductUpdate) => {
            eq: (column: string, value: string) => Promise<ProductUpdateResult>
        }
    }

    const { error: productError } = await productsTable
        .update(productToUpdate)
        .eq("id", productId)

    if (productError) {
        return { error: productError.message }
    }

    // 3. Update Variants (Simplified: delete old ones and insert new ones)
    const variantsJson = formData.get("variants") as string
    if (variantsJson) {
        try {
            const variants = JSON.parse(variantsJson) as unknown
            if (Array.isArray(variants)) {
                // Delete old variants
                await supabase
                    .from("product_variants")
                    .delete()
                    .eq("product_id", productId)

                // Insert new ones
                const variantsToInsert: ProductVariantInsert[] = variants
                    .filter(
                        (variant): variant is FormVariant =>
                            typeof variant === "object" &&
                            variant !== null &&
                            "size_ml" in variant &&
                            "price" in variant
                    )
                    .map((variant) => ({
                        product_id: productId,
                        size_ml: parseInt(variant.size_ml, 10),
                        price: parseFloat(variant.price),
                        is_active: true,
                    }))

                if (variantsToInsert.length > 0) {
                    const variantError = (await (supabase.from("product_variants") as unknown as {
                        insert: (values: ProductVariantInsert[]) => Promise<VariantsInsertResult>
                    }).insert(variantsToInsert)).error

                    if (variantError) {
                        console.error("Error updating variants:", variantError)
                    }
                }
            }
        } catch (e) {
            console.error("Error parsing variants JSON:", e)
        }
    }

    revalidatePath("/amvill-panel-admin")
    revalidatePath("/catalog")
    revalidatePath("/")

    return { success: true }
}
