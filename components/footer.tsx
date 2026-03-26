"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 md:py-16 lg:py-20 mt-16 md:mt-20 border-t border-border bg-gradient-to-b from-background to-background/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center px-4 md:px-6"
      >
        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-8 pb-8 border-b border-pink-100">
          <div className="flex items-center gap-4 md:gap-8">
            <Link
              href="/"
              className="text-sm md:text-base font-medium text-gray-700 hover:text-pink-600 transition-colors"
            >
              メッセージ
            </Link>
            <span className="hidden md:inline text-gray-300">|</span>
            <Link
              href="/roster"
              className="text-sm md:text-base font-medium text-gray-700 hover:text-pink-600 transition-colors"
            >
              クラス名簿
            </Link>
          </div>
        </div>

        {/* Main Message */}
        <p className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground mb-6 text-balance leading-relaxed">
          先生方の新天地でのご活躍をお祈りしています。
        </p>

        {/* Date */}
        <p className="text-muted-foreground text-sm md:text-base mb-12">
          2026年3月 吉日
        </p>

        {/* Decorative Sakura */}
        <div className="flex justify-center gap-3 md:gap-4 mb-12">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, type: "spring", stiffness: 300 }}
              className="flex items-center justify-center"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <circle cx="12" cy="12" r="3" fill="rgba(251, 207, 232, 0.9)" />
                {[0, 72, 144, 216, 288].map((angle) => (
                  <ellipse
                    key={angle}
                    cx="12"
                    cy="12"
                    rx="7"
                    ry="3"
                    fill="rgba(251, 207, 232, 0.7)"
                    transform={`rotate(${angle} 12 12)`}
                  />
                ))}
              </svg>
            </motion.div>
          ))}
        </div>

        {/* Class Info */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
          <span>佐土原高校 情報技術科</span>
          <span className="hidden md:inline">•</span>
          <span>2年D組 一同</span>
        </div>
      </motion.div>
    </footer>
  )
}
