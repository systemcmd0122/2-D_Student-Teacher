"use client"

import { motion } from "framer-motion"
import { User } from "lucide-react"

interface TeacherTabsProps {
  activeTeacher: "kai" | "kisita"
  onTeacherChange: (teacher: "kai" | "kisita") => void
}

export function TeacherTabs({ activeTeacher, onTeacherChange }: TeacherTabsProps) {
  return (
    <div className="flex justify-center gap-3 md:gap-6">
      {/* Kai Tab */}
      <motion.button
        onClick={() => onTeacherChange("kai")}
        className="relative px-6 py-3 md:px-8 md:py-4 rounded-full flex items-center gap-2 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background animation */}
        {activeTeacher === "kai" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary -z-10 shadow-lg"
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          />
        )}

        {/* Hover effect background */}
        <motion.div
          className="absolute inset-0 rounded-full bg-accent/50 -z-10 opacity-0"
          animate={{ opacity: activeTeacher !== "kai" ? 0 : 0 }}
          whileHover={{ opacity: activeTeacher !== "kai" ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          animate={{ scale: activeTeacher === "kai" ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <User className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${activeTeacher === "kai" ? "text-primary-foreground" : "text-card-foreground"}`} />
        </motion.div>

        <span className={`font-semibold text-sm md:text-base transition-colors ${activeTeacher === "kai"
            ? "text-primary-foreground"
            : "text-card-foreground hover:text-foreground"
          }`}>
          甲斐一成 先生
        </span>

        {/* Active indicator shine effect */}
        {activeTeacher === "kai" && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent -z-10"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Kisita Tab */}
      <motion.button
        onClick={() => onTeacherChange("kisita")}
        className="relative px-6 py-3 md:px-8 md:py-4 rounded-full flex items-center gap-2 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background animation */}
        {activeTeacher === "kisita" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary -z-10 shadow-lg"
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          />
        )}

        {/* Hover effect background */}
        <motion.div
          className="absolute inset-0 rounded-full bg-accent/50 -z-10 opacity-0"
          animate={{ opacity: activeTeacher !== "kisita" ? 0 : 0 }}
          whileHover={{ opacity: activeTeacher !== "kisita" ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          animate={{ scale: activeTeacher === "kisita" ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <User className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${activeTeacher === "kisita" ? "text-primary-foreground" : "text-card-foreground"}`} />
        </motion.div>

        <span className={`font-semibold text-sm md:text-base transition-colors ${activeTeacher === "kisita"
            ? "text-primary-foreground"
            : "text-card-foreground hover:text-foreground"
          }`}>
          木下恵里加 先生
        </span>

        {/* Active indicator shine effect */}
        {activeTeacher === "kisita" && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent -z-10"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  )
}
