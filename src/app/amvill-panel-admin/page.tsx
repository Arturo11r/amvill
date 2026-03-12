import { getCatalogProducts } from "@/features/catalog/infrastructure/catalog.service"
import { AdminProductTable } from "@/features/admin/presentation/AdminProductTable"
import { AddProductDialog } from "@/features/admin/presentation/AddProductDialog"

export default async function AdminPage() {
    const products = await getCatalogProducts()

    return (
        <div className="container py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Panel Administrador</h1>
                    <p className="text-muted-foreground">Gestiona tus productos y órdenes.</p>
                </div>
                <AddProductDialog />
            </div>

            <div className="grid gap-8">
                <section>
                    <h2 className="text-xl font-bold mb-4">Catálogo de Productos</h2>
                    <div className="glass-morphism rounded-xl overflow-hidden">
                        <AdminProductTable products={products} />
                    </div>
                </section>
            </div>
        </div>
    )
}
