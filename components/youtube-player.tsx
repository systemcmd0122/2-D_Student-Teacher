"use client"

import { useEffect, useRef, useState, useId } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface YouTubePlayerProps {
    videoId: string
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void
        YT: any
    }
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
    const playerRef = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const uniqueId = useId()
    const playerId = `player-${uniqueId.replace(/:/g, '')}`
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(100)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isPlayerReady, setIsPlayerReady] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // 利用可能な最高画質を設定する関数
    const setHighestQuality = (player: any) => {
        if (!player || !player.setPlaybackQuality) return

        // 優先順位付きの品質オプション（高い順）
        const qualityLevels = ['hd1080', 'hd720', 'large', 'medium', 'small']

        try {
            const availableQualities = player.getAvailableQualityLevels()

            // 利用可能な品質の中から最高のものを選択
            for (const quality of qualityLevels) {
                if (availableQualities.includes(quality)) {
                    player.setPlaybackQuality(quality)
                    return
                }
            }
        } catch (error) {
            console.warn('品質設定エラー:', error)
            // フォールバック: hd1080を試す
            try {
                player.setPlaybackQuality('hd1080')
            } catch (e) {
                console.warn('フォールバック品質設定エラー:', e)
            }
        }
    }

    useEffect(() => {
        let player: any = null;

        const initPlayer = () => {
            if (!window.YT || !window.YT.Player) return;

            player = new window.YT.Player(playerId, {
                videoId: videoId,
                width: '100%',
                height: '100%',
                host: 'https://www.youtube.com',
                playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    iv_load_policy: 3,
                    disablekb: 1,
                    fs: 0,
                    playsinline: 1,
                    autoplay: 0,
                    hl: 'ja',
                    enablejsapi: 1,
                    origin: typeof window !== 'undefined' ? window.location.origin : undefined,
                },
                events: {
                    onReady: (event: any) => {
                        setIsPlayerReady(true)
                        setDuration(event.target.getDuration())
                        playerRef.current = event.target
                        // 利用可能な最高画質を設定
                        setHighestQuality(event.target)
                    },
                    onStateChange: (event: any) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true)
                            // 再生開始時に画質を最適化
                            setTimeout(() => {
                                setHighestQuality(event.target)
                            }, 500)
                        } else {
                            setIsPlaying(false)
                        }
                    },
                },
            })
        }

        if (window.YT && window.YT.Player) {
            initPlayer()
        } else {
            if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                const tag = document.createElement('script')
                tag.src = "https://www.youtube.com/iframe_api"
                const firstScriptTag = document.getElementsByTagName('script')[0]
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
            }

            const checkAPI = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    initPlayer()
                    clearInterval(checkAPI)
                }
            }, 100)

            return () => {
                clearInterval(checkAPI)
                if (player) player.destroy()
            }
        }

        return () => {
            if (player) {
                player.destroy()
            }
        }
    }, [videoId])

    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && isPlaying) {
                setCurrentTime(playerRef.current.getCurrentTime())
            }
        }, 500)
        return () => clearInterval(interval)
    }, [isPlaying])

    const togglePlay = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (!playerRef.current) return
        if (isPlaying) {
            playerRef.current.pauseVideo()
        } else {
            playerRef.current.playVideo()
        }
    }

    const handleSeek = (value: number[]) => {
        if (!playerRef.current) return
        const time = value[0]
        playerRef.current.seekTo(time, true)
        setCurrentTime(time)
    }

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!playerRef.current) return
        if (isMuted) {
            playerRef.current.unMute()
            setIsMuted(false)
        } else {
            playerRef.current.mute()
            setIsMuted(true)
        }
    }

    const handleVolumeChange = (value: number[]) => {
        if (!playerRef.current) return
        const vol = value[0]
        playerRef.current.setVolume(vol)
        setVolume(vol)
        if (vol === 0) {
            setIsMuted(true)
        } else if (isMuted) {
            playerRef.current.unMute()
            setIsMuted(false)
        }
    }

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!containerRef.current) return
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch((err) => {
                console.error(`Fullscreen error: ${err.message}`)
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

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const handleMouseMove = () => {
        setShowControls(true)
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
        }
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false)
            }, 3000)
        }
    }

    return (
        <div
            ref={containerRef}
            className="relative group aspect-video bg-black overflow-hidden rounded-xl shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* The actual YouTube Player */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black">
                <div id={playerId} className="w-full h-full" />
            </div>

            {/* Interaction Overlay (blocks direct YouTube interaction) */}
            <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={togglePlay}
                onContextMenu={(e) => e.preventDefault()}
            />

            {/* Custom UI: Big Play Button when paused */}
            <AnimatePresence>
                {!isPlaying && isPlayerReady && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-500/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                            <Play className="h-8 w-8 md:h-10 md:w-10 text-white fill-current ml-1" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Controls Bar */}
            <AnimatePresence>
                {(showControls || !isPlaying) && isPlayerReady && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-4 pt-12"
                    >
                        {/* Progress Bar */}
                        <div className="mb-3 px-1">
                            <Slider
                                value={[currentTime]}
                                max={duration || 100}
                                step={0.1}
                                onValueChange={handleSeek}
                                className="cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={togglePlay}
                                    className="text-white hover:bg-white/20 h-10 w-10 rounded-full shrink-0"
                                >
                                    {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-0.5" />}
                                </Button>

                                <div className="flex items-center gap-1 group/volume">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleMute}
                                        className="text-white hover:bg-white/20 h-10 w-10 rounded-full shrink-0"
                                    >
                                        {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                    </Button>
                                    <div className="hidden md:block w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                                        <div className="w-24 px-2">
                                            <Slider
                                                value={[isMuted ? 0 : volume]}
                                                max={100}
                                                step={1}
                                                onValueChange={handleVolumeChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-white text-xs md:text-sm font-medium tabular-nums ml-1">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleFullscreen}
                                    className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                                >
                                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Initial Loading Overlay */}
            {!isPlayerReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-40">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-white text-xs font-medium animate-pulse">動画を準備中...</p>
                    </div>
                </div>
            )}
        </div>
    )
}
