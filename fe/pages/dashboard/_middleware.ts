import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: { cookies: any }) {
    if (!req.cookies.token) {
        return NextResponse.redirect('/auth/login')
    }
    console.log(req.cookies.token)
    return NextResponse.next()
}