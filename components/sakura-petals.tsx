"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Petal {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  rotation: number
}

export function SakuraPetals() {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    const newPetals: Petal[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      size: 10 + Math.random() * 15,
      rotation: Math.random() * 360,
    }))
    setPetals(newPetals)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: -30,
            width: petal.size,
            height: petal.size,
          }}
          initial={{ y: -30, rotate: petal.rotation, opacity: 0 }}
          animate={{
            y: "110vh",
            rotate: petal.rotation + 360,
            x: [0, 30, -20, 40, 0],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
          >
            <path
              d="M12 2C12 2 8 6 8 10C8 14 12 16 12 16C12 16 16 14 16 10C16 6 12 2 12 2Z"
              fill="rgba(251, 207, 232, 0.7)"
            />
            <path
              d="M12 2C12 2 6 4 4 8C2 12 4 16 4 16C4 16 8 14 10 10C12 6 12 2 12 2Z"
              fill="rgba(244, 183, 201, 0.6)"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
