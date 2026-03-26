"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { SakuraPetals } from "@/components/sakura-petals"
import { Hero } from "@/components/hero"
import { TeacherTabs } from "@/components/teacher-tabs"
import { MessageGallery } from "@/components/message-gallery"
import { Lightbox } from "@/components/lightbox"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import type { MessageCardData } from "@/components/message-card"

export default function FarewellTributePage() {
  const searchParams = useSearchParams()
  const studentName = searchParams.get('student')

  const [activeTeacher, setActiveTeacher] = useState<"kai" | "kisita">("kai")
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0)
  const [messageCards, setMessageCards] = useState<MessageCardData[]>([])
  const [loading, setLoading] = useState(true)

  const handleImageClick = (images: string[], startIndex: number) => {
    setLightboxImages(images)
    setLightboxStartIndex(startIndex)
  }

  // API から画像データを取得
  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true)
        const kaiResponse = await fetch('/api/images?teacher=kai')
        const kisitaResponse = await fetch('/api/images?teacher=kisita')

        const kaiData = kaiResponse.ok ? await kaiResponse.json() : []
        const kisitaData = kisitaResponse.ok ? await kisitaResponse.json() : []

        // API のレスポンスを MessageCardData 形式に変換
        const kaiCards: MessageCardData[] = kaiData.map((item: any, index: number) => ({
          id: `kai-${index}`,
          studentName: item.studentName,
          teacher: "kai" as const,
          images: item.images,
        }))

        const kisitaCards: MessageCardData[] = kisitaData.map((item: any, index: number) => ({
          id: `kisita-${index}`,
          studentName: item.studentName,
          teacher: "kisita" as const,
          images: item.images,
        }))

        setMessageCards([...kaiCards, ...kisitaCards])
      } catch (error) {
        console.error('画像データの読み込みに失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  // 学生モードの場合、その学生のメッセージだけをフィルタリング
  const displayCards = studentName
    ? messageCards.filter((card) => card.studentName === studentName)
    : messageCards

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Falling Sakura Petals */}
      <SakuraPetals />

      <div className="relative z-10">
        {/* Hero Section */}
        {!studentName && <Hero />}

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-8">
          {/* Student Filter Header */}
          {studentName && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 pt-8"
            >
              <div className="bg-white rounded-lg p-6 border border-pink-100 shadow-sm">
                <Link href="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-3 transition-colors">
                  <X className="w-4 h-4" />
                  <span className="text-sm">戻る</span>
                </Link>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {studentName}へのメッセージ
                </h2>
              </div>
            </motion.div>
          )}

          {/* Teacher Filter Tabs */}
          {!studentName && (
            <div className="mb-10 md:mb-14">
              <TeacherTabs
                activeTeacher={activeTeacher}
                onTeacherChange={setActiveTeacher}
              />
            </div>
          )}

          {/* Message Gallery */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="py-20 md:py-32 flex flex-col items-center justify-center gap-6"
            >
              {/* Animated loading circles */}
              <div className="flex gap-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
              <p className="text-muted-foreground text-base md:text-lg">
                メッセージを読み込み中...
              </p>
            </motion.div>
          ) : displayCards.length > 0 ? (
            <MessageGallery
              cards={displayCards}
              activeTeacher={activeTeacher}
              onImageClick={handleImageClick}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="py-20 md:py-32 flex flex-col items-center justify-center gap-6"
            >
              <p className="text-muted-foreground text-lg md:text-xl">
                {studentName ? `${studentName}さんへのメッセージはまだありません` : 'メッセージがありません'}
              </p>
              {studentName && (
                <Link href="/">
                  <Button>クラス名簿に戻る</Button>
                </Link>
              )}
            </motion.div>
          )}
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxStartIndex}
        onClose={() => setLightboxImages([])}
      />
    </main>
  )
}
