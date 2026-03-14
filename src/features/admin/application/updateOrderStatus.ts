"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { Database } from "@/types/database.types"

const allowedStatuses = ["pending", "confirmed", "cancelled"] as const

type AllowedStatus = (typeof allowedStatuses)[number]
type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"]

function isAllowedStatus(status: string): status is AllowedStatus {
    return allowedStatuses.includes(status as AllowedStatus)
}

export async function updateOrderStatus(orderId: string, status: string) {
    if (!orderId) {
        return { error: "No se encontro el pedido." }
    }

    if (!isAllowedStatus(status)) {
        return { error: "El estatus enviado no es valido." }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Debes iniciar sesion para realizar esta accion." }
    }

    const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle()

    const isAdmin = (roleData as { role?: string } | null)?.role === "admin"

    if (roleError || !isAdmin) {
        return { error: "No tienes permisos para actualizar pedidos." }
    }

    const ordersTable = supabase.from("orders") as unknown as {
        update: (values: OrderUpdate) => {
            eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>
        }
    }

    const { error } = await ordersTable
        .update({ status })
        .eq("id", orderId)

    if (error) {
        return { error: "No se pudo actualizar el estatus del pedido." }
    }

    revalidatePath("/amvill-panel-admin/pedidos")

    return { success: true }
}
