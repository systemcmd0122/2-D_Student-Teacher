import { type NextRequest, NextResponse } from 'next/server'

const BLOB_URL = 'https://tojinxdttzebl9ez.private.blob.vercel-storage.com/movie.mp4'

export async function GET(request: NextRequest) {
    try {
        const rangeHeader = request.headers.get('range')

        const fetchHeaders: Record<string, string> = {
            Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN!}`,
        }

        if (rangeHeader) {
            fetchHeaders['Range'] = rangeHeader
        }

        const response = await fetch(BLOB_URL, {
            headers: fetchHeaders,
        })

        if (!response.ok && response.status !== 206) {
            return new NextResponse('Not found', { status: response.status })
        }

        const responseHeaders: Record<string, string> = {
            'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'private, no-cache',
        }

        const contentLength = response.headers.get('Content-Length')
        if (contentLength) responseHeaders['Content-Length'] = contentLength

        const contentRange = response.headers.get('Content-Range')
        if (contentRange) responseHeaders['Content-Range'] = contentRange

        return new NextResponse(response.body, {
            status: response.status,
            headers: responseHeaders,
        })
    } catch (error) {
        console.error('Video proxy error:', error)
        return new NextResponse('動画の取得に失敗しました', { status: 500 })
    }
}