"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash, Image as ImageIcon, Edit } from "lucide-react"
import { updateProduct } from "../application/updateProduct"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CatalogProduct } from "@/features/catalog/domain/product"

interface Variant {
    size_ml: string
    price: string
}

interface EditProductDialogProps {
    product: CatalogProduct
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
    const [loading, setLoading] = useState(false)
    const [variants, setVariants] = useState<Variant[]>([])
    const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null)

    useEffect(() => {
        if (product.variants) {
            setVariants(product.variants.map(v => ({
                size_ml: v.size_ml.toString(),
                price: v.price.toString()
            })))
        } else {
            setVariants([{ size_ml: "", price: "" }])
        }
        setImagePreview(product.image_url || null)
    }, [product])

    const addVariant = () => {
        setVariants([...variants, { size_ml: "", price: "" }])
    }

    const removeVariant = (index: number) => {
        if (variants.length > 1) {
            setVariants(variants.filter((_, i) => i !== index))
        }
    }

    const updateVariantField = (index: number, field: keyof Variant, value: string) => {
        const newVariants = [...variants]
        newVariants[index][field] = value
        setVariants(newVariants)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        // Add variants as JSON string
        formData.append("variants", JSON.stringify(variants))
        formData.append("existing_image_url", product.image_url || "")

        const result = await updateProduct(formData, product.id)

        if (result.success) {
            toast.success("Producto actualizado con éxito")
            onOpenChange(false)
        } else {
            toast.error(result.error || "Error al actualizar el producto")
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] glass-morphism border-amber-500/20 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Producto</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles de la fragancia.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    {/* Basic Info */}
                    <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Nombre</Label>
                            <Input id="edit-name" name="name" defaultValue={product.name} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-brand" className="text-right">Marca</Label>
                            <Input id="edit-brand" name="brand" defaultValue={product.brand} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-gender" className="text-right">Género</Label>
                            <div className="col-span-3">
                                <Select name="gender" defaultValue={product.gender}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona género" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hombre">Hombre</SelectItem>
                                        <SelectItem value="mujer">Mujer</SelectItem>
                                        <SelectItem value="unisex">Unisex</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-description" className="text-right">Descripción</Label>
                            <Input id="edit-description" name="description" defaultValue={product.description || ""} className="col-span-3" />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Imagen</Label>
                        <div className="col-span-3 space-y-2">
                            <div className="relative group cursor-pointer border-2 border-dashed border-amber-500/20 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-amber-500/5 transition-colors">
                                <Input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="h-32 w-auto object-contain rounded" />
                                ) : (
                                    <>
                                        <ImageIcon className="h-8 w-8 text-amber-500/40 mb-2" />
                                        <span className="text-xs text-muted-foreground text-center">Cambiar imagen</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="font-bold text-amber-500">Variantes (Tamaño + Precio)</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addVariant} className="h-8 border-amber-500/20 text-xs">
                                <Plus className="h-3 w-3 mr-1" /> Añadir
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {variants.map((variant, index) => (
                                <div key={index} className="flex gap-3 items-end">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">ML</Label>
                                        <Input
                                            placeholder="10"
                                            type="number"
                                            value={variant.size_ml}
                                            onChange={(e) => updateVariantField(index, "size_ml", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Precio ($)</Label>
                                        <Input
                                            placeholder="15.00"
                                            type="number"
                                            step="0.01"
                                            value={variant.price}
                                            onChange={(e) => updateVariantField(index, "price", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeVariant(index)}
                                        disabled={variants.length === 1}
                                        className="mb-0.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 w-full font-bold">
                            {loading ? "Actualizando..." : "Actualizar Producto"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
