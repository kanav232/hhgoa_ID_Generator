'use client'

import { toPng } from 'html-to-image'
import { Download, ImagePlus, RefreshCw, Share2, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IdCard, ID_CARD_WIDTH } from '@/components/id-card'
import { generateBuilderTitle } from '@/lib/builder-title'

const EDITION = 'COA BEACH · HH GOA 2026'

async function fileToDisplayableImage(file: File): Promise<string> {
  let blob: Blob = file
  const isHeic =
    /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)

  if (isHeic) {
    const heic2any = (await import('heic2any')).default
    const converted = (await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 })) as Blob | Blob[]
    blob = Array.isArray(converted) ? converted[0] : converted
  }

  // Decode respecting EXIF orientation (important for iPhone photos), then
  // downscale so the card stays snappy and the exported PNG is not huge.
  try {
    const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' })
    const maxDim = 1200
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no ctx')
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()
    return canvas.toDataURL('image/jpeg', 0.92)
  } catch {
    // Fallback: raw data URL
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Could not read image file'))
      reader.readAsDataURL(blob)
    })
  }
}

export function FrameGenerator() {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [reroll, setReroll] = useState(0)
  const [loadingPhoto, setLoadingPhoto] = useState(false)
  const [busy, setBusy] = useState<null | 'download' | 'share'>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const title = generateBuilderTitle(`${name}|${role}|${reroll}`)

  const handleFiles = useCallback(async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setLoadingPhoto(true)
    setStatus(null)
    try {
      const src = await fileToDisplayableImage(file)
      setPhotoSrc(src)
    } catch {
      setStatus('Could not read that image. Try a JPG or PNG.')
    } finally {
      setLoadingPhoto(false)
    }
  }, [])

  async function renderCard(pixelRatio = 2.5): Promise<Blob> {
    if (!cardRef.current) throw new Error('card not ready')
    // Two passes make sure fonts/images are fully painted before capture.
    await toPng(cardRef.current, { pixelRatio, cacheBust: true })
    const dataUrl = await toPng(cardRef.current, { pixelRatio, cacheBust: true })
    const res = await fetch(dataUrl)
    return await res.blob()
  }

  async function handleDownload() {
    setBusy('download')
    setStatus(null)
    try {
      const blob = await renderCard()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hh-goa-2026-${(name || 'builder').toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[v0] download error:', err)
      setStatus('Something went wrong generating the image. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  async function handleShare() {
    setBusy('share')
    setStatus('Building your shareable card…')
    try {
      const blob = await renderCard()
      const form = new FormData()
      form.append('file', blob, 'card.png')
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) throw new Error('upload failed')
      const { url } = (await res.json()) as { url: string }

      const origin = window.location.origin
      const shareUrl = `${origin}/frame?img=${encodeURIComponent(url)}&name=${encodeURIComponent(
        name,
      )}&title=${encodeURIComponent(title)}`
      const text = `I just claimed my Hacker House Goa 2026 builder ID — ${title}. Come build by the beach.`
      const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}&url=${encodeURIComponent(shareUrl)}&hashtags=FrameInGoa`

      setStatus(null)
      window.open(intent, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('[v0] share error:', err)
      setStatus('Could not prepare the share link. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,460px)] lg:items-start">
      {/* Controls */}
      <div className="order-2 flex flex-col gap-6 lg:order-1">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-goa-yellow">
            1 · Your photo
          </label>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              handleFiles(e.dataTransfer.files)
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
              dragging ? 'border-goa-yellow bg-white/10' : 'border-white/30 bg-white/5 hover:bg-white/10'
            }`}
          >
            {loadingPhoto ? (
              <Loader2 className="h-6 w-6 animate-spin text-goa-yellow" />
            ) : (
              <ImagePlus className="h-6 w-6 text-goa-yellow" />
            )}
            <p className="text-sm font-medium">
              {photoSrc ? 'Photo added — tap to replace' : 'Tap to upload or drop a photo'}
            </p>
            <p className="text-xs text-muted-foreground">JPG, PNG or HEIC · portrait or landscape, no cropping needed</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-goa-yellow">
              2 · Name
            </label>
            <input
              id="name"
              value={name}
              maxLength={22}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aisha Kapoor"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-goa-yellow"
            />
          </div>
          <div>
            <label htmlFor="role" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-goa-yellow">
              3 · Stack / Role
            </label>
            <input
              id="role"
              value={role}
              maxLength={24}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Full-stack · AI"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-goa-yellow"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-goa-pink">Builder title</p>
            <p className="truncate font-serif text-lg text-white">{title}</p>
          </div>
          <button
            type="button"
            onClick={() => setReroll((n) => n + 1)}
            className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" />
            Reroll
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy !== null}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-goa-yellow px-6 py-3.5 text-sm font-bold tracking-wide text-[color:var(--goa-green-deep)] transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {busy === 'download' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={busy !== null}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-goa-pink px-6 py-3.5 text-sm font-bold tracking-wide text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {busy === 'share' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
            Share to X
          </button>
        </div>

        {status ? <p className="text-sm text-goa-yellow" role="status">{status}</p> : null}
      </div>

      {/* Preview */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-6">
        <CardPreview>
          <IdCard ref={cardRef} name={name} role={role} title={title} photoSrc={photoSrc} edition={EDITION} />
        </CardPreview>
      </div>
    </div>
  )
}

/* Scales the fixed-size card down to fit its container width. */
function CardPreview({ children }: { children: React.ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const box = boxRef.current
    const inner = innerRef.current
    if (!box || !inner) return

    const update = () => {
      const w = box.clientWidth
      const s = Math.min(1, w / ID_CARD_WIDTH)
      setScale(s)
      setHeight(inner.offsetHeight * s)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(box)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const inner = innerRef.current
    const box = boxRef.current
    if (!inner || !box) return
    const s = Math.min(1, box.clientWidth / ID_CARD_WIDTH)
    setHeight(inner.offsetHeight * s)
  })

  return (
    <div ref={boxRef} className="mx-auto w-full max-w-[460px]" style={{ height }}>
      <div
        ref={innerRef}
        style={{ width: ID_CARD_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  )
}
