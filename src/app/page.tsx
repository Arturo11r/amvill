import { PromotionalBanner } from "@/components/shared/PromotionalBanner"
import { getCatalogProducts } from "@/features/catalog/infrastructure/catalog.service"
import { ProductCard } from "@/features/catalog/presentation/ProductCard"

export default async function HomePage() {
  const products = await getCatalogProducts()

  return (
    <div className="pb-20">
      <PromotionalBanner />

      <section className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Nuestras Fragancias</h2>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
            <p className="text-muted-foreground">No hay productos disponibles en este momento.</p>
          </div>
        )}
      </section>
    </div>
  )
}
