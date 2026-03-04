import Link from "next/link";
import { getLesson, getStep } from "@/lib/lessons";
import StepRunner from "./step-runner";

export default async function LessonStepPage({
  params,
}: {
  params: Promise<{ slug: string; stepId: string }>;
}) {
  const { slug, stepId } = await params;

  const lesson = getLesson(slug);
  if (!lesson) return <main className="p-6">Lesson not found.</main>;

  const step = getStep(lesson, stepId);
  if (!step) return <main className="p-6">Step not found.</main>;

  const idx = lesson.steps.findIndex((s) => s.id === step.id);
  const prev = idx > 0 ? lesson.steps[idx - 1] : null;
  const next = idx < lesson.steps.length - 1 ? lesson.steps[idx + 1] : null;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href="/" className="text-sm text-gray-600 hover:underline">
        ← Home
      </Link>

      <h1 className="text-3xl font-bold mt-3">{lesson.title}</h1>
      <p className="text-gray-600 mt-2">{lesson.description}</p>

      <div className="mt-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold">
          Step {step.id}: {step.title}
        </h2>
        <p className="text-gray-700 mt-2 whitespace-pre-line">{step.concept}</p>

        <div className="mt-3 text-sm">
          <Link className="underline text-gray-700" href="/runs">
            View run history →
          </Link>
        </div>
      </div>

      <StepRunner step={step} lessonSlug={lesson.slug} stepId={step.id} />

      <div className="mt-8 flex items-center justify-between">
        {prev ? (
          <Link
            className="px-3 py-2 rounded border hover:bg-gray-50"
            href={`/lessons/${lesson.slug}/step/${prev.id}`}
          >
            ← Prev
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link
            className="px-3 py-2 rounded border hover:bg-gray-50"
            href={`/lessons/${lesson.slug}/step/${next.id}`}
          >
            Next →
          </Link>
        ) : (
          <span className="text-sm text-gray-600">Done ✅</span>
        )}
      </div>
    </main>
  );
}