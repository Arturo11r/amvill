"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateOrderStatus } from "@/features/admin/application/updateOrderStatus"
import { Order } from "@/features/orders/domain/order"

type OrderStatus = Order["status"]

const statusMap: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-amber-500" },
    confirmed: { label: "Confirmado", color: "bg-green-500" },
    cancelled: { label: "Cancelado", color: "bg-destructive" },
}

interface AdminOrdersListProps {
    orders: Order[]
}

export function AdminOrdersList({ orders }: AdminOrdersListProps) {
    const router = useRouter()
    const [savingOrderId, setSavingOrderId] = useState<string | null>(null)
    const [selectedStatuses, setSelectedStatuses] = useState<Record<string, OrderStatus>>(() => (
        Object.fromEntries(orders.map((order) => [order.id, order.status])) as Record<string, OrderStatus>
    ))

    const orderTotals = useMemo(() => Object.fromEntries(
        orders.map((order) => [order.id, order.items?.reduce((acc, item) => acc + item.unit_price * item.quantity, 0) ?? 0])
    ), [orders])

    const handleStatusChange = (orderId: string, value: string) => {
        const nextStatus = value as OrderStatus
        setSelectedStatuses((prev) => ({ ...prev, [orderId]: nextStatus }))
    }

    const handleSave = async (orderId: string, currentStatus: OrderStatus) => {
        const nextStatus = selectedStatuses[orderId] ?? currentStatus

        if (nextStatus === currentStatus) {
            return
        }

        setSavingOrderId(orderId)
        const result = await updateOrderStatus(orderId, nextStatus)

        if (result.error) {
            toast.error(result.error)
            setSavingOrderId(null)
            return
        }

        toast.success("Estatus actualizado correctamente")
        router.refresh()
        setSavingOrderId(null)
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => {
                const currentStatus = order.status
                const selectedStatus = selectedStatuses[order.id] ?? currentStatus
                const isSaving = savingOrderId === order.id

                return (
                    <Card key={order.id} className="glass-morphism overflow-hidden">
                        <div className="flex flex-col gap-3 border-b bg-muted/30 p-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1">
                                <div>
                                    <span className="text-xs font-bold uppercase text-muted-foreground">ID Orden: </span>
                                    <span className="font-mono text-sm">{order.id.slice(0, 8)}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Cliente: {order.customer_name} · {order.customer_phone}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge className={statusMap[currentStatus].color}>{statusMap[currentStatus].label}</Badge>
                            </div>
                        </div>

                        <CardContent className="space-y-4 p-4">
                            <div className="space-y-2">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>
                                            {item.quantity}x {item.product?.brand} {item.product?.name}
                                        </span>
                                        <span className="font-bold">${item.unit_price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid gap-2 rounded-lg border bg-background/50 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                <Select value={selectedStatus} onValueChange={(value) => handleStatusChange(order.id, value)}>
                                    <SelectTrigger className="sm:w-[220px]">
                                        <SelectValue placeholder="Selecciona estatus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pendiente</SelectItem>
                                        <SelectItem value="confirmed">Confirmado</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    onClick={() => handleSave(order.id, currentStatus)}
                                    disabled={isSaving || selectedStatus === currentStatus}
                                    className="sm:w-auto"
                                >
                                    {isSaving ? "Guardando..." : "Guardar estatus"}
                                </Button>
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="text-xs text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString("es-ES")}
                                </span>
                                <span className="font-bold text-amber-500">Total: ${orderTotals[order.id] ?? 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
