"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export function Hero() {
  // タイトルの文字列を分割
  const title1 = "甲斐先生・木下先生"
  const title2 = "これまでありがとうございました"

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="relative py-16 md:py-24 lg:py-32 text-center overflow-hidden">
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-primary/5 blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4"
      >
        {/* Animated heart icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-6 relative"
        >
          {/* Pulsing background aura */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 blur-lg"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Heart
              className="w-8 h-8 md:w-10 md:h-10 text-primary"
              fill="currentColor"
            />
          </motion.div>
        </motion.div>

        {/* Main title with staggered character animation */}
        <motion.h1
          className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance leading-tight"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* First line */}
          <div className="flex flex-wrap justify-center gap-0.5">
            {title1.split("").map((char, index) => (
              <motion.span key={index} variants={itemVariants}>
                {char === "・" ? (
                  <span className="mx-1">・</span>
                ) : (
                  char
                )}
              </motion.span>
            ))}
          </div>

          {/* Line break for mobile */}
          <br className="md:hidden" />

          {/* Second line */}
          <motion.span
            className="block mt-2"
            variants={containerVariants}
          >
            <div className="flex flex-wrap justify-center gap-0.5">
              {title2.split("").map((char, index) => (
                <motion.span
                  key={`title2-${index}`}
                  variants={itemVariants}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-muted-foreground text-base md:text-lg lg:text-xl mb-8"
        >
          佐土原高校 情報技術科 2年D組 一同より
        </motion.p>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
          className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto origin-center"
        />

        {/* Floating accent elements - Desktop only */}
        <div className="hidden md:block absolute top-10 left-5 md:left-10">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary/20 text-2xl"
          >
            ✨
          </motion.div>
        </div>
        <div className="hidden md:block absolute bottom-20 right-5 md:right-10">
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [360, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary/20 text-2xl"
          >
            ✨
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
