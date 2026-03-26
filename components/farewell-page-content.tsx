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
import { AlbumLoadingScreen } from "@/components/album-loading"
import { Lightbox } from "@/components/lightbox"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import type { MessageCardData } from "@/components/message-card"

function FarewellPageContent() {
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
                <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                    {/* Student Filter Header */}
                    {studentName && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-8 md:mb-12 pt-4 md:pt-8"
                        >
                            <div className="bg-white rounded-lg p-6 border border-pink-100 shadow-sm">
                                <Link href="/roster" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-3 transition-colors">
                                    <X className="w-4 h-4" />
                                    <span className="text-sm">戻る</span>
                                </Link>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                    {studentName}からのメッセージ
                                </h2>
                            </div>
                        </motion.div>
                    )}

                    {/* Album Loading Screen */}
                    {loading && <AlbumLoadingScreen />}

                    {/* Main Content Display */}
                    {!loading && (
                        <>
                            <div className="space-y-8 md:space-y-10">
                                <div className="space-y-6 md:space-y-8">
                                    <TeacherTabs activeTeacher={activeTeacher} onTeacherChange={setActiveTeacher} />
                                </div>
                                <MessageGallery
                                    cards={displayCards}
                                    activeTeacher={activeTeacher}
                                    onImageClick={handleImageClick}
                                />
                            </div>

                            {/* Lightbox Component */}
                            {lightboxImages.length > 0 && (
                                <Lightbox
                                    images={lightboxImages}
                                    initialIndex={lightboxStartIndex}
                                    onClose={() => setLightboxImages([])}
                                />
                            )}
                        </>
                    )}
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </main>
    )
}

export { FarewellPageContent }
