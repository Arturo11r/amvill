import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'
import { getSupabasePublicEnv } from './env'

export function createClient() {
    const { supabaseUrl, supabaseAnonToken } = getSupabasePublicEnv()

    return createBrowserClient<Database>(
        supabaseUrl,
        supabaseAnonToken
    )
}
