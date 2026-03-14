import { getCatalogProducts } from "@/features/catalog/infrastructure/catalog.service"
import { AdminProductTable } from "@/features/admin/presentation/AdminProductTable"
import { AddProductDialog } from "@/features/admin/presentation/AddProductDialog"

export default async function AdminPage() {
    const products = await getCatalogProducts()

    return (
        <div className="container py-8 md:py-10">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Panel Administrador</h1>
                    <p className="text-muted-foreground">Gestiona tus productos y pedidos desde un solo lugar.</p>
                </div>
                <AddProductDialog />
            </div>

            <section>
                <h2 className="mb-4 text-xl font-bold">Catalogo de Productos</h2>
                <div className="glass-morphism overflow-hidden rounded-xl">
                    <AdminProductTable products={products} />
                </div>
            </section>
        </div>
    )
}
