"use client"

import { motion } from "framer-motion"
import { YouTubePlayer } from "./youtube-player"

export function SlideshowVideo() {
    return (
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-xl overflow-hidden shadow-2xl bg-black"
            >
                <YouTubePlayer videoId="qTbJzGTnYA8" />

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
