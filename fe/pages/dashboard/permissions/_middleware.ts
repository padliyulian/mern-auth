import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function middleware(req: { cookies: any }) {
    const user: any = jwt.decode(req.cookies.token)
    if (user.role !== 'admin') {
        return NextResponse.redirect('/dashboard')
    }
    return NextResponse.next()
}