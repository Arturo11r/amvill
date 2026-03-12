"use client"

import { useState } from "react"
import { CatalogProduct } from "@/features/catalog/domain/product"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import { EditProductDialog } from "./EditProductDialog"

interface AdminProductTableProps {
    products: CatalogProduct[]
}

export function AdminProductTable({ products }: AdminProductTableProps) {
    const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const handleEdit = (product: CatalogProduct) => {
        setEditingProduct(product)
        setIsEditOpen(true)
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                        <th className="px-6 py-3">Producto</th>
                        <th className="px-6 py-3 font-bold">Variantes</th>
                        <th className="px-6 py-3">Precio Min</th>
                        <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y border-b">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {product.image_url && (
                                        <img src={product.image_url} alt={product.name} className="h-10 w-10 rounded object-cover border border-amber-500/10" />
                                    )}
                                    <div>
                                        <div className="font-bold">{product.name}</div>
                                        <div className="text-xs text-muted-foreground">{product.brand}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {product.variants?.map(v => `${v.size_ml}ml`).join(", ") || "Sin variantes"}
                            </td>
                            <td className="px-6 py-4 font-bold text-amber-500">
                                ${product.minPrice}
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingProduct && (
                <EditProductDialog
                    product={editingProduct}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                />
            )}
        </div>
    )
}
