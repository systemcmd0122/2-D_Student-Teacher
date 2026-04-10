"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function FarewellVideo() {
    const [isLoading, setIsLoading] = useState(true)

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
                <div
                    className="relative aspect-video bg-black"
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 animate-pulse">
                            <p className="text-white text-sm">読み込み中...</p>
                        </div>
                    )}

                    <iframe
                        src="https://www.youtube-nocookie.com/embed/B1VYhbDi1WU?rel=0&modestbranding=1"
                        title="離任式当日のお別れ会"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={() => setIsLoading(false)}
                    ></iframe>
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
