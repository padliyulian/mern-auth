import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: { cookies: any }) {
    // console.log(req.cookies)
    if (req.cookies.token) {
        return NextResponse.redirect('/dashboard')
    }
    return NextResponse.next()
}