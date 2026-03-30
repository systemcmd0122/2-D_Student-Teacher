"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"

interface LightboxProps {
  images: string[]
  initialIndex: number
  onClose: () => void
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  // クライアントサイドでのみPortalを使用するため、マウント状態を管理
  useEffect(() => {
    setMounted(true)
  }, [])

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

  const handleImageError = (src: string) => {
    setImageErrors(prev => new Set(prev).add(src))
  }

  // サーバーサイドレンダリング時のハイドレーションエラーを回避
  if (!mounted) return null

  const isCurrentImageBroken = imageErrors.has(images[currentIndex])

  const lightboxContent = (
    <AnimatePresence>
      {images.length > 0 && (
        <>
          {/* Close Button - Outside modal for proper z-indexing */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-4 md:top-6 md:right-6 w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all duration-200 z-[9999] cursor-pointer border border-gray-200"
            onClick={onClose}
            aria-label="閉じる"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-6 h-6 text-gray-800" strokeWidth={3} />
          </motion.button>

          {/* Modal backdrop and content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[998] flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4"
            onClick={onClose}
          >
            {/* Main Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl max-h-[85vh] sm:max-h-[90vh] aspect-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Error State */}
              {isCurrentImageBroken ? (
                <div className="w-full h-96 sm:h-[500px] md:h-[600px] bg-gray-700 rounded-lg flex flex-col items-center justify-center text-white">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <p className="text-lg">画像が読み込めません</p>
                  <p className="text-sm text-gray-300 mt-2">別の画像をお試しください</p>
                </div>
              ) : (
                <div className="relative w-full h-96 sm:h-[500px] md:h-[600px]">
                  <Image
                    src={images[currentIndex]}
                    alt="メッセージカード"
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 600px"
                    priority
                    quality={95}
                    onError={() => handleImageError(images[currentIndex])}
                  />
                </div>
              )}

              {/* Navigation Buttons - Responsive positioning */}
              {images.length > 1 && (
                <>
                  <motion.button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-4 md:-left-24 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/90 md:bg-card/90 hover:bg-primary text-gray-800 md:text-foreground hover:text-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="前の画像"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                  </motion.button>
                  <motion.button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-4 md:-right-24 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/90 md:bg-card/90 hover:bg-primary text-gray-800 md:text-foreground hover:text-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="次の画像"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
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
        </>
      )}
    </AnimatePresence>
  )

  // createPortalを利用して body 直下に描画することで、あらゆるz-indexの制限を突破する
  return createPortal(lightboxContent, document.body)
}