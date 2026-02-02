import Link from "next/link"
import { getRestaurant } from "@/lib/getRestaurant"
import type { Lesson, LessonBlock } from "@/types/lesson"

function isLegacyLesson(lesson: Lesson): lesson is Extract<Lesson, { content: string }> {
  return "content" in lesson
}

function renderBlocks(blocks: LessonBlock[]) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return <p>Lesson content coming soon.</p>
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "callout":
            return (
              <div key={idx} className="rounded-xl border bg-white p-4 shadow-sm">
                {block.label ? <p className="font-semibold">{block.label}</p> : null}
                <p className={block.label ? "mt-2" : ""}>{block.text}</p>
              </div>
            )

          case "bullets":
            return (
              <ul key={idx} className="list-disc pl-6">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )

          case "subsection":
            return (
              <section key={idx}>
                <h2 className="text-xl font-semibold">{block.title}</h2>
                {block.text ? <p className="mt-2">{block.text}</p> : null}
                {block.bullets?.length ? (
                  <ul className="mt-2 list-disc pl-6">
                    {block.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const decodedLessonId = decodeURIComponent(lessonId)

  const { config, lessons } = getRestaurant(slug)

  const lesson = lessons.find((l) => l.id === decodedLessonId) as Lesson | undefined

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

        {"objective" in lesson && lesson.objective ? (
          <p className="mt-2 text-gray-700">{lesson.objective}</p>
        ) : null}

        <div className="prose mt-6 max-w-none text-gray-900">
          {isLegacyLesson(lesson) ? (
            <p>{lesson.content}</p>
          ) : lesson.type === "content" ? (
            renderBlocks(lesson.blocks)
          ) : lesson.type === "quiz" ? (
            <div className="space-y-6">
              <p>This lesson includes a short quiz.</p>
              {lesson.quiz.questions.map((q, idx) => (
                <div key={q.id} className="rounded-xl border bg-white p-4 shadow-sm">
                  <p className="font-semibold">
                    {idx + 1}. {q.prompt}
                  </p>
                  <ul className="mt-2 list-disc pl-6">
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>Lesson content coming soon.</p>
          )}
        </div>
      </div>
    </main>
  )
}
