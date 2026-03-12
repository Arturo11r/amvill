import { createClient } from "@/utils/supabase/client"

export async function login(email: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    })
    return { error }
}

export async function logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    return { error }
}
