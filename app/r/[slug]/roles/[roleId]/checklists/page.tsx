//app/r/[slug]/roles/[roleId]/checklists/page.tsx
import Link from "next/link"
import { getRestaurant } from "@/lib/getRestaurant"
import { ChecklistCard } from "@/components/ChecklistCard"

export default async function RoleChecklistsPage({
  params,
}: {
  params: Promise<{ slug: string; roleId: string }>
}) {
  const { slug, roleId } = await params
  const { config, roles, modules, checklists } = getRestaurant(slug)

  const role = roles.find((r) => r.id === roleId)

  // If role doesn't exist, send them back to the roles list
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

  // Checklists belonging to this role (via role's modules)
  const roleModules = modules.filter((m) => m.roleId === roleId)
  const roleModuleIds = new Set(roleModules.map((m) => m.id))
  const roleChecklists = checklists.filter((c) => roleModuleIds.has(c.moduleId))

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          className="text-sm text-gray-600 underline"
          href={`/r/${slug}/roles/${roleId}`}
        >
          ← Back to {role.name}
        </Link>

        <h1 className="mt-4 text-3xl font-bold" style={{ color: config.primaryColor }}>
          {role.name} Checklists
        </h1>
        <p className="mt-2 text-gray-700">
          Use these for shift readiness and consistent execution.
        </p>

        {roleChecklists.length === 0 ? (
          <div className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-gray-700">No checklists for this role yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {roleChecklists.map((c) => (
              <ChecklistCard
                key={c.id}
                storageKey={`checklist:${slug}:${roleId}:${c.id}`}
                title={c.title}
                items={c.items}
                primaryColor={config.primaryColor ?? "#0f766e"}

              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
