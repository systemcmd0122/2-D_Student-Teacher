"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface MessageCardData {
  id: string
  studentName: string
  teacher: "kai" | "kinoshita"
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden rounded-xl bg-card shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={handleImageClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Stacked effect for multiple images */}
        {hasMultipleImages && (
          <>
            <div className="absolute -right-2 -bottom-2 w-full h-full bg-accent/50 rounded-xl transform rotate-2 -z-10" />
            <div className="absolute -right-1 -bottom-1 w-full h-full bg-accent/70 rounded-xl transform rotate-1 -z-10" />
          </>
        )}

        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          className="relative aspect-square overflow-hidden bg-background"
          key={`image-${card.id}-${currentImageIndex}`}
        >
          {/* Image */}
          <Image
            key={`${card.id}-${currentImageIndex}`}
            src={card.images[currentImageIndex]}
            alt={`${card.studentName}からのメッセージ`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={90}
            priority={index < 4}
          />

          {/* Image navigation for multiple images - Hover only */}
          {hasMultipleImages && isHovered && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors shadow-md"
                aria-label="前の画像"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors shadow-md"
                aria-label="次の画像"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </motion.button>
            </>
          )}

          {/* Image indicators */}
          {hasMultipleImages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.6 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-15"
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

        {/* Student name overlay - High contrast, always visible */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent p-3 md:p-4"
          initial={{ y: 0 }}
          animate={{ y: 0 }}
        >
          <p className="text-card text-sm md:text-base font-semibold drop-shadow-md line-clamp-2">
            {card.studentName}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
