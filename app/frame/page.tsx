import type { Metadata } from 'next'
import Link from 'next/link'

type SearchParams = Promise<{ img?: string; name?: string; title?: string }>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const { img, name, title } = await searchParams
  const who = name ? `${name}'s` : 'My'
  const heading = `${who} Hacker House Goa 2026 Builder ID`
  const description = title
    ? `${title} — see you on the beach. #FrameInGoa`
    : 'Get your own builder ID. Sunrise, palms and code. #FrameInGoa'

  const images = img ? [{ url: img, width: 1150, height: 1438, alt: heading }] : undefined

  return {
    title: heading,
    description,
    openGraph: {
      title: heading,
      description,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: heading,
      description,
      images: img ? [img] : undefined,
    },
  }
}

export default async function FramePage({ searchParams }: { searchParams: SearchParams }) {
  const { img, name, title } = await searchParams

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-5 py-12 goa-dots">
      <div className="flex flex-col items-center gap-3 text-center">
        <img src="/hackerhouse-wordmark.png" alt="Hacker House" className="h-6 w-auto" />
        <h1 className="font-serif text-3xl text-goa-yellow sm:text-4xl">
          {name ? `${name}'s Builder ID` : 'Builder ID'}
        </h1>
        {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
      </div>

      {img ? (
        <img
          src={img || '/placeholder.svg'}
          alt="Hacker House Goa 2026 builder ID card"
          className="w-full max-w-sm rounded-2xl border-4 border-goa-pink shadow-2xl"
        />
      ) : (
        <p className="text-muted-foreground">No card found.</p>
      )}

      <Link
        href="/"
        className="rounded-full bg-goa-yellow px-6 py-3 text-sm font-semibold tracking-wide text-[color:var(--goa-green-deep)] transition-transform hover:scale-[1.03]"
      >
        Make your own builder ID →
      </Link>
    </main>
  )
}
