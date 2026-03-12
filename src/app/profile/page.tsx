import { getUserOrders } from "@/features/orders/infrastructure/order.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ProfilePage() {
    const orders = await getUserOrders()

    const statusMap = {
        pending: { label: 'Pendiente', color: 'bg-amber-500' },
        confirmed: { label: 'Confirmado', color: 'bg-green-500' },
        cancelled: { label: 'Cancelado', color: 'bg-destructive' }
    }

    return (
        <div className="container py-10">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <Card className="glass-morphism">
                        <CardHeader>
                            <CardTitle>Mi Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground uppercase font-bold">Estado</span>
                                <span className="text-sm">Cliente Verificado</span>
                            </div>
                            {/* Profile update form or info could go here */}
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-6">Mis Pedidos</h2>

                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="glass-morphism overflow-hidden">
                                    <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                                        <div>
                                            <span className="text-xs font-bold text-muted-foreground uppercase">ID Orden: </span>
                                            <span className="text-sm font-mono">{order.id.slice(0, 8)}</span>
                                        </div>
                                        <Badge className={statusMap[order.status].color}>
                                            {statusMap[order.status].label}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            {order.items?.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span>{item.quantity}x {item.product?.brand} {item.product?.name}</span>
                                                    <span className="font-bold">${item.unit_price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString('es-ES')}
                                            </span>
                                            <span className="font-bold text-amber-500">
                                                Total: ${order.items?.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
                            <p className="text-muted-foreground">Aún no has realizado ningún pedido.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
