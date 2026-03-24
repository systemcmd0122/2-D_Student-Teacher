"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface MessageCardData {
  id: string
  studentName: string
  teacher: "kai" | "kisita"
  images: string[]
}

interface MessageCardProps {
  card: MessageCardData
  index: number
  onImageClick: (images: string[], startIndex: number) => void
}

export function MessageCard({ card, index, onImageClick }: MessageCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const hasMultipleImages = card.images.length > 1

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + card.images.length) % card.images.length)
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % card.images.length)
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageClick(card.images, currentImageIndex)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-2 bg-gradient-to-r from-primary/40 via-accent/20 to-primary/40 rounded-xl blur-xl opacity-0 -z-10"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative overflow-hidden rounded-xl bg-card cursor-pointer"
        animate={{
          boxShadow: isHovered
            ? "0 20px 40px rgba(251, 207, 232, 0.25), 0 8px 16px rgba(0, 0, 0, 0.1)"
            : "0 4px 6px rgba(0, 0, 0, 0.07)",
        }}
        transition={{ duration: 0.3 }}
        onClick={handleImageClick}
      >
        {/* Stacked effect for multiple images - Enhanced */}
        {hasMultipleImages && (
          <>
            <motion.div
              className="absolute -right-2 -bottom-2 w-full h-full bg-accent/50 rounded-xl transform -z-10"
              animate={{ rotate: isHovered ? 3 : 2 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute -right-1 -bottom-1 w-full h-full bg-accent/70 rounded-xl transform -z-10"
              animate={{ rotate: isHovered ? 2 : 1 }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}

        <motion.div
          className="relative aspect-square overflow-hidden bg-background"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Image */}
          <Image
            src={card.images[currentImageIndex]}
            alt={`${card.studentName}からのメッセージ`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={90}
          />

          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Image navigation for multiple images - Hover only */}
          {hasMultipleImages && isHovered && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors shadow-lg hover:shadow-xl"
                aria-label="前の画像"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors shadow-lg hover:shadow-xl"
                aria-label="次の画像"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </motion.button>
            </>
          )}

          {/* Image indicators */}
          {hasMultipleImages && (
            <motion.div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-15"
              animate={{ opacity: isHovered ? 1 : 0.6 }}
              transition={{ duration: 0.3 }}
            >
              {card.images.map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2 rounded-full transition-all ${i === currentImageIndex ? "bg-primary w-4" : "bg-card/60 w-2"
                    }`}
                  initial={false}
                  animate={{ width: i === currentImageIndex ? 16 : 8 }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Student name overlay - Enhanced */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/90 via-foreground/60 to-transparent p-3 md:p-4"
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className="text-card text-sm md:text-base font-semibold drop-shadow-lg line-clamp-2"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {card.studentName}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
