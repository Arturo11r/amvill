"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { Database } from "@/types/database.types"

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
type ProductVariantInsert = Database["public"]["Tables"]["product_variants"]["Insert"]

interface FormVariant {
    size_ml: string
    price: string
}

interface ProductInsertResult {
    data: { id: string } | null
    error: { message: string } | null
}

interface VariantsInsertResult {
    error: { message: string } | null
}

export async function createProduct(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get("name") as string
    const brand = formData.get("brand") as string
    const slug = name.toLowerCase().replace(/ /g, "-") + "-" + brand.toLowerCase().replace(/ /g, "-") + "-" + Math.floor(Math.random() * 1000)
    const gender = formData.get("gender") as string
    const description = formData.get("description") as string
    const imageFile = formData.get("image") as File

    let image_url = ""

    // 1. Handle Image Upload
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
        } else {
            console.error("Storage Error:", storageError)
        }
    }

    // 2. Insert Product
    const productToInsert: ProductInsert = {
        name,
        brand,
        slug,
        gender,
        description,
        image_url,
        is_active: true,
        sort_order: 0,
    }

    const productsTable = supabase.from("products") as unknown as {
        insert: (values: ProductInsert) => {
            select: (columns: string) => { single: () => Promise<ProductInsertResult> }
        }
    }

    const { data: product, error: productError } = await productsTable
        .insert(productToInsert)
        .select("id")
        .single()

    if (productError) {
        return { error: productError.message }
    }

    if (!product) {
        return { error: "No se pudo crear el producto." }
    }

    // 3. Insert Multiple Variants
    const variantsJson = formData.get("variants") as string
    if (variantsJson) {
        try {
            const variants = JSON.parse(variantsJson) as unknown
            if (Array.isArray(variants) && variants.length > 0) {
                const variantsToInsert: ProductVariantInsert[] = variants
                    .filter(
                        (variant): variant is FormVariant =>
                            typeof variant === "object" &&
                            variant !== null &&
                            "size_ml" in variant &&
                            "price" in variant
                    )
                    .map((variant) => ({
                        product_id: product.id,
                        size_ml: parseInt(variant.size_ml, 10),
                        price: parseFloat(variant.price),
                        is_active: true,
                    }))

                const variantError = variantsToInsert.length
                    ? (await (supabase.from("product_variants") as unknown as {
                        insert: (values: ProductVariantInsert[]) => Promise<VariantsInsertResult>
                    }).insert(variantsToInsert)).error
                    : null

                if (variantError) {
                    console.error("Error creating variants:", variantError)
                }
            }
        } catch (e) {
            console.error("Error parsing variants JSON:", e)
        }
    }

    revalidatePath("/amvill-panel-admin")
    revalidatePath("/catalog")
    revalidatePath("/")

    return { success: true, productId: product.id }
}
