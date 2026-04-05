"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import roster from "@/data/roster.json"

interface Student {
    no: number
    surname: string
    name: string
    surnameFurigana: string
    nameFurigana: string
    fullName: string
    fullFurigana: string
}

export default function RosterPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredStudents = useMemo(() => {
        const query = searchQuery.toLowerCase().replace(/[\s　]/g, "")
        return (roster as Student[]).filter((student) => {
            const fullName = student.fullName.toLowerCase().replace(/[\s　]/g, "")
            const fullFurigana = student.fullFurigana.toLowerCase().replace(/[\s　]/g, "")
            return (
                fullName.includes(query) ||
                fullFurigana.includes(query) ||
                student.surname.toLowerCase().includes(query) ||
                student.name.toLowerCase().includes(query) ||
                student.no.toString().includes(query)
            )
        })
    }, [searchQuery])

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">クラス名簿</h1>
                    <p className="text-gray-600">全{roster.length}名の生徒</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="名前、ふりがなで検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 text-lg"
                        />
                    </div>
                    {searchQuery && (
                        <p className="mt-2 text-sm text-gray-600">
                            {filteredStudents.length}名の生徒が見つかりました
                        </p>
                    )}
                </div>

                {/* View Mode Tabs */}
                {filteredStudents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStudents.map((student) => (
                            <Link key={student.no} href={`/?student=${encodeURIComponent(student.fullName)}`}>
                                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                                    <Badge variant="default" className="mb-3">
                                        No.{student.no}
                                    </Badge>
                                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                                        {student.fullName}
                                    </h3>
                                    <p className="text-sm text-gray-500 text-center">{student.fullFurigana}</p>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">該当する生徒が見つかりません</p>
                    </div>
                )}

            </div>
        </div>
    )
}
