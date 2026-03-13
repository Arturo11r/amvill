"use client"

import { useCartStore } from "@/store/useCartStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createOrder } from "@/features/orders/application/createOrder"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
    const router = useRouter()

    const handleCheckout = async () => {
        const total = getTotal()
        if (total === 0) return

        // Simple prompt for demo purposes
        const name = prompt("Tu nombre completo:") || ""
        const phone = prompt("Tu teléfono:") || ""

        if (!name || !phone) {
            toast.error("Por favor completa tu información.")
            return
        }

        const { success, error } = await createOrder(items, { name, phone, email: '' })

        if (success) {
            toast.success("¡Orden creada con éxito!")
            clearCart()
            router.push("/profile")
        } else {
            toast.error(error || "Error al crear la orden.")
        }
    }

    if (items.length === 0) {
        return (
            <div className="container py-20 text-center">
                <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
                    <div className="p-6 bg-muted rounded-full">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
                    <p className="text-muted-foreground">Parece que aún no has añadido ninguna fragancia a tu carrito.</p>
                    <Link href="/catalog" className="w-full">
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 font-bold">
                            Ir al Catálogo
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.variantId} className="glass-morphism overflow-hidden">
                            <CardContent className="p-4 flex gap-4 items-center">
                                <div className="relative h-20 w-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>

                                <div className="flex-1">
                                    <div className="text-xs text-muted-foreground uppercase">{item.brand}</div>
                                    <h3 className="font-bold">{item.name}</h3>
                                    <div className="text-sm text-amber-500 font-semibold">{item.size}ml - ${item.price}</div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border rounded-md">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive/80"
                                        onClick={() => removeItem(item.variantId)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card className="glass-morphism">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-xl font-bold">Resumen</h2>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>${getTotal()}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground border-b pb-4">
                                <span>Envío</span>
                                <span className="text-green-500 font-medium">Gratis</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-2">
                                <span>Total</span>
                                <span className="text-amber-500">${getTotal()}</span>
                            </div>

                            <Button
                                className="w-full bg-amber-500 hover:bg-amber-600 font-bold h-12"
                                onClick={handleCheckout}
                            >
                                Crear tu pedido
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground">
                                Puedes crear tu pedido como invitado o con tu cuenta.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
