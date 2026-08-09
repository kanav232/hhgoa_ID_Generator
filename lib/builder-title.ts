// Deterministic-ish fun "builder title" generator for the HH Goa ID card.
// Given a seed (name + stack) it always returns the same title, so a card
// stays stable between preview, download and the shared OG image.

const PREFIX = [
  'Sunrise',
  'Beachside',
  'Coastal',
  'Feni-Fueled',
  'Midnight',
  'Low-Tide',
  'Monsoon',
  'Susegad',
  'Sandy',
  'Palm-Shaded',
  'Tropical',
  'High-Noon',
]

const SUFFIX = [
  'Shipper',
  'Debugger',
  'Architect',
  'Prototype Wizard',
  'Ship-It Machine',
  'Bug Whisperer',
  'Deploy Daredevil',
  'Refactor Monk',
  'Full-Stack Surfer',
  'Commit Champion',
  'Edge-Case Hunter',
  'Pixel Pusher',
]

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function generateBuilderTitle(seed: string): string {
  const clean = seed.trim().toLowerCase() || 'anonymous builder'
  const h = hashString(clean)
  const prefix = PREFIX[h % PREFIX.length]
  const suffix = SUFFIX[Math.floor(h / PREFIX.length) % SUFFIX.length]
  return `${prefix} ${suffix}`
}
