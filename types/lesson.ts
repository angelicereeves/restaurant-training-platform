export type LessonBlock =
  | { type: "callout"; text: string; label?: string }
  | { type: "bullets"; items: string[] }
  | { type: "subsection"; title: string; text?: string; bullets?: string[] };

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type ContentLesson = {
  id: string;
  moduleId: string;
  title: string;
  type: "content";
  objective?: string;
  blocks: LessonBlock[];
  order?: number;
};

export type QuizLesson = {
  id: string;
  moduleId: string;
  title: string;
  type: "quiz";
  objective?: string;
  quiz: {
    passingScore: number; // 0..1
    questions: QuizQuestion[];
  };
  order?: number;
};

/**
 * Back-compat for older lesson format (your current LessonPage uses lesson.content).
 * If you still have older lessons in JSON, they will continue to render.
 */
export type LegacyLesson = {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  order?: number;
};

export type Lesson = ContentLesson | QuizLesson | LegacyLesson;
