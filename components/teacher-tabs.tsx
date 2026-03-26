"use client"

import { motion } from "framer-motion"
import { User } from "lucide-react"

interface TeacherTabsProps {
  activeTeacher: "kai" | "kisita"
  onTeacherChange: (teacher: "kai" | "kisita") => void
}

export function TeacherTabs({ activeTeacher, onTeacherChange }: TeacherTabsProps) {
  return (
    <div className="flex justify-center gap-4 md:gap-6 pb-8 md:pb-10">
      <button
        onClick={() => onTeacherChange("kai")}
        className={`relative px-6 py-3 md:px-8 md:py-4 rounded-full transition-all duration-300 flex items-center gap-2 ${activeTeacher === "kai"
          ? "bg-primary text-primary-foreground shadow-lg"
          : "bg-card text-card-foreground hover:bg-accent border border-border"
          }`}
      >
        <User className="w-4 h-4 md:w-5 md:h-5" />
        <span className="font-medium text-sm md:text-base">甲斐一成 先生</span>
        {activeTeacher === "kai" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 rounded-full bg-primary -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
      <button
        onClick={() => onTeacherChange("kisita")}
        className={`relative px-6 py-3 md:px-8 md:py-4 rounded-full transition-all duration-300 flex items-center gap-2 ${activeTeacher === "kisita"
          ? "bg-primary text-primary-foreground shadow-lg"
          : "bg-card text-card-foreground hover:bg-accent border border-border"
          }`}
      >
        <User className="w-4 h-4 md:w-5 md:h-5" />
        <span className="font-medium text-sm md:text-base">木下恵里加 先生</span>
        {activeTeacher === "kisita" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 rounded-full bg-primary -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    </div>
  )
}
