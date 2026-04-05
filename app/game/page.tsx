"use client"

import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Maximize, Minimize } from "lucide-react"

export default function GamePage() {
  const isMobile = useIsMobile()
  const [showWarning, setShowWarning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (isMobile === true) {
      setShowWarning(true)
    }
  }, [isMobile])

  const toggleFullscreen = () => {
    const container = document.getElementById('game-wrapper')
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-black flex flex-col">
      <div id="game-wrapper" className="relative flex-1 w-full overflow-hidden">
        <iframe
          src="/game/index.html"
          className="w-full h-full border-none"
          title="思い出ラン"
          allow="autoplay; focus-without-user-activation; fullscreen"
        />

        <button
          onClick={toggleFullscreen}
          className="absolute bottom-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm z-50 border border-white/20"
          title={isFullscreen ? "全画面解除" : "全画面表示"}
        >
          {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
        </button>
      </div>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">PCでの閲覧を推奨します</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              このゲーム「思い出ラン」は、キーボード操作が必要なためPCでのプレイを推奨しています。
              モバイルデバイスでは正しくプレイできない可能性があります。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowWarning(false)}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              了解
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
