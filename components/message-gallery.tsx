"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageCard, type MessageCardData } from "./message-card"

interface MessageGalleryProps {
  cards: MessageCardData[]
  activeTeacher: "kai" | "kisita"
  onImageClick: (images: string[], startIndex: number) => void
}

export function MessageGallery({ cards, activeTeacher, onImageClick }: MessageGalleryProps) {
  const filteredCards = cards.filter((card) => card.teacher === activeTeacher)

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {filteredCards.length > 0 ? (
          <motion.div
            key={activeTeacher}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 auto-rows-max"
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
          </motion.div>
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
      </AnimatePresence>
    </div>
  )
}
