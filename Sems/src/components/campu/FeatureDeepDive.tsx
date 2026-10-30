import flashcards640Avif from "@/assets/feature-flashcards-640.avif";
import flashcards1024Avif from "@/assets/feature-flashcards-1024.avif";
import flashcards640Webp from "@/assets/feature-flashcards-640.webp";
import flashcards1024Webp from "@/assets/feature-flashcards-1024.webp";

const features = [
  { title: "Semantic transcription", body: "Record any lecture — Campu writes structured notes as it listens." },
  { title: "Auto-flashcards", body: "Key concepts become spaced-repetition cards, ready before you leave class." },
  { title: "Exam radar", body: "Predicts what'll be tested by reading past papers and your syllabus." },
];

export function FeatureDeepDive() {
  return (
    <section id="study" className="py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 md:gap-20 items-center">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-4 block">Study OS · Live</span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6 text-balance">
            Notes that<br /><span className="italic">write themselves.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-md">
            Record your lecture and let Campu do the heavy lifting. It identifies key concepts, generates flashcards, and maps out a study schedule built around your real calendar.
          </p>
          <ul className="space-y-5">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4 group">
                <div className="shrink-0 mt-1.5 size-2 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="bg-card rounded-3xl p-3 ring-1 ring-border shadow-[var(--shadow-luxe)] rotate-1 hover:rotate-0 transition-transform duration-700">
            <picture>
              <source
                type="image/avif"
                srcSet={`${flashcards640Avif} 640w, ${flashcards1024Avif} 1024w`}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <source
                type="image/webp"
                srcSet={`${flashcards640Webp} 640w, ${flashcards1024Webp} 1024w`}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <img
                src={flashcards1024Webp}
                alt="Stack of AI-generated study cards for a chemistry course"
                width={1024}
                height={1536}
                loading="lazy"
                decoding="async"
                className="w-full h-auto rounded-2xl"
              />
            </picture>
          </div>
          <div className="absolute -top-8 -right-4 sm:-right-8 bg-card ring-1 ring-border rounded-2xl px-4 py-3 shadow-lg rotate-3 hidden sm:block">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Reviewed today</div>
            <div className="font-display text-2xl">+42 cards</div>
          </div>
        </div>
      </div>
    </section>
  );
}
