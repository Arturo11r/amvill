"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ShoppingCart, User, LogOut, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { createClient } from "@/utils/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Navbar() {
    const itemCount = useCartStore((state) => state.getItemCount())
    const [isOpen, setIsOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (pathname.startsWith('/amvill-panel-admin')) {
            return
        }

        const supabase = createClient()

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null)
        })

        return () => subscription.unsubscribe()
    }, [pathname])

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
    }

    if (pathname.startsWith('/amvill-panel-admin')) {
        return null
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between mx-auto">
                <div className="flex items-center gap-4">
                    <Button variant={"ghost"} size={"icon"} className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/amvil.png"
                            alt="AMVILL Logo"
                            width={120}
                            height={40}
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium hover:text-amber-500 transition-colors">Inicio</Link>
                    <Link href="/catalog" className="text-sm font-medium hover:text-amber-500 transition-colors">Catálogo</Link>
                    <Link href="/ofertas" className="text-sm font-medium hover:text-amber-500 transition-colors">Ofertas</Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Cambiar tema</span>
                    </Button>

                    {user ? (
                        <div className="flex items-center gap-1">
                            <Link href="/profile">
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={handleSignOut}>
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/auth">
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                                    {itemCount}
                                </span>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t p-4 bg-background">
                    <nav className="flex flex-col gap-4">
                        <Link href="/" className="text-sm font-medium" onClick={() => setIsOpen(false)}>Inicio</Link>
                        <Link href="/catalog" className="text-sm font-medium" onClick={() => setIsOpen(false)}>Catálogo</Link>
                        <Link href="/ofertas" className="text-sm font-medium" onClick={() => setIsOpen(false)}>Ofertas</Link>
                        {user && (
                            <button onClick={handleSignOut} className="text-sm font-medium text-left">Cerrar Sesión</button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
