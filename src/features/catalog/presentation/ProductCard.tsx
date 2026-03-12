"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { CatalogProduct } from "../domain/product"
import { useCartStore } from "@/store/useCartStore"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductCardProps {
    product: CatalogProduct
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem)

    // Sort variants by size ml
    const sortedVariants = [...(product.variants || [])].sort((a, b) => a.size_ml - b.size_ml)
    const [selectedVariant, setSelectedVariant] = useState(sortedVariants[0] || null)

    const handleAddToCart = () => {
        if (!selectedVariant) return

        addItem({
            id: selectedVariant.id,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            size: selectedVariant.size_ml,
            price: selectedVariant.price,
            quantity: 1,
            image: product.image_url || '/placeholder.png'
        })

        toast.success(`Añadido: ${product.name} (${selectedVariant.size_ml}ml)`)
    }

    return (
        <Card className="overflow-hidden glass-morphism group flex flex-col h-full border-amber-500/10 hover:border-amber-500/30 transition-all duration-300">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase border border-white/10">
                    {product.gender}
                </div>
            </div>

            <CardContent className="p-4 flex-1">
                <div className="mb-0.5 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    {product.brand}
                </div>
                <h3 className="font-black text-lg leading-tight mb-2 uppercase tracking-tighter">
                    {product.name}
                </h3>

                {/* Variant Slider / Selector */}
                {sortedVariants.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                        {sortedVariants.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setSelectedVariant(v)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap",
                                    selectedVariant?.id === v.id
                                        ? "bg-amber-500 border-amber-500 text-white"
                                        : "border-amber-500/20 text-muted-foreground hover:border-amber-500/50"
                                )}
                            >
                                {v.size_ml} ml
                            </button>
                        ))}
                    </div>
                )}

                <p className="text-xs text-muted-foreground line-clamp-2 italic">
                    {product.description}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Precio</span>
                    <div className="text-2xl font-black text-amber-500 tracking-tighter">
                        ${selectedVariant?.price || product.minPrice}
                    </div>
                </div>
                <Button
                    size="icon"
                    className="rounded-xl h-12 w-12 bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="h-5 w-5" />
                </Button>
            </CardFooter>
        </Card>
    )
}

// Simple toast mock or import
import { toast } from "sonner"
