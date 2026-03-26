"use client"

import { motion } from "framer-motion"

export function AlbumLoadingScreen() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="py-8 md:py-12"
        >
            {/* メッセージを読み込み中テキスト */}
            <div className="text-center mb-8">
                <p className="text-muted-foreground text-base md:text-lg mb-2">
                    メッセージを読み込み中...
                </p>
                <div className="flex gap-2 justify-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-pink-400"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{
                                duration: 1.2,
                                delay: i * 0.15,
                                repeat: Infinity,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* アルバムグリッドスケルトン */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-max">
                {[...Array(8)].map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: index * 0.05,
                            duration: 0.3,
                        }}
                        className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg overflow-hidden border border-gray-200"
                    >
                        {/* 画像プレースホルダー */}
                        <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                        </div>

                        {/* テキストプレースホルダー */}
                        <div className="p-3 space-y-2">
                            <motion.div
                                className="h-4 bg-gray-200 rounded"
                                animate={{ opacity: [0.5, 0.7, 0.5] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                }}
                                style={{ width: "60%" }}
                            />
                            <motion.div
                                className="h-3 bg-gray-100 rounded"
                                animate={{ opacity: [0.5, 0.7, 0.5] }}
                                transition={{
                                    duration: 1.5,
                                    delay: 0.1,
                                    repeat: Infinity,
                                }}
                                style={{ width: "40%" }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
