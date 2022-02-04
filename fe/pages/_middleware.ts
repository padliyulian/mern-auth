import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: { nextUrl: { pathname: any } }, ev: any) {
    const { pathname } = req.nextUrl
    if (pathname === '/') {
        return NextResponse.redirect('/auth/login')
    }
    return NextResponse.next()
}