const supabaseUrl = process.env.AMVILL_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonToken = process.env.AMVILL_SUPABASE_ANON_TOKEN ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function hasSupabasePublicEnv() {
    return Boolean(supabaseUrl && supabaseAnonToken)
}

export function getSupabasePublicEnv() {
    if (!supabaseUrl || !supabaseAnonToken) {
        throw new Error(
            'Missing Supabase env vars. Set AMVILL_SUPABASE_URL and AMVILL_SUPABASE_ANON_TOKEN (or temporary NEXT_PUBLIC fallbacks).'
        )
    }

    return { supabaseUrl, supabaseAnonToken }
}
