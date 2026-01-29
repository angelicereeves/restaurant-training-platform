//app/r/[slug]/layout.tsx
import Link from "next/link"
import { getRestaurant } from "@/lib/getRestaurant"



export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { config } = getRestaurant(slug)

  return (
    <div
      className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100"
      style={
        {
          ["--brand" as any]: config.primaryColor,
          ["--accent" as any]: config.secondaryColor,
        } as React.CSSProperties
      }
    >
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href={`/r/${slug}`} className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg"
              style={{ backgroundColor: "var(--brand)" }}
              aria-hidden="true"
            />
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

      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

      <footer className="mt-12 border-t bg-white/60">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
          Training portal • {config.name}
        </div>
      </footer>
    </div>
  )
}
