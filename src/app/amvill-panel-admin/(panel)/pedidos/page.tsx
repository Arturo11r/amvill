import { AdminOrdersList } from "@/features/admin/presentation/AdminOrdersList"
import { getAllOrders } from "@/features/orders/infrastructure/order.service"

export default async function AdminOrdersPage() {
    const orders = await getAllOrders()

    return (
        <div className="container py-8 md:py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Todos los pedidos</h1>
                <p className="text-muted-foreground">Administra los pedidos y actualiza su estatus desde un solo lugar.</p>
            </div>

            {orders.length > 0 ? (
                <AdminOrdersList orders={orders} />
            ) : (
                <div className="rounded-2xl border border-dashed bg-muted/20 py-20 text-center">
                    <p className="text-muted-foreground">No hay pedidos registrados por el momento.</p>
                </div>
            )}
        </div>
    )
}
