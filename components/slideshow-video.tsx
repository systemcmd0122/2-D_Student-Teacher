"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"

export function SlideshowVideo() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isBuffering, setIsBuffering] = useState(false)
    const [loadProgress, setLoadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        // 全バッファ完了後にローディング終了
        const handleCanPlayThrough = () => {
            setIsLoading(false)
            setIsBuffering(false)
        }

        const handleWaiting = () => {
            setIsBuffering(true)
        }

        const handlePlaying = () => {
            setIsBuffering(false)
        }

        const handleError = () => {
            setError("動画の読み込みに失敗しました")
            setIsLoading(false)
            setIsBuffering(false)
        }

        const handleLoadStart = () => {
            setIsLoading(true)
            setLoadProgress(0)
        }

        // ダウンロード進捗を表示
        const handleProgress = () => {
            if (video.buffered.length > 0 && video.duration) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1)
                const progress = Math.round((bufferedEnd / video.duration) * 100)
                setLoadProgress(progress)
            }
        }

        video.addEventListener("canplaythrough", handleCanPlayThrough)
        video.addEventListener("waiting", handleWaiting)
        video.addEventListener("playing", handlePlaying)
        video.addEventListener("error", handleError)
        video.addEventListener("loadstart", handleLoadStart)
        video.addEventListener("progress", handleProgress)

        return () => {
            video.removeEventListener("canplaythrough", handleCanPlayThrough)
            video.removeEventListener("waiting", handleWaiting)
            video.removeEventListener("playing", handlePlaying)
            video.removeEventListener("error", handleError)
            video.removeEventListener("loadstart", handleLoadStart)
            video.removeEventListener("progress", handleProgress)
        }
    }, [])

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-xl overflow-hidden shadow-2xl"
            >
                {/* Video Container */}
                <div className="relative aspect-video bg-black">
                    {/* Loading State */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10"
                        >
                            <div className="text-center w-64">
                                <Spinner className="w-12 h-12 mx-auto mb-4 text-white" />
                                <p className="text-white text-sm md:text-base mb-3">
                                    動画を読み込み中... {loadProgress}%
                                </p>
                                {/* プログレスバー */}
                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-pink-400 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${loadProgress}%` }}
                                        transition={{ ease: "linear" }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Buffering State */}
                    {isBuffering && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10"
                        >
                            <div className="text-center">
                                <Spinner className="w-10 h-10 mx-auto mb-2 text-white" />
                                <p className="text-white text-xs md:text-sm">バッファリング中...</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black">
                            <div className="text-center text-white">
                                <p className="text-lg font-semibold mb-2">⚠️</p>
                                <p>{error}</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    ページをリロードしてお試しください
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Video Element */}
                    <video
                        ref={videoRef}
                        src="/slideshow.mp4"
                        controls
                        preload="auto"
                        className="w-full h-full"
                    >
                        お使いのブラウザは HTML5 video をサポートしていません
                    </video>
                </div>

                {/* Video Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 md:p-6"
                >
                    <h3 className="font-semibold text-foreground mb-2">思い出のスライドショー</h3>
                    <p className="text-sm text-muted-foreground">
                        佐土原高校 情報技術科 2年D組の3年間の素晴らしい思い出を集めました
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}