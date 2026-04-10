"use client"

import { useEffect, useRef, useState, useId, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

/**
 * YouTube APIロードの状態を管理するシングルトン
 */
let youtubeAPIPromise: Promise<void> | null = null
let youtubeAPILoaded = false

/**
 * YouTubeプレーヤーのプロパティ定義
 */
interface YouTubePlayerProps {
    videoId: string
}

/**
 * YouTube IFrame APIの型定義
 */
declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void
        YT: {
            Player: typeof YTPlayer
            PlayerState: {
                UNSTARTED: number
                ENDED: number
                PLAYING: number
                PAUSED: number
                BUFFERING: number
                CUED: number
            }
            loaded: number
        }
    }
}

/**
 * YouTube Playerオブジェクトの型定義
 */
interface YTPlayer {
    playVideo: () => void
    pauseVideo: () => void
    stopVideo: () => void
    seekTo: (seconds: number, allowSeekAhead: boolean) => void
    setVolume: (volume: number) => void
    getVolume: () => number
    mute: () => void
    unMute: () => void
    isMuted: () => boolean
    getCurrentTime: () => number
    getDuration: () => number
    getVideoData: () => object
    getPlayerState: () => number
    getPlaybackRate: () => number
    setPlaybackRate: (rate: number) => void
    getAvailablePlaybackRates: () => number[]
    getPlaybackQuality: () => string
    setPlaybackQuality: (quality: string) => void
    getAvailableQualityLevels: () => string[]
    destroy: () => void
    setPlaybackQuality?: (quality: string) => void
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
    const playerRef = useRef<YTPlayer | null>(null)
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
    const [apiLoadError, setApiLoadError] = useState(false)
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const apiCheckCountRef = useRef(0)
    const apiMaxRetriesRef = useRef(50) // 最大5秒待機（50回 × 100ms）
    const adSkipCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

    /**
     * 広告スキップボタンを自動検出してクリック
     */
    const autoSkipAds = useCallback(() => {
        if (!containerRef.current) return

        // YouTube のスキップボタンのセレクター（複数パターン対応）
        const skipButtonSelectors = [
            '.ytp-ad-skip-button',
            '[aria-label="スキップ"]',
            '[aria-label="Skip"]',
            '.ytp-skip-ad-button',
            '[aria-label*="スキップ"]',
            '[aria-label*="Skip"]',
        ]

        for (const selector of skipButtonSelectors) {
            const skipButton = containerRef.current.querySelector(selector) as HTMLElement
            if (skipButton && skipButton.offsetParent !== null) {
                // ボタンが表示されている場合のみクリック
                try {
                    skipButton.click()
                    console.log('広告をスキップしました')
                    return
                } catch (error) {
                    console.debug('広告スキップボタンのクリックエラー:', error)
                }
            }
        }

        // スキップボタンが見つからない場合、iframe内への Access を試みる
        try {
            const iframes = containerRef.current.querySelectorAll('iframe')
            for (const iframe of iframes) {
                if (iframe.src && iframe.src.includes('youtube.com')) {
                    // iframe内のスキップボタンにはセキュリティ上アクセスできないため、
                    // 親要素の操作で対応
                    const ytContainer = iframe.closest('.ytp-player')
                    if (ytContainer) {
                        const skipBtn = ytContainer.querySelector('.ytp-ad-skip-button') as HTMLElement
                        if (skipBtn) {
                            skipBtn.click()
                            console.log('iframe内の広告をスキップしました')
                            return
                        }
                    }
                }
            }
        } catch (error) {
            // iframe へのアクセスはセキュリティ上制限されているため無視
        }
    }, [])

    /**
     * 広告スキップ監視を開始
     */
    const startAdSkipMonitoring = useCallback(() => {
        if (adSkipCheckIntervalRef.current) {
            clearInterval(adSkipCheckIntervalRef.current)
        }

        adSkipCheckIntervalRef.current = setInterval(() => {
            autoSkipAds()
        }, 500) // 500ms ごとにチェック
    }, [autoSkipAds])

    /**
     * 広告スキップ監視を停止
     */
    const stopAdSkipMonitoring = useCallback(() => {
        if (adSkipCheckIntervalRef.current) {
            clearInterval(adSkipCheckIntervalRef.current)
            adSkipCheckIntervalRef.current = null
        }
    }, [])

    /**
     * 利用可能な最高画質を自動選択して設定
     */
    const setHighestQuality = useCallback((player: YTPlayer) => {
        if (!player || !player.setPlaybackQuality) return

        const qualityLevels = ['hd1080', 'hd720', 'large', 'medium', 'small']

        try {
            const availableQualities = player.getAvailableQualityLevels()
            if (!availableQualities || availableQualities.length === 0) return

            for (const quality of qualityLevels) {
                if (availableQualities.includes(quality)) {
                    player.setPlaybackQuality(quality)
                    return
                }
            }
        } catch (error) {
            console.warn('品質設定エラー:', error)
        }
    }, [])

    /**
     * YouTube IFrame APIを読み込む（シングルトンパターン）
     * 複数のプレーヤーが同じPromiseを待機し、APIは1回だけ読み込まれる
     */
    const loadYouTubeAPI = useCallback(() => {
        // すでにAPIが読み込まれている
        if (youtubeAPILoaded && window.YT?.Player) {
            return Promise.resolve()
        }

        // APIロード中であれば、既存のPromiseを返す
        if (youtubeAPIPromise) {
            return youtubeAPIPromise.catch(() => {
                // 前回のPromiseが拒否された場合は、新しいPromiseを作成（再トライ）
                youtubeAPIPromise = null
                return loadYouTubeAPI()
            })
        }

        // 新しいPromiseを作成
        youtubeAPIPromise = new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')

            if (existingScript && window.YT?.Player) {
                youtubeAPILoaded = true
                resolve()
                return
            }

            const createCheckInterval = () => {
                let checkCount = 0
                const checkAPI = setInterval(() => {
                    checkCount++
                    if (window.YT && window.YT.Player) {
                        youtubeAPILoaded = true
                        clearInterval(checkAPI)
                        resolve()
                    }
                }, 100)

                setTimeout(() => {
                    clearInterval(checkAPI)
                    if (window.YT?.Player) {
                        youtubeAPILoaded = true
                        resolve()
                    } else {
                        console.warn('YouTube API load timeout after', checkCount, 'checks')
                        reject(new Error('YouTube API load timeout'))
                    }
                }, 5000)
            }

            if (existingScript) {
                createCheckInterval()
            } else {
                const tag = document.createElement('script')
                tag.src = 'https://www.youtube.com/iframe_api'

                tag.onload = () => {
                    createCheckInterval()
                }

                tag.onerror = () => {
                    youtubeAPIPromise = null
                    reject(new Error('Failed to load YouTube API script'))
                }

                const firstScriptTag = document.getElementsByTagName('script')[0]
                firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)
            }
        })

        return youtubeAPIPromise
    }, [])

    /**
     * プレーヤーを初期化
     */
    useEffect(() => {
        let isMounted = true

        const initializePlayer = async () => {
            try {
                // YouTube APIが読み込まれるまで待機
                await loadYouTubeAPI()

                // コンポーネントがアンマウントされていないか確認
                if (!isMounted) {
                    return
                }

                // APIが利用可能か確認
                if (!window.YT?.Player) {
                    console.error('YouTube API is not available')
                    setApiLoadError(true)
                    return
                }

                // プレーヤー要素が存在するか確認
                const playerElement = document.getElementById(playerId)
                if (!playerElement) {
                    console.warn(`Player element not found: ${playerId}`)
                    setApiLoadError(true)
                    return
                }

                // 既存プレーヤーを破棄
                if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                    try {
                        playerRef.current.destroy()
                        playerRef.current = null
                    } catch (error) {
                        console.debug('Error destroying previous player:', error)
                    }
                }

                // 新しいプレーヤーを作成
                const player = new window.YT.Player(playerId, {
                    videoId,
                    width: '100%',
                    height: '100%',
                    host: 'https://www.youtube.com',
                    playerVars: {
                        controls: 0,
                        modestbranding: 0,
                        rel: 0,
                        iv_load_policy: 3,
                        disablekb: 1,
                        fs: 0,
                        playsinline: 1,
                        autoplay: 0,
                        hl: 'ja',
                        enablejsapi: 1,
                        showinfo: 0,
                        cc_load_policy: 0,
                        widget_referrer: typeof window !== 'undefined' ? window.location.href : undefined,
                        origin: typeof window !== 'undefined' ? window.location.origin : undefined,
                    },
                    events: {
                        onReady: (event) => {
                            if (isMounted) {
                                playerRef.current = event.target
                                setIsPlayerReady(true)
                                setApiLoadError(false)
                                const dur = event.target.getDuration()
                                if (dur > 0) {
                                    setDuration(dur)
                                }
                                setHighestQuality(event.target)
                            }
                        },
                        onStateChange: (event) => {
                            if (!isMounted) return

                            const isPlayingState = event.data === window.YT.PlayerState.PLAYING
                            setIsPlaying(isPlayingState)

                            // 再生中は広告スキップ監視を開始
                            if (isPlayingState) {
                                setTimeout(() => {
                                    setHighestQuality(event.target)
                                }, 500)
                                startAdSkipMonitoring()
                            } else {
                                // 再生していない場合は監視を停止
                                stopAdSkipMonitoring()
                            }
                        },
                        onError: (event) => {
                            console.error('YouTube Player Error:', event.data)
                            if (isMounted) {
                                setApiLoadError(true)
                            }
                        },
                    },
                })
            } catch (error) {
                console.error('Failed to initialize YouTube Player:', error)
                if (isMounted) {
                    setApiLoadError(true)
                }
            }
        }

        initializePlayer()

        return () => {
            isMounted = false
            // 広告スキップ監視を停止
            stopAdSkipMonitoring()
            // プレーヤーを破棄
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                try {
                    playerRef.current.destroy()
                    playerRef.current = null
                } catch (error) {
                    console.debug('Error during cleanup:', error)
                }
            }
            setIsPlayerReady(false)
            setIsPlaying(false)
        }
    }, [videoId, playerId, loadYouTubeAPI, setHighestQuality, stopAdSkipMonitoring])

    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && isPlaying) {
                setCurrentTime(playerRef.current.getCurrentTime())
            }
        }, 500)
        return () => clearInterval(interval)
    }, [isPlaying])

    /**
     * 再生/一時停止の切り替え
     */
    const togglePlay = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (!playerRef.current) return

        if (isPlaying) {
            playerRef.current.pauseVideo()
        } else {
            playerRef.current.playVideo()
        }
    }, [isPlaying])

    /**
     * シーク処理
     */
    const handleSeek = useCallback((value: number[]) => {
        if (!playerRef.current) return
        const time = value[0]
        playerRef.current.seekTo(time, true)
        setCurrentTime(time)
    }, [])

    /**
     * ミュート切り替え
     */
    const toggleMute = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (!playerRef.current) return

        if (isMuted) {
            playerRef.current.unMute()
            setIsMuted(false)
        } else {
            playerRef.current.mute()
            setIsMuted(true)
        }
    }, [isMuted])

    /**
     * 音量変更
     */
    const handleVolumeChange = useCallback((value: number[]) => {
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
    }, [isMuted])

    /**
     * フルスクリーン切り替え
     */
    const toggleFullscreen = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (!containerRef.current) return

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch((err) => {
                console.error('フルスクリーンエラー:', err.message)
            })
            setIsFullscreen(true)
        } else {
            document.exitFullscreen().catch((err) => {
                console.error('フルスクリーン終了エラー:', err.message)
            })
            setIsFullscreen(false)
        }
    }, [])

    /**
     * フルスクリーン状態の監視
     */
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    /**
     * 時刻をMM:SS形式でフォーマット
     */
    const formatTime = useCallback((seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return `${m}:${s.toString().padStart(2, '0')}`
    }, [])

    /**
     * マウス操作でコントローラー表示
     */
    const handleMouseMove = useCallback(() => {
        setShowControls(true)

        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
        }

        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false)
            }, 3000)
        }
    }, [isPlaying])

    /**
     * キーボード操作対応
     * Space: 再生/一時停止
     * 矢印キー → / ←: 前後5秒スキップ
     * 矢印キー ↑ / ↓: 音量調整
     * M: ミュート切り替え
     * F: フルスクリーン切り替え
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlayerReady || !containerRef.current) {
                return
            }

            switch (e.key) {
                case ' ':
                    e.preventDefault()
                    togglePlay()
                    break
                case 'ArrowRight':
                    e.preventDefault()
                    if (playerRef.current) {
                        const newTime = Math.min(playerRef.current.getCurrentTime() + 5, duration)
                        handleSeek([newTime])
                    }
                    break
                case 'ArrowLeft':
                    e.preventDefault()
                    if (playerRef.current) {
                        const newTime = Math.max(playerRef.current.getCurrentTime() - 5, 0)
                        handleSeek([newTime])
                    }
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    handleVolumeChange([Math.min(volume + 10, 100)])
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    handleVolumeChange([Math.max(volume - 10, 0)])
                    break
                case 'm':
                case 'M':
                    e.preventDefault()
                    toggleMute({} as React.MouseEvent)
                    break
                case 'f':
                case 'F':
                    e.preventDefault()
                    toggleFullscreen({} as React.MouseEvent)
                    break
                default:
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isPlayerReady, duration, volume, togglePlay, handleSeek, handleVolumeChange, toggleMute, toggleFullscreen])

    return (
        <div
            ref={containerRef}
            className="relative group aspect-video bg-black overflow-hidden rounded-xl shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            role="region"
            aria-label="YouTubeビデオプレーヤー"
            tabIndex={0}
        >
            {/* The actual YouTube Player */}
            <div className="absolute inset-0 overflow-hidden bg-black">
                <div
                    id={playerId}
                    className="w-full h-full"
                    style={{
                        pointerEvents: 'none',
                    }}
                />
            </div>

            {/* Interaction Overlay (blocks direct YouTube interaction) */}
            <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={togglePlay}
                onContextMenu={(e) => e.preventDefault()}
                role="button"
                aria-label="再生/一時停止を切り替え"
                tabIndex={-1}
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
                                aria-label="再生時間を調整（←→キーで5秒単位）"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={togglePlay}
                                    className="text-white hover:bg-white/20 h-10 w-10 rounded-full shrink-0"
                                    aria-label={isPlaying ? "一時停止（Space）" : "再生（Space）"}
                                    title={isPlaying ? "一時停止（スペースキー）" : "再生（スペースキー）"}
                                >
                                    {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-0.5" />}
                                </Button>

                                <div className="flex items-center gap-1 group/volume">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleMute}
                                        className="text-white hover:bg-white/20 h-10 w-10 rounded-full shrink-0"
                                        aria-label={isMuted || volume === 0 ? "ミュート解除（M）" : "ミュート（M）"}
                                        title={isMuted || volume === 0 ? "ミュート解除（Mキー）" : "ミュート（Mキー）"}
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
                                                aria-label="音量（↑↓キーで調整）"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-white text-xs md:text-sm font-medium tabular-nums ml-1" aria-live="polite">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleFullscreen}
                                    className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                                    aria-label={isFullscreen ? "フルスクリーン終了（F）" : "フルスクリーン（F）"}
                                    title={isFullscreen ? "フルスクリーン終了（Fキー）" : "フルスクリーン（Fキー）"}
                                >
                                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Initial Loading Overlay */}
            {!isPlayerReady && !apiLoadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-40">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-white text-xs font-medium animate-pulse">動画を準備中...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {apiLoadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-40">
                    <div className="flex flex-col items-center gap-3 px-4 text-center">
                        <div className="text-pink-500 text-4xl">⚠️</div>
                        <p className="text-white font-semibold">動画の読み込みに失敗しました</p>
                        <p className="text-white/70 text-sm">ページをリロードしてお試しください</p>
                    </div>
                </div>
            )}
        </div>
    )
}
