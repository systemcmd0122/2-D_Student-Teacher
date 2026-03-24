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
        console.log('Reading from:', folderPath)

        const files = readdirSync(folderPath)
        console.log('Files found:', files)

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

            // 末尾の_数字パターンをチェック（複数枚の画像用）
            const match = nameWithoutExt.match(/^(.+?)(_\d+)?$/)
            if (!match) {
                console.warn(`Cannot parse filename: ${file}`)
                return
            }

            const studentName = match[1].trim() // 先頭後尾の空白を削除

            // 生徒名でグループ化
            if (!studentMap.has(studentName)) {
                studentMap.set(studentName, [])
            }
            studentMap.get(studentName)!.push(`/${teacher}/${encodeURI(file)}`)
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
        console.error('Image API Error:', error)
        return NextResponse.json(
            { error: 'フォルダの読み込みに失敗しました', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
