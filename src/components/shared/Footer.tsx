export function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <span className="text-xl font-bold text-amber-500">AMVILL</span>
                        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                            Especialistas en decants de perfumes originales. La fragancia de tus sueños en el tamaño que necesitas.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Tienda</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Catálogo</li>
                            <li>Novedades</li>
                            <li>Hombres</li>
                            <li>Mujeres</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Ayuda</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Envíos</li>
                            <li>Contacto</li>
                            <li>FAQ</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} AMVILL. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}
