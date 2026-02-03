import Link from "next/link";
import { getRestaurant } from "@/lib/getRestaurant";
import type { Lesson, LessonBlock } from "@/types/lesson";
import QuizClient from "./quiz-client";

function isLegacyLesson(lesson: Lesson): lesson is Extract<Lesson, { content: string }> {
  return "content" in lesson;
}

function renderBlocks(blocks: LessonBlock[]) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return <p>Lesson content coming soon.</p>;
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
            );

          case "bullets":
            return (
              <ul key={idx} className="list-disc pl-6">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );

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
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default async function LessonPage({
  params,
}: {
  // ✅ must be Promise in your Next 15 build setup
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const decodedLessonId = decodeURIComponent(lessonId);

  const { config, lessons } = getRestaurant(slug);

  // ✅ give a safe fallback so QuizClient always gets a string
  const primaryColor = config.primaryColor ?? "#0f766e"; // teal-700 fallback

  const lesson = lessons.find((l) => l.id === decodedLessonId) as Lesson | undefined;

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
    );
  }

  const isLegacy = isLegacyLesson(lesson);
  const moduleId = !isLegacy && "moduleId" in lesson ? lesson.moduleId : undefined;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        {moduleId ? (
          <Link
            className="text-sm text-gray-600 underline"
            href={`/r/${slug}/modules/${moduleId}`}
          >
            ← Back to lessons
          </Link>
        ) : (
          <Link className="text-sm text-gray-600 underline" href={`/r/${slug}`}>
            ← Back
          </Link>
        )}

        <h1 className="mt-4 text-3xl font-bold" style={{ color: primaryColor }}>
          {lesson.title}
        </h1>

        {"objective" in lesson && lesson.objective ? (
          <p className="mt-2 text-gray-700">{lesson.objective}</p>
        ) : null}

        <div className="prose mt-6 max-w-none text-gray-900">
          {isLegacy ? (
            <p>{lesson.content}</p>
          ) : lesson.type === "content" ? (
            renderBlocks(lesson.blocks)
          ) : lesson.type === "quiz" ? (
            <div className="not-prose">
              <QuizClient
                primaryColor={primaryColor}
                passingScore={lesson.quiz.passingScore}
                questions={lesson.quiz.questions}
              />
            </div>
          ) : (
            <p>Lesson content coming soon.</p>
          )}
        </div>
      </div>
    </main>
  );
}
