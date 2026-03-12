import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PromotionalBanner() {
    return (
        <section className="container py-8">
            <div className="relative overflow-hidden rounded-3xl premium-amber-gradient px-8 py-12 md:px-16 md:py-20 text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Ofertas de Temporada
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                        Descubre nuestras fragancias más exclusivas en formato decant con hasta un 30% de descuento.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/catalog">
                            <Button size="lg" className="bg-white text-amber-600 hover:bg-white/90 font-bold">
                                Ver Ofertas
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
            </div>
        </section>
    )
}
