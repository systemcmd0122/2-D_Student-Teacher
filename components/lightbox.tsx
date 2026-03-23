"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState, useCallback } from "react"

interface LightboxProps {
  images: string[]
  initialIndex: number
  onClose: () => void
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        goToPrev()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    if (images.length > 0) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [images.length, onClose, goToPrev, goToNext])

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    goToPrev()
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    goToNext()
  }

  return (
    <AnimatePresence>
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-lg hover:bg-accent transition-colors z-50"
            onClick={onClose}
            aria-label="閉じる"
          >
            <X className="w-6 h-6 text-foreground" />
          </motion.button>

          {/* Main Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl max-h-[90vh] aspect-square flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative w-full h-full">
              <Image
                src={images[currentIndex]}
                alt="メッセージカード"
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 512px"
                priority
                quality={95}
              />
            </div>

            {/* Navigation Buttons - Outside Image */}
            {images.length > 1 && (
              <>
                <motion.button
                  onClick={handlePrev}
                  className="absolute -left-20 md:-left-24 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 bg-card/90 hover:bg-primary backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="前の画像"
                >
                  <ChevronLeft className="w-7 h-7 md:w-8 md:h-8 text-foreground" />
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="absolute -right-20 md:-right-24 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 bg-card/90 hover:bg-primary backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="次の画像"
                >
                  <ChevronRight className="w-7 h-7 md:w-8 md:h-8 text-foreground" />
                </motion.button>

                {/* Image Indicators */}
                <motion.div
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {images.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentIndex(i)
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${i === currentIndex ? "bg-primary w-8" : "bg-card/60 w-2 hover:bg-card/80"
                        }`}
                      whileHover={{ scale: 1.2 }}
                      initial={false}
                      animate={{ width: i === currentIndex ? 32 : 8 }}
                      aria-label={`${i + 1}枚目の画像に移動`}
                    />
                  ))}
                </motion.div>

                {/* Image Counter */}
                <motion.div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 text-sm text-card/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentIndex + 1} / {images.length}
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
