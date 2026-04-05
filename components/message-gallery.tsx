"use client"

import { motion } from "framer-motion"
import { MessageCard, type MessageCardData } from "./message-card"

interface MessageGalleryProps {
  cards: MessageCardData[]
  activeTeacher: "kai" | "kinoshita"
  onImageClick: (images: string[], startIndex: number) => void
  isDetailView?: boolean
}

export function MessageGallery({ cards, activeTeacher, onImageClick, isDetailView }: MessageGalleryProps) {
  const filteredCards = cards.filter((card) => card.teacher === activeTeacher)

  // 詳細ビューの場合で、フィルタ後のカードが2枚以下の場合、大きく表示
  const gridClass = isDetailView && filteredCards.length <= 2
    ? "grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"

  return (
    <div className="w-full">
      {filteredCards.length > 0 ? (
        <div
          className={`${gridClass} auto-rows-max`}
        >
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <MessageCard
                card={card}
                index={index}
                onImageClick={onImageClick}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 md:py-24"
        >
          <p className="text-muted-foreground text-lg md:text-xl">
            メッセージはまだありません
          </p>
        </motion.div>
      )}
    </div>
  )
}
