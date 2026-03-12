"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

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

        const { data: storageData, error: storageError } = await supabase.storage
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
    const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
            name,
            brand,
            slug,
            gender,
            description,
            image_url,
            is_active: true,
            sort_order: 0
        } as any)
        .select()
        .single()

    if (productError) {
        return { error: productError.message }
    }

    const productObj = product as any

    // 3. Insert Multiple Variants
    const variantsJson = formData.get("variants") as string
    if (variantsJson) {
        try {
            const variants = JSON.parse(variantsJson)
            if (Array.isArray(variants) && variants.length > 0) {
                const variantsToInsert = variants.map(v => ({
                    product_id: productObj.id,
                    size_ml: parseInt(v.size_ml),
                    price: parseFloat(v.price),
                    is_active: true
                }))

                const { error: variantError } = await supabase
                    .from("product_variants")
                    .insert(variantsToInsert as any)

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

    return { success: true, productId: productObj.id }
}
