import { NextRequest, NextResponse } from 'next/server'

// シンプルなパスワード認証
// 2-Dに関連するパスワード（2-D佐土原）
const CORRECT_PASSWORD = process.env.SITE_PASSWORD || '2DSadohara'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const password = (body.password || '').trim()

        if (!password) {
            return NextResponse.json(
                { error: 'パスワードが入力されていません' },
                { status: 400 }
            )
        }

        console.log('Received password:', password)
        console.log('Expected password:', CORRECT_PASSWORD)
        console.log('Password length:', password.length)
        console.log('Expected length:', CORRECT_PASSWORD.length)
        console.log('Match result:', password === CORRECT_PASSWORD)

        if (password === CORRECT_PASSWORD) {
            const response = NextResponse.json(
                { success: true, message: 'ログインに成功しました' },
                { status: 200 }
            )

            // セッションクッキーを設定（セッションが終了するまで保持）
            response.cookies.set({
                name: 'auth_token',
                value: Buffer.from(JSON.stringify({
                    authenticated: true,
                    timestamp: Date.now()
                })).toString('base64'),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60, // 7日間
                path: '/',
            })

            return response
        } else {
            return NextResponse.json(
                { error: 'パスワードが間違っています' },
                { status: 401 }
            )
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'エラーが発生しました' },
            { status: 500 }
        )
    }
}


