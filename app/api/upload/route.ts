import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const filename = `hh-goa-cards/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`

    const blob = await put(filename, file, {
      access: 'public',
      contentType: 'image/png',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
