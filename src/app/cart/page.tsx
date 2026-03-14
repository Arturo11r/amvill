"use client"

import { useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createOrder } from "@/features/orders/application/createOrder"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CheckoutFormData {
    name: string
    email: string
    phone: string
    shippingAddress: string
    notes: string
}

type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>

const INITIAL_FORM_DATA: CheckoutFormData = {
    name: "",
    email: "",
    phone: "",
    shippingAddress: "",
    notes: "",
}

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
    const router = useRouter()
    const [showCheckoutForm, setShowCheckoutForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM_DATA)
    const [formErrors, setFormErrors] = useState<CheckoutFormErrors>({})

    const validateForm = () => {
        const errors: CheckoutFormErrors = {}

        if (!formData.name.trim()) errors.name = "El nombre es obligatorio."
        if (!formData.phone.trim()) errors.phone = "El teléfono es obligatorio."
        if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
            errors.email = "Ingresa un correo válido."
        }
        if (!formData.shippingAddress.trim()) {
            errors.shippingAddress = "La dirección de envío es obligatoria."
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleFieldChange = (field: keyof CheckoutFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const handleCheckout = async () => {
        const total = getTotal()
        if (total === 0) return
        if (!validateForm()) {
            toast.error("Revisa los datos del formulario.")
            return
        }

        setIsSubmitting(true)

        try {
            const { success, error } = await createOrder(items, {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim() || null,
                shippingAddress: formData.shippingAddress.trim(),
                notes: formData.notes.trim() || null,
            })

            if (success) {
                toast.success("¡Orden creada con éxito!")
                clearCart()
                router.push("/profile")
            } else {
                toast.error(error || "Error al crear la orden.")
            }
        } catch {
            toast.error("Ocurrió un error inesperado al crear la orden.")
        } finally {
            setIsSubmitting(false)
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

                            {!showCheckoutForm ? (
                                <Button
                                    className="w-full bg-amber-500 hover:bg-amber-600 font-bold h-12"
                                    onClick={() => setShowCheckoutForm(true)}
                                >
                                    Crear tu pedido
                                </Button>
                            ) : (
                                <div className="space-y-3 border rounded-md p-3 bg-background/40">
                                    <div className="space-y-1">
                                        <Label htmlFor="checkout-name">Nombre completo</Label>
                                        <Input
                                            id="checkout-name"
                                            value={formData.name}
                                            onChange={(e) => handleFieldChange("name", e.target.value)}
                                            placeholder="Ej. Juan Perez"
                                        />
                                        {formErrors.name ? <p className="text-xs text-destructive">{formErrors.name}</p> : null}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="checkout-phone">Teléfono</Label>
                                        <Input
                                            id="checkout-phone"
                                            value={formData.phone}
                                            onChange={(e) => handleFieldChange("phone", e.target.value)}
                                            placeholder="Ej. 5512345678"
                                        />
                                        {formErrors.phone ? <p className="text-xs text-destructive">{formErrors.phone}</p> : null}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="checkout-address">Dirección</Label>
                                        <Input
                                            id="checkout-address"
                                            value={formData.shippingAddress}
                                            onChange={(e) => handleFieldChange("shippingAddress", e.target.value)}
                                            placeholder="Calle, numero, colonia y referencias"
                                        />
                                        {formErrors.shippingAddress ? <p className="text-xs text-destructive">{formErrors.shippingAddress}</p> : null}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="checkout-email">Correo (opcional)</Label>
                                        <Input
                                            id="checkout-email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleFieldChange("email", e.target.value)}
                                            placeholder="tu@email.com"
                                        />
                                        {formErrors.email ? <p className="text-xs text-destructive">{formErrors.email}</p> : null}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="checkout-notes">Notas (opcional)</Label>
                                        <textarea
                                            id="checkout-notes"
                                            value={formData.notes}
                                            onChange={(e) => handleFieldChange("notes", e.target.value)}
                                            placeholder="Instrucciones adicionales para tu pedido"
                                            rows={3}
                                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 pt-1">
                                        <Button
                                            className="w-full bg-amber-500 hover:bg-amber-600 font-bold h-11"
                                            onClick={handleCheckout}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Creando pedido..." : "Confirmar y crear pedido"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                setShowCheckoutForm(false)
                                                setFormErrors({})
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            Volver al resumen
                                        </Button>
                                    </div>
                                </div>
                            )}
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
