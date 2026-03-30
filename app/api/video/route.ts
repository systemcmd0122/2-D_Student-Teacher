import { head } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const blobInfo = await head(
            "https://tojinxdttzebl9ez.private.blob.vercel-storage.com/movie.mp4",
            { token: process.env.BLOB_READ_WRITE_TOKEN }
        )
        return NextResponse.json({ url: blobInfo.downloadUrl })
    } catch (error) {
        console.error("Blob head error:", error)
        return NextResponse.json(
            { error: "動画URLの取得に失敗しました" },
            { status: 500 }
        )
    }
}