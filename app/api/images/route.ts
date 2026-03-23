import { readdirSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

interface StudentImages {
    studentName: string
    images: string[]
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const teacher = searchParams.get('teacher') as 'kai' | 'kisita'

    if (!teacher || !['kai', 'kisita'].includes(teacher)) {
        return NextResponse.json(
            { error: '無効な先生パラメータです' },
            { status: 400 }
        )
    }

    try {
        const folderPath = join(process.cwd(), 'public', teacher)
        const files = readdirSync(folderPath)

        // 画像ファイルのみをフィルタリング（拡張子で判定）
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        const imageFiles = files.filter((file) =>
            imageExtensions.some((ext) => file.toLowerCase().endsWith(ext))
        ).sort()

        // 生徒ごとに画像をグループ化
        const studentMap = new Map<string, string[]>()

        imageFiles.forEach((file) => {
            // ファイル名から拡張子を除去
            const nameWithoutExt = file.substring(0, file.lastIndexOf('.'))

            // 「生徒名_数字」のパターンをチェック
            const match = nameWithoutExt.match(/^(.+?)(_\d+)?$/)
            const studentName = match ? match[1] : nameWithoutExt

            // 生徒名がメインの名前から末尾の_数字を除いたもの
            const cleanedName = studentName.replace(/_\d+$/, '')

            // 生徒名でグループ化
            if (!studentMap.has(cleanedName)) {
                studentMap.set(cleanedName, [])
            }
            studentMap.get(cleanedName)!.push(`/${teacher}/${file}`)
        })

        // studentData に変換
        const studentData: StudentImages[] = Array.from(studentMap.entries()).map(
            ([studentName, images]) => ({
                studentName,
                images,
            })
        )

        return NextResponse.json(studentData)
    } catch (error) {
        return NextResponse.json(
            { error: 'フォルダの読み込みに失敗しました' },
            { status: 500 }
        )
    }
}
