"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"

export function FarewellVideo() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isBuffering, setIsBuffering] = useState(false)
    const [loadProgress, setLoadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

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
        <section className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    離任式当日のお別れ会
                </h2>
                <div className="w-16 h-1 bg-pink-400 mx-auto rounded-full"></div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
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
                            <div className="text-center text-white p-4">
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
                        src="/api/video-farewell"
                        controls
                        preload="metadata"
                        className="w-full h-full"
                    >
                        お使いのブラウザは HTML5 video をサポートしていません
                    </video>
                </div>

                {/* Video Info */}
                <div className="bg-white p-4 md:p-6 border-t border-gray-100">
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        離任式の当日、教室で行われた最後のお別れ会の様子です。
                        先生方への感謝の気持ちを込めた、大切なひとときを振り返ります。
                    </p>
                </div>
            </motion.div>
        </section>
    )
}
