import { Suspense } from "react"
import { FarewellPageContent } from "@/components/farewell-page-content"
import { AlbumLoadingScreen } from "@/components/album-loading"

export default function FarewellTributePage() {
  return (
    <Suspense fallback={<AlbumLoadingScreen />}>
      <FarewellPageContent />
    </Suspense>
  )
}
