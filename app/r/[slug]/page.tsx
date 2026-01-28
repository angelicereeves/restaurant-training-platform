import Link from "next/link"
import { getRestaurant } from "@/lib/getRestaurant"

export default async function RestaurantHomePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { config } = getRestaurant(slug)

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold" style={{ color: config.primaryColor }}>
            {config.name}
          </h1>

          <div
            className="mt-4 h-1 w-20 rounded-full"
            style={{ backgroundColor: config.secondaryColor }}
        />


          {config.motto && (
            <p className="mt-3 text-lg text-gray-700">
              {config.motto}
            </p>
          )}

          {config.about && (
            <p className="mt-6 text-gray-800 leading-relaxed">
              {config.about}
            </p>
          )}

          {config.values && config.values.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-900">Our Standards</h2>
              <ul className="mt-3 space-y-2 text-gray-800">
                {config.values.map((v, i) => (
                  <li key={i} className="flex gap-2">
                    <span style={{ color: config.secondaryColor }}>•</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/r/${slug}/roles`}
              className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: config.primaryColor }}
            >
              Start Training →
            </Link>

            
          </div>
        </div>
      </div>
    </main>
  )
}
