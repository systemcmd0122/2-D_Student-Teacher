"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function SlideshowVideo() {
    const [isLoading, setIsLoading] = useState(true)

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
                        src="https://www.youtube-nocookie.com/embed/qTbJzGTnYA8?rel=0&modestbranding=1"
                        title="思い出のスライドショー"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={() => setIsLoading(false)}
                    ></iframe>

                    {/* Overlay to discourage right-click/copy on some areas if needed,
                        but YouTube iframe handles most of it.
                        The pointer-events-none on a full overlay would block controls.
                    */}
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
