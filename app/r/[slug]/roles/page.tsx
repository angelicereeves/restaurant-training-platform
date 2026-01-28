import Link from "next/link"
import { getRestaurant } from "@/lib/getRestaurant"

export default async function RolesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { config, roles } = getRestaurant(slug)

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link className="text-sm text-gray-600 underline" href={`/r/${slug}`}>
          ← Back to home
        </Link>

        <h1 className="mt-4 text-3xl font-bold" style={{ color: config.primaryColor }}>
          Choose your role
        </h1>
        <p className="mt-2 text-gray-700">Select your position to begin training.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={`/r/${slug}/roles/${role.id}`}
              className="block rounded-xl border bg-white p-5 shadow-sm transition hover:shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">{role.name}</h2>
              <p className="mt-1 text-gray-600">{role.description}</p>
              <p className="mt-3 text-sm font-medium" style={{ color: config.primaryColor }}>
                Start →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
