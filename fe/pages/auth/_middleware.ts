import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: any) {
    const { pathname } = req.nextUrl
    if (pathname !== '/auth/logout') {
        if (req.cookies.token) {
            return NextResponse.redirect('/dashboard')
        }
    }
    return NextResponse.next()
}