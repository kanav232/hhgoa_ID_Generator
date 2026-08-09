import { forwardRef } from 'react'

export type CardData = {
  name: string
  role: string
  title: string
  photoSrc: string | null
  edition: string
}

/* A deterministic bar pattern so the "ticket barcode" looks stable. */
const BARS = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 1, 3, 1]

export const ID_CARD_WIDTH = 460

export const IdCard = forwardRef<HTMLDivElement, CardData>(function IdCard(
  { name, role, title, photoSrc, edition },
  ref,
) {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden font-sans"
      style={{
        width: ID_CARD_WIDTH,
        borderRadius: 28,
        background: 'linear-gradient(180deg, #0a7a3f 0%, #086b37 55%, #075c2f 100%)',
        border: '5px solid #ff0080',
        boxShadow: 'inset 0 0 0 3px #fee101',
        color: '#ffffff',
      }}
    >
      {/* lanyard hole */}
      <div className="flex justify-center pt-4">
        <div
          style={{
            width: 74,
            height: 12,
            borderRadius: 999,
            background: 'rgba(0,0,0,0.28)',
            border: '2px solid #fee101',
          }}
        />
      </div>

      {/* header */}
      <div className="flex items-start justify-between px-6 pt-4">
        <div>
          <img
            src="/hackerhouse-wordmark.png"
            alt="Hacker House"
            crossOrigin="anonymous"
            style={{ height: 22, width: 'auto', display: 'block' }}
          />
          <div className="mt-2 flex items-end gap-2">
            <span
              className="font-serif leading-none"
              style={{ color: '#fee101', fontSize: 34, letterSpacing: '-0.01em' }}
            >
              GOA 2026
            </span>
            <img
              src="/goa-hindi.svg"
              alt="गोवा"
              crossOrigin="anonymous"
              style={{ height: 20, width: 'auto', marginBottom: 4 }}
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img
            src="/goa-monogram.svg"
            alt="HH Goa monogram"
            crossOrigin="anonymous"
            style={{ height: 46, width: 'auto' }}
          />
          <span
            style={{
              background: '#fee101',
              color: '#0a3d22',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.18em',
              padding: '3px 8px',
              borderRadius: 999,
            }}
          >
            BUILDER ID
          </span>
        </div>
      </div>

      {/* hero: illustration band + avatar */}
      <div className="relative mt-4" style={{ height: 132 }}>
        <img
          src="/sunrise.png"
          alt="Goa beach at sunrise"
          crossOrigin="anonymous"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 62%',
          }}
        />
        {/* fade into the panel below */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,122,63,0.35) 0%, rgba(10,122,63,0) 30%, rgba(7,92,47,0) 60%, #f4f6ee 100%)',
          }}
        />
      </div>

      {/* white ticket panel */}
      <div style={{ position: 'relative', background: '#f4f6ee', color: '#0a3d22', paddingBottom: 18 }}>
        {/* perforation */}
        <div className="flex items-center gap-1 px-4" style={{ transform: 'translateY(-9px)' }}>
          <div style={{ flex: 1, borderTop: '2px dashed rgba(10,61,34,0.35)' }} />
        </div>

        {/* avatar overlapping the band */}
        <div className="flex justify-center" style={{ marginTop: -78 }}>
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: 24,
              background: '#ffffff',
              border: '4px solid #fee101',
              boxShadow: '0 0 0 4px #ff0080, 0 10px 24px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
          >
            {photoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoSrc || '/placeholder.svg'}
                alt={name ? `${name}'s photo` : 'Uploaded photo'}
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center text-center"
                style={{ background: '#e8efe4', color: '#0a7a3f', fontSize: 11, fontWeight: 600, padding: 8 }}
              >
                YOUR
                <br />
                PHOTO
              </div>
            )}
          </div>
        </div>

        {/* name + role */}
        <div className="px-6 text-center" style={{ marginTop: 12 }}>
          <div
            className="font-serif"
            style={{ fontSize: 30, lineHeight: 1.05, color: '#0a3d22', wordBreak: 'break-word' }}
          >
            {name || 'Your Name'}
          </div>
          <div
            style={{
              marginTop: 6,
              display: 'inline-block',
              background: '#0a7a3f',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: 999,
            }}
          >
            {role || 'Builder'}
          </div>
        </div>

        {/* builder title */}
        <div className="mx-6 mt-4" style={{ position: 'relative' }}>
          <div
            style={{
              border: '2px solid rgba(10,61,34,0.15)',
              borderRadius: 16,
              padding: '12px 14px',
              background: '#ffffff',
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.24em',
                color: '#ff0080',
              }}
            >
              BUILDER TITLE
            </div>
            <div
              className="font-serif"
              style={{ fontSize: 22, lineHeight: 1.1, color: '#0a3d22', marginTop: 2 }}
            >
              {title}
            </div>
          </div>
        </div>

        {/* footer: barcode + hashtag */}
        <div className="mx-6 mt-4 flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-end" style={{ height: 34, gap: 2 }}>
              {BARS.map((w, i) => (
                <div
                  key={i}
                  style={{
                    width: w,
                    height: '100%',
                    background: i % 4 === 0 ? '#ff0080' : '#0a3d22',
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 9, letterSpacing: '0.14em', color: 'rgba(10,61,34,0.6)' }}>
              {edition}
            </span>
          </div>
          <div
            style={{
              background: '#ff0080',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.02em',
              padding: '6px 12px',
              borderRadius: 999,
              transform: 'rotate(-3deg)',
            }}
          >
            #FrameInGoa
          </div>
        </div>
      </div>
    </div>
  )
})
