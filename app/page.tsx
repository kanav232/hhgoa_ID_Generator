import { FrameGenerator } from '@/components/frame-generator'

export default function Page() {
  return (
    <main className="relative min-h-svh overflow-hidden">
      {/* sky glow behind the header */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] goa-dots"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <img src="/hackerhouse-wordmark.png" alt="Hacker House" className="h-5 w-auto sm:h-6" />
          <img src="/goa-monogram.svg" alt="HH Goa (गोवा)" className="h-9 w-auto sm:h-10" />

        </header>

        {/* Hero */}
        <section className="flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-goa-yellow/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-goa-yellow">
            Builder ID Generator
          </span>
          <h1 className="max-w-3xl text-balance font-serif text-4xl leading-[1.05] text-white sm:text-6xl">
            Get your <span className="text-goa-yellow">Hacker House Goa</span> 2026 builder ID
          </h1>
          <p className="max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
            Upload a photo, add your name and stack, and grab a beachside badge built for the sunrise. Download it or
            share straight to X — no login, one pass, start to finish.
          </p>
          <span className="mt-1 rounded-full bg-goa-pink px-4 py-1.5 text-sm font-bold text-white">
            #FrameInGoa
          </span>
        </section>

        {/* Generator */}
        <section className="rounded-3xl border border-white/15 bg-[color:var(--goa-green-panel)]/60 p-5 shadow-2xl backdrop-blur sm:p-8">
          <FrameGenerator />
        </section>

        {/* Beach footer strip */}
        <section aria-hidden="true" className="relative -mx-5 -mb-8 mt-2 sm:-mx-8 sm:-mb-12">
          <img
            src="/sunrise.png"
            alt=""
            className="h-40 w-full object-cover object-[center_58%] opacity-90 sm:h-56"
          />
        </section>
      </div>
    </main>
  )
}
