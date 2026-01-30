// app/r/[slug]/layout.tsx
import Link from "next/link"
import { getRestaurant } from "@/lib/getRestaurant"

type CSSVarStyle = React.CSSProperties & {
  [key: `--${string}`]: string
}

export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { config } = getRestaurant(slug)

  const primary = config.primaryColor ?? "#0f766e"
  const secondary = config.secondaryColor ?? "#f59e0b"

  const bg = config.backgroundColor ?? "#ffffff"
  const text = config.textColor ?? "#0f172a"

  const heroImage = config.heroImage
  const heroAlt = config.heroAlt ?? `${config.name} hero`
  const heroOverlay = config.heroOverlay !== false

  const styleVars: CSSVarStyle = {
    "--brand": primary,
    "--accent": secondary,
    "--bg": bg,
    "--text": text,
  }

  return (
    <div
      className="min-h-screen"
      style={{
        ...styleVars,
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href={`/r/${slug}`} className="flex items-center gap-2">
            {config.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logo}
                alt={`${config.name} logo`}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div
                className="h-8 w-8 rounded-lg"
                style={{ backgroundColor: "var(--brand)" }}
                aria-hidden="true"
              />
            )}

            <span className="font-semibold text-slate-900">{config.name}</span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href={`/r/${slug}/roles`}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Roles
            </Link>
            <Link
              href={`/r/${slug}/roles`}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Start Training
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      {heroImage ? (
        <section className="mx-auto max-w-5xl px-4 pt-6">
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt={heroAlt}
              className="h-40 w-full object-cover sm:h-52"
            />

            {heroOverlay ? (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            ) : null}

            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-xl font-semibold text-white sm:text-2xl">
                {config.name}
              </h1>
              {config.motto ? (
                <p className="mt-1 text-sm text-white/90 sm:text-base">
                  {config.motto}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

      <footer className="mt-12 border-t bg-white/60">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
          Training portal • {config.name}
        </div>
      </footer>
    </div>
  )
}
