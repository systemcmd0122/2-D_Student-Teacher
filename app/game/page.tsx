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

export default function GamePage() {
  const isMobile = useIsMobile()
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (isMobile === true) {
      setShowWarning(true)
    }
  }, [isMobile])

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-black">
      <iframe
        src="/game/index.html"
        className="w-full h-full border-none"
        title="思い出ラン"
        allow="autoplay; focus-without-user-activation"
      />

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
