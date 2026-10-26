"use client";

const features = [
  {
    icon: "🤖",
    title: "AI Chatbot",
    body: "Get instant answers to your study questions. Powered by Groq AI.",
  },
  {
    icon: "📝",
    title: "Smart Notes",
    body: "Upload PDFs, extract text with OCR, and auto-generate flashcards.",
  },
  {
    icon: "📊",
    title: "RTU Exam Analysis",
    body: "Unit-wise weightage analysis across years with AI-powered solutions.",
  },
  {
    icon: "🎴",
    title: "Flashcards",
    body: "AI-generated flashcards from your notes for spaced repetition.",
  },
  {
    icon: "💬",
    title: "Charcha Forum",
    body: "Reddit-style discussion forum for campus conversations.",
  },
  {
    icon: "💡",
    title: "Practice Mode",
    body: "Coding challenges with test cases and step-by-step solutions.",
  },
];

export function RevisionFeatures() {
  return (
    <section id="features" className="py-24 sm:py-32 px-6 bg-cream/40">
      <div className="max-w-6xl mx-auto">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-4 block text-center">Features</span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6 text-balance text-center">
          Everything you need<br />to <span className="italic text-primary">ace your exams.</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-md mx-auto mb-14 text-sm sm:text-base">
          One platform, all the tools to supercharge your studies.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <article
              key={f.title}
              className="group relative bg-card p-7 rounded-3xl ring-1 ring-border hover:ring-primary/30 transition-all hover:-translate-y-1 duration-500"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-display text-xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
