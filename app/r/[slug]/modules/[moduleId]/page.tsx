//app/r/[slug]/modules/[moduleId]/page.tsx
import Link from "next/link"
import { getRestaurant } from "@/lib/getRestaurant"

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string }>
}) {
  const { slug, moduleId } = await params
  const { config, modules, lessons } = getRestaurant(slug)

  const trainingModule = modules.find((m) => m.id === moduleId)

  if (!trainingModule) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-800">Module not found.</p>
          <Link className="mt-4 inline-block underline" href={`/r/${slug}`}>
            Back
          </Link>
        </div>
      </main>
    )
  }

  const moduleLessons = lessons.filter(
    (l) => l.moduleId === trainingModule.id
  )

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          className="text-sm text-gray-600 underline"
          href={`/r/${slug}/roles/${trainingModule.roleId}`}
        >
          ← Back to modules
        </Link>

        <h1
          className="mt-4 text-3xl font-bold"
          style={{ color: config.primaryColor }}
        >
          {trainingModule.title ?? trainingModule.name}

        </h1>
        <p className="mt-2 text-gray-700">
          {trainingModule.description}
        </p>

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Lessons</h2>

          {moduleLessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/r/${slug}/lessons/${lesson.id}`}
              className="block rounded-xl border bg-white p-5 shadow-sm transition hover:shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {lesson.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Open lesson →
              </p>
            </Link>
          ))}

          {moduleLessons.length === 0 && (
            <p className="text-gray-600">
              No lessons in this module yet.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
