import Link from "next/link"
import { getRestaurant } from "@/lib/getRestaurant"
import type { Lesson } from "@/types/lesson"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const { config, lessons } = getRestaurant(slug)

  const lesson = lessons.find((l) => l.id === lessonId) as Lesson | undefined

  if (!lesson) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-900">Lesson not found.</p>
          <Link className="mt-4 inline-block underline" href={`/r/${slug}`}>
            Back
          </Link>
        </div>
      </main>
    )
  }

  // Legacy support: old lessons had `content: string`
  const legacyContent = "content" in lesson ? lesson.content : undefined

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          className="text-sm text-gray-600 underline"
          href={`/r/${slug}/modules/${lesson.moduleId}`}
        >
          ← Back to lessons
        </Link>

        <h1 className="mt-4 text-3xl font-bold" style={{ color: config.primaryColor }}>
          {lesson.title}
        </h1>

        <div className="prose mt-6 max-w-none text-gray-900">
          {legacyContent ? <p>{legacyContent}</p> : <p>Lesson content coming soon.</p>}
        </div>
      </div>
    </main>
  )
}
