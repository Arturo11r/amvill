import { AuthForms } from "@/features/auth/presentation/AuthForms"

export default function AuthPage() {
    return (
        <div className="container py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Tu Cuenta en AMVILL</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Inicia sesión para generar tus órdenes y guardar tus fragancias favoritas.
                </p>
            </div>
            <AuthForms />
        </div>
    )
}
