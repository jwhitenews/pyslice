export type LessonStep = {
  id: string;
  title: string;
  concept: string;
  request: {
    method: "GET" | "POST";
    url: string;
    headers?: Record<string, string>;
    query?: Record<string, string | number | boolean>;
    body?: unknown;
  };
};

export type Lesson = {
  slug: string;
  title: string;
  description: string;
  steps: LessonStep[];
};

export const lessons: Lesson[] = [
  {
    slug: "intro",
    title: "Intro to APIs",
    description: "Make real requests and learn URL, method, headers, and query params.",
    steps: [
      {
        id: "1",
        title: "GET a resource",
        concept: "This is a GET request. You ask for a resource and get JSON back.",
        request: {
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/todos/1",
          headers: { Accept: "application/json" },
        },
      },
      {
        id: "2",
        title: "GET with query params",
        concept: "Query params are filters. Here we filter todos by userId.",
        request: {
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/todos",
          headers: { Accept: "application/json" },
          query: { userId: 1 },
        },
      },
    ],
  },
];

export function getLesson(slug: string) {
  return lessons.find((l) => l.slug === slug) ?? null;
}

export function getStep(lesson: Lesson, stepId: string) {
  return lesson.steps.find((s) => s.id === stepId) ?? null;
}