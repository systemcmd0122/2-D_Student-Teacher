'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
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
                setIsSuccess(true)
                // ローカルストレージにも記録（クライアント側の状態確認用）
                localStorage.setItem('auth_status', JSON.stringify({
                    authenticated: true,
                    loginTime: new Date().toISOString()
                }))

                // 成功演出のために少し待機してからリダイレクト
                setTimeout(() => {
                    router.push('/')
                    router.refresh()
                }, 1500)
            } else {
                setError(data.error || 'パスワードが正しくありません')
                setIsLoading(false)
            }
        } catch (err) {
            setError('エラーが発生しました。もう一度試してください。')
            console.error('Login error:', err)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="w-full p-8 shadow-xl border-pink-100 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="login-form"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                        認証
                                    </h1>
                                    <p className="text-gray-600">
                                        パスワードを入力してください
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            パスワード
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="パスワードを入力"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={isLoading}
                                                className="w-full pr-10 focus:ring-pink-500 border-pink-100"
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                        >
                                            <Alert variant="destructive" className="bg-red-50 border-red-200">
                                                <AlertDescription className="text-red-800">{error}</AlertDescription>
                                            </Alert>
                                        </motion.div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={isLoading || !password}
                                        className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold py-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                認証中...
                                            </span>
                                        ) : 'ログイン'}
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="text-center py-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="flex justify-center mb-6"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                                    </div>
                                </motion.div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">認証成功</h2>
                                <p className="text-gray-600 mb-8">思い出のページへ移動します...</p>
                                <div className="flex justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p className="text-center text-xs text-gray-400 mt-8">
                        このサイトはプライバシー保護のため、
                        <br />
                        パスワードで保護されています。
                    </p>
                </Card>
            </motion.div>
        </div>
    )
}
