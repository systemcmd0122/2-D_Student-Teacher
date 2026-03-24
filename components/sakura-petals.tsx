"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useMemo } from "react"

interface Petal {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  rotation: number
  swayAmount: number
}

export function SakuraPetals() {
  const [isVisible, setIsVisible] = useState(false)

  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 8,
      size: 8 + Math.random() * 16,
      rotation: Math.random() * 360,
      swayAmount: 20 + Math.random() * 40,
    }))
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {isVisible && petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: -30,
            width: petal.size,
            height: petal.size,
            willChange: "transform, opacity",
          }}
          initial={{ y: -30, rotate: petal.rotation, opacity: 0, x: 0 }}
          animate={{
            y: "110vh",
            rotate: petal.rotation + 360 * (1 + Math.random()),
            x: [0, petal.swayAmount, -petal.swayAmount * 0.5, petal.swayAmount * 0.3, 0],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.4, 0.8, 1],
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full drop-shadow-sm"
            style={{ filter: "drop-shadow(0 1px 2px rgba(251, 207, 232, 0.3))" }}
          >
            {/* Petal outline for depth */}
            <path
              d="M12 2C12 2 8 6 8 10C8 14 12 16 12 16C12 16 16 14 16 10C16 6 12 2 12 2Z"
              fill="rgba(251, 207, 232, 0.8)"
              stroke="rgba(251, 207, 232, 0.4)"
              strokeWidth="0.5"
            />
            <path
              d="M12 2C12 2 6 4 4 8C2 12 4 16 4 16C4 16 8 14 10 10C12 6 12 2 12 2Z"
              fill="rgba(244, 183, 201, 0.7)"
              stroke="rgba(244, 183, 201, 0.3)"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
