"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutGrid, LogOut, Menu, Moon, ShoppingBag, Sun, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { useTheme } from "next-themes"

interface AdminSidebarLayoutProps {
    children: React.ReactNode
}

const navigation = [
    {
        href: "/amvill-panel-admin",
        label: "Productos",
        icon: LayoutGrid,
    },
    {
        href: "/amvill-panel-admin/pedidos",
        label: "Pedidos",
        icon: ShoppingBag,
    },
]

export function AdminSidebarLayout({ children }: AdminSidebarLayoutProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [isSigningOut, setIsSigningOut] = useState(false)
    const { resolvedTheme, setTheme } = useTheme()
    const router = useRouter()

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    const handleSignOut = async () => {
        setIsSigningOut(true)
        const supabase = createClient()

        try {
            await supabase.auth.signOut()
            setIsOpen(false)
            router.push("/amvill-panel-admin/login")
            router.refresh()
        } finally {
            setIsSigningOut(false)
        }
    }

    return (
        <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
            <aside className="hidden border-r bg-background md:block">
                <div className="sticky top-0 flex h-screen flex-col">
                    <div className="border-b px-6 py-5">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">AMVILL</p>
                        <p className="text-lg font-bold">Panel Admin</p>
                    </div>
                    <nav className="flex-1 space-y-2 px-4 py-5">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-amber-500 text-white"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="space-y-2 border-t p-4">
                        <Button variant="outline" className="w-full justify-start" onClick={toggleTheme}>
                            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            <span>Cambiar tema</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-destructive hover:text-destructive"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                        >
                            <LogOut className="h-4 w-4" />
                            <span>{isSigningOut ? "Cerrando sesion..." : "Cerrar sesion"}</span>
                        </Button>
                    </div>
                </div>
            </aside>

            <div className="flex min-h-screen flex-col">
                <div className="sticky top-0 z-30 border-b bg-background/95 px-4 py-3 backdrop-blur md:hidden">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">Panel Admin</p>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={toggleTheme}>
                                {resolvedTheme === "dark" ? <Sun className="h-[1.1rem] w-[1.1rem]" /> : <Moon className="h-[1.1rem] w-[1.1rem]" />}
                                <span className="sr-only">Cambiar tema</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen((prev) => !prev)}>
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                <span className="sr-only">Mostrar navegación</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="fixed inset-0 z-20 bg-black/60 md:hidden" onClick={() => setIsOpen(false)}>
                        <aside
                            className="flex h-full w-72 flex-col border-r bg-background p-4"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="border-b pb-4">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">AMVILL</p>
                                <p className="text-lg font-bold">Panel Admin</p>
                            </div>
                            <nav className="flex-1 space-y-2 py-4">
                                {navigation.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-amber-500 text-white"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {item.label}
                                        </Link>
                                    )
                                })}
                            </nav>
                            <div className="space-y-2 border-t pt-4">
                                <Button variant="outline" className="w-full justify-start" onClick={toggleTheme}>
                                    {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    <span>Cambiar tema</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-destructive hover:text-destructive"
                                    onClick={handleSignOut}
                                    disabled={isSigningOut}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>{isSigningOut ? "Cerrando sesion..." : "Cerrar sesion"}</span>
                                </Button>
                            </div>
                        </aside>
                    </div>
                )}

                <main className="flex-1">{children}</main>
            </div>
        </div>
    )
}
