"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/types/lesson";

type Props = {
  primaryColor: string;
  passingScore: number;
  questions: QuizQuestion[];
};

export default function QuizClient({ primaryColor, passingScore, questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const { score, passed } = useMemo(() => {
    const total = questions.length;
    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) correct += 1;
    }
    const s = total ? correct / total : 0;
    return { score: s, passed: s >= passingScore };
  }, [answers, questions, passingScore]);

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-semibold text-gray-900">Knowledge Check</p>
        <span className="text-sm text-gray-600">
          Passing: {Math.round(passingScore * 100)}%
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selected = answers[q.id];
          return (
            <div key={q.id} className="space-y-3">
              <p className="font-semibold text-gray-900">
                {idx + 1}. {q.prompt}
              </p>

              <div className="grid gap-2">
                {q.options.map((opt, i) => {
                  const checked = selected === i;

                  const base =
                    "rounded-xl border p-3 cursor-pointer transition flex items-start gap-3";
                  const idle = "border-gray-200 hover:bg-gray-50";
                  const picked = "border-gray-400 bg-gray-50";

                  let stateClass = checked ? picked : idle;

                  if (submitted) {
                    if (i === q.correctIndex) stateClass = "border-green-300 bg-green-50";
                    if (checked && i !== q.correctIndex) stateClass = "border-red-300 bg-red-50";
                  }

                  return (
                    <label key={opt} className={`${base} ${stateClass}`}>
                      <input
                        type="radio"
                        name={q.id}
                        checked={checked}
                        onChange={() => {
                          setSubmitted(false);
                          setAnswers((prev) => ({ ...prev, [q.id]: i }));
                        }}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-900">{opt}</span>
                    </label>
                  );
                })}
              </div>

              {submitted && q.explanation ? (
                <p className="text-sm text-gray-700">
                  {answers[q.id] === q.correctIndex ? "✅ Correct: " : "❌ Not quite: "}
                  {q.explanation}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Submit Quiz
        </button>

        {submitted ? (
          <div className="rounded-lg border px-4 py-2">
            <p className="text-sm text-gray-900">
              Score: <span className="font-semibold">{Math.round(score * 100)}%</span>{" "}
              {passed ? <span className="ml-2">✅ Passed</span> : <span className="ml-2">❌ Not yet</span>}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
