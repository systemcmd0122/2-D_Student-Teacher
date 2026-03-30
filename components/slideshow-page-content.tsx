"use client"

import { motion } from "framer-motion"
import { SakuraPetals } from "@/components/sakura-petals"
import { SlideshowVideo } from "@/components/slideshow-video"
import { Footer } from "@/components/footer"

function SlideshowPageContent() {
    return (
        <main className="relative min-h-screen bg-background overflow-x-hidden">
            {/* Falling Sakura Petals */}
            <SakuraPetals />

            <div className="relative z-10">
                {/* Video Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <SlideshowVideo />
                </motion.div>

                {/* Description Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16"
                >
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 md:p-10 border border-pink-100">
                        <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                            <p>
                                このスライドショーは、2年D組の皆さんが過ごした学校生活の一部をまとめたものです。
                            </p>
                            <p>
                                ２年生の間で、多くの思い出を甲斐先生・木下先生と共に作ることができました。
                            </p>
                            <p>
                                学校行事での活動、授業での協力、そして日々の笑顔。それらすべてがこのスライドショーに詰まっています。
                            </p>
                            <p className="text-pink-600 font-semibold">
                                先生方との出会いと、クラスの仲間との絆は、これからもずっと心の中に残り続けます。
                            </p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-8 md:mt-10 pt-8 md:pt-10 border-t-2 border-pink-200"
                        >
                            <p className="text-center text-lg md:text-2xl lg:text-3xl font-bold text-pink-600 leading-relaxed">
                                たくさんの思い出をありがとうございました。<br />
                                <span className="text-pink-700 text-2xl md:text-3xl lg:text-4xl block mt-4">甲斐先生と木下先生のこれからに、<br className="md:hidden" /><span className="hidden md:inline">&nbsp;</span>幸おおからんことを。</span>
                            </p>
                        </motion.div>
                    </div>

                    {/* Message from Class */}
                    <div className="mt-10 md:mt-12 text-center">
                        <p className="text-muted-foreground text-sm md:text-base italic">
                            — 2年D組 一同より —
                        </p>
                    </div>
                </motion.section>

                {/* Footer */}
                <Footer />
            </div>
        </main>
    )
}

export { SlideshowPageContent }
