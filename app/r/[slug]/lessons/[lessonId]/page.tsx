import Link from "next/link";
import { getRestaurant } from "@/lib/getRestaurant";
import type { Lesson, LessonBlock } from "@/types/lesson";
import QuizClient from "./quiz-client";

function isLegacyLesson(lesson: Lesson): lesson is Extract<Lesson, { content: string }> {
  return "content" in lesson && typeof (lesson as any).content === "string";
}

function isContentLesson(lesson: Lesson): lesson is Extract<Lesson, { type: "content" }> {
  return (lesson as any).type === "content";
}

function isQuizLesson(lesson: Lesson): lesson is Extract<Lesson, { type: "quiz" }> {
  return (lesson as any).type === "quiz";
}

function BlockRenderer({ block }: { block: LessonBlock }) {
  if (block.type === "callout") {
    return (
      <div className="rounded-xl border bg-amber-50 p-4">
        {block.label ? (
          <p className="text-xs font-semibold text-amber-900">{block.label}</p>
        ) : null}
        <p className="text-sm text-amber-950">{block.text}</p>
      </div>
    );
  }

  if (block.type === "bullets") {
    return (
      <ul className="list-disc pl-5 space-y-1 text-gray-900">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  // subsection
  return (
    <div className="space-y-2">
      <p className="font-semibold text-gray-900">{block.title}</p>
      {block.text ? <p className="text-gray-900">{block.text}</p> : null}
      {block.bullets?.length ? (
        <ul className="list-disc pl-5 space-y-1 text-gray-900">
          {block.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const { config, lessons } = getRestaurant(slug);

  const lesson = lessons.find((l) => l.id === lessonId);

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

        {"objective" in lesson && (lesson as any).objective ? (
          <p className="mt-2 text-gray-700">{(lesson as any).objective}</p>
        ) : null}

        <div className="mt-6 space-y-5">
          {isContentLesson(lesson) ? (
            lesson.blocks.map((b, idx) => <BlockRenderer key={idx} block={b} />)
          ) : isQuizLesson(lesson) ? (
            <QuizClient
              primaryColor={config.primaryColor}
              passingScore={lesson.quiz.passingScore}
              questions={lesson.quiz.questions}
            />
          ) : isLegacyLesson(lesson) ? (
            <div className="prose max-w-none text-gray-900">
              <p>{lesson.content}</p>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
