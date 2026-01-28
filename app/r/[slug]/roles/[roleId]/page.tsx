import Link from "next/link"
import { getRestaurant } from "@/lib/getRestaurant"

export default async function RolePage({
  params,
}: {
  params: Promise<{ slug: string; roleId: string }>
}) {
  const { slug, roleId } = await params
  const { config, roles, modules } = getRestaurant(slug)

  const role = roles.find((r) => r.id === roleId)
  const roleModules = modules.filter((m) => m.roleId === roleId)

  if (!role) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-800">Role not found.</p>
          <Link className="mt-4 inline-block underline" href={`/r/${slug}`}>
            Back
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link className="text-sm text-gray-600 underline" href={`/r/${slug}`}>
          ← Back to roles
        </Link>

        <h1 className="mt-4 text-3xl font-bold" style={{ color: config.primaryColor }}>
          {role.name} Training
        </h1>
        <p className="mt-2 text-gray-700">{role.description}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roleModules.map((module) => (
            <Link
              key={module.id}
              href={`/r/${slug}/modules/${module.id}`}
              className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {module.name}
              </h2>
              <p className="mt-1 text-gray-600">
                {module.description}
              </p>
              <p className="mt-3 text-sm font-medium" style={{ color: config.primaryColor }}>
                Open →
              </p>
            </Link>
          ))}

          {roleModules.length === 0 && (
            <p className="text-gray-600">
              No modules assigned to this role yet.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
