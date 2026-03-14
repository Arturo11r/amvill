import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refreshing the auth token
    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes logic
    const path = request.nextUrl.pathname
    const isProfilePage = path.startsWith('/profile')
    const isAdminPage = path.startsWith('/amvill-panel-admin')
    const isLoginPage = path.includes('/login') || path.includes('/auth')

    // If unauthenticated and trying to access protected page (that is NOT a login page)
    if (!user && (isProfilePage || isAdminPage) && !isLoginPage) {
        const url = request.nextUrl.clone()
        url.pathname = isAdminPage ? '/amvill-panel-admin/login' : '/auth'
        return NextResponse.redirect(url)
    }

    // Role-based protection for admin
    if (isAdminPage && user) {
        const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle()

        if (roleError || roleData?.role !== 'admin') {
            console.log('Redirecting to home: Not an admin or error', roleError)
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }

        // If admin is on login page, send to dashboard
        if (isLoginPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/amvill-panel-admin'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
