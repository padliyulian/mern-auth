import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function middleware(req: { cookies: any }) {
    if (!req.cookies.token) {
        return NextResponse.redirect('/auth/login')
    }

    const user: any = jwt.decode(req.cookies.token)
    const currentDate = new Date().getTime() / 1000
    if (currentDate >= user.exp) {
        console.log('token expired')
        return NextResponse.redirect('/auth/logout')
    }

    // console.log(req.cookies.token)
    return NextResponse.next()
}