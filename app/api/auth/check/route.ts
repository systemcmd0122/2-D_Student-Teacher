import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const authToken = request.cookies.get('auth_token')

        if (authToken && authToken.value) {
            try {
                const decoded = JSON.parse(Buffer.from(authToken.value, 'base64').toString())
                if (decoded.authenticated) {
                    return NextResponse.json({ authenticated: true })
                }
            } catch (error) {
                console.error('Token decode error:', error)
            }
        }

        return NextResponse.json({ authenticated: false })
    } catch (error) {
        return NextResponse.json({ authenticated: false }, { status: 500 })
    }
}
