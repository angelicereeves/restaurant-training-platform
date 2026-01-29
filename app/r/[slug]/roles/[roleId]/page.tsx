// app/r/[slug]/roles/[roleId]/page.tsx
import Link from "next/link"
import { getRestaurant } from "@/lib/getRestaurant"

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ slug: string; roleId: string }>
}) {
  const { slug, roleId } = await params
  const { config, roles, modules } = getRestaurant(slug)

  const role = roles.find((r) => r.id === roleId)

  if (!role) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-gray-900">Role not found.</p>
          <Link className="mt-4 inline-block underline" href={`/r/${slug}/roles`}>
            Back to roles
          </Link>
        </div>
      </main>
    )
  }

  const roleModules = modules
    .filter((m) => m.roleId === roleId)
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link className="text-sm text-gray-600 underline" href={`/r/${slug}/roles`}>
          ← Back to roles
        </Link>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold" style={{ color: config.primaryColor }}>
              {role.name} Training
            </h1>
            <p className="mt-2 text-gray-700">{role.description}</p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/r/${slug}/roles/${roleId}/checklists`}
              className="inline-flex items-center justify-center rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:shadow"
            >
              Checklists →
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roleModules.map((module) => (
            <Link
              key={module.id}
              href={`/r/${slug}/modules/${module.id}`}
              className="block rounded-xl border bg-white p-6 shadow-sm transition hover:shadow"
            >
              {/* MODULE HEADING */}
              <h2 className="text-xl font-bold text-gray-900">
                {module.title ?? module.name}
              </h2>

              {/* Optional duration */}
              {module.estimatedMinutes ? (
                <p className="mt-1 text-xs text-gray-500">
                  ~{module.estimatedMinutes} minutes
                </p>
              ) : null}

              {/* MODULE DESCRIPTION */}
              {module.description ? (
                <p className="mt-3 text-gray-700">{module.description}</p>
              ) : null}

              {/* CTA */}
              <p
                className="mt-4 text-sm font-medium"
                style={{ color: config.primaryColor }}
              >
                Open →
              </p>
            </Link>
          ))}

          {roleModules.length === 0 && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-gray-700">No modules for this role yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
