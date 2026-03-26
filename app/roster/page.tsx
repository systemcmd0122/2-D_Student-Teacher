"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    const [viewMode, setViewMode] = useState<"list" | "grid">("list")

    const filteredStudents = useMemo(() => {
        return (roster as Student[]).filter((student) => {
            const query = searchQuery.toLowerCase()
            return (
                student.fullName.toLowerCase().includes(query) ||
                student.fullFurigana.toLowerCase().includes(query) ||
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
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "grid")} className="mb-6">
                    <TabsList>
                        <TabsTrigger value="list">リスト表示</TabsTrigger>
                        <TabsTrigger value="grid">グリッド表示</TabsTrigger>
                    </TabsList>

                    {/* List View */}
                    <TabsContent value="list" className="mt-6">
                        <div className="space-y-5">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <Link key={student.no} href={`/?student=${encodeURIComponent(student.fullName)}`}>
                                        <Card className="p-5 hover:bg-pink-50 transition-colors cursor-pointer border-l-4 border-l-pink-300 shadow-md hover:shadow-lg">
                                            <div className="flex items-center gap-4">
                                                <Badge variant="outline" className="min-w-fit flex-shrink-0">
                                                    No.{student.no}
                                                </Badge>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                                                        {student.fullName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 truncate">{student.fullFurigana}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">該当する生徒が見つかりません</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Grid View */}
                    <TabsContent value="grid" className="mt-6">
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
                    </TabsContent>
                </Tabs>

                {/* Details Table */}
                {filteredStudents.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg border overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">No.</th>
                                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">姓</th>
                                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">名</th>
                                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">ふりがな</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr
                                        key={student.no}
                                        className="border-b hover:bg-pink-50 cursor-pointer transition-colors"
                                        onClick={() => {
                                            window.location.href = `/?student=${encodeURIComponent(student.fullName)}`
                                        }}
                                    >
                                        <td className="px-4 py-3 text-gray-800 font-medium">{student.no}</td>
                                        <td className="px-4 py-3 font-semibold">{student.surname}</td>
                                        <td className="px-4 py-3 font-semibold">{student.name}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {student.surnameFurigana} {student.nameFurigana}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
