"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full mb-6"
        >
          <Heart className="w-8 h-8 md:w-10 md:h-10 text-primary" fill="currentColor" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance leading-tight"
        >
          甲斐先生・木下先生
          <br className="md:hidden" />
          <span className="block mt-2">これまでありがとうございました</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-muted-foreground text-base md:text-lg lg:text-xl mb-8"
        >
          佐土原高校 情報技術科 2年D組 一同より
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto"
        >
          <div className="group relative aspect-[4/3] md:aspect-video overflow-hidden rounded-2xl shadow-2xl border-4 border-white transform hover:-rotate-1 transition-all duration-500">
            <img
              src="/memory1.jpg"
              alt="2-D 集合写真 1"
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="group relative aspect-[4/3] md:aspect-video overflow-hidden rounded-2xl shadow-2xl border-4 border-white transform hover:rotate-1 transition-all duration-500">
            <img
              src="/memory2.jpg"
              alt="2-D 集合写真 2"
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
