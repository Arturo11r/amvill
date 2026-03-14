"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const supabase = createClient()

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            toast.error(error.message)
        } else {
            // Check if user is admin
            const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', data.user.id)
                .single()

            const isAdmin = (roleData as { role?: string } | null)?.role === "admin"

            if (isAdmin) {
                toast.success("Sesión iniciada correctamente")
                router.push("/amvill-panel-admin")
                router.refresh()
            } else {
                toast.error("Acceso denegado: No tienes permisos de administrador")
                await supabase.auth.signOut()
            }
        }
        setLoading(false)
    }

    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] mx-auto">
            <Card className="w-full max-w-md glass-morphism border-amber-500/20 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/amvil.png"
                            alt="AMVILL Logo"
                            width={128}
                            height={64}
                            className="h-16 w-auto object-contain"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-amber-500 uppercase tracking-widest">
                        Panel Admin
                    </CardTitle>
                    <CardDescription>
                        Acceso exclusivo para administradores de Amvill.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleAdminLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@amvill.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/5 border-amber-500/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/5 border-amber-500/20"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full bg-amber-500 hover:bg-amber-600 font-bold"
                            disabled={loading}
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
