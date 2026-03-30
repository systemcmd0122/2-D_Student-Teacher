'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            })

            const data = await response.json()

            if (response.ok) {
                // ローカルストレージにも記録（クライアント側の状態確認用）
                localStorage.setItem('auth_status', JSON.stringify({
                    authenticated: true,
                    loginTime: new Date().toISOString()
                }))

                // ホームページにリダイレクト
                router.push('/')
                router.refresh()
            } else {
                setError(data.error || 'ログインに失敗しました')
            }
        } catch (err) {
            setError('エラーが発生しました。もう一度試してください。')
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4">
            <Card className="w-full max-w-md p-8 shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        2年D組
                    </h1>
                    <p className="text-gray-600">
                        先生へのメッセージサイト
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            パスワード
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="パスワードを入力"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="w-full"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading || !password}
                        className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                        {isLoading ? 'ログイン中...' : 'ログイン'}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    このサイトはプライバシー保護のため、
                    <br />
                    パスワードでの保護されています。
                </p>
            </Card>
        </div>
    )
}
