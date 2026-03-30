import { SlideshowPageContent } from "@/components/slideshow-page-content"
import { AlbumLoadingScreen } from "@/components/album-loading"
import { Suspense } from "react"

export const metadata = {
    title: "思い出のスライドショー | 2年D組",
    description: "佐土原高校情報技術科2年D組の思い出のスライドショー"
}

export default function SlideshowPage() {
    return (
        <Suspense fallback={<AlbumLoadingScreen />}>
            <SlideshowPageContent />
        </Suspense>
    )
}
