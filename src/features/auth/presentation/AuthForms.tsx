"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

export function AuthForms() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const email = formData.get("email") as string

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Enlace de acceso enviado a tu correo.")
        }
        setLoading(false)
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simplified: we use magic links for both in this demo
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const email = formData.get("reg-email") as string

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Verifica tu correo para completar el registro.")
        }
        setLoading(false)
    }

    return (
        <div className="flex justify-center items-center py-12 px-4">
            <Tabs defaultValue="login" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                    <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                    <Card className="glass-morphism">
                        <CardHeader>
                            <CardTitle>Bienvenido de nuevo</CardTitle>
                            <CardDescription>
                                Ingresa tus credenciales para acceder a tu cuenta.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleLogin}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input id="email" type="email" placeholder="tu@email.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input id="password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button className="w-full bg-amber-500 hover:bg-amber-600 font-bold" disabled={loading}>
                                    {loading ? "Cargando..." : "Entrar"}
                                </Button>
                                <Button variant="link" className="text-xs text-muted-foreground underline">
                                    ¿Olvidaste tu contraseña?
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="register">
                    <Card className="glass-morphism">
                        <CardHeader>
                            <CardTitle>Crea tu cuenta</CardTitle>
                            <CardDescription>
                                Únete a AMVILL y gestiona tus pedidos fácilmente.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSignup}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reg-name">Nombre completo</Label>
                                    <Input id="reg-name" placeholder="Tu nombre" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">Correo electrónico</Label>
                                    <Input id="reg-email" type="email" placeholder="tu@email.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">Contraseña</Label>
                                    <Input id="reg-password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-amber-500 hover:bg-amber-600 font-bold" disabled={loading}>
                                    {loading ? "Registrando..." : "Crear Cuenta"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
