const categories = [
  { name: "Textbooks", icon: "📘", desc: "Semester books & reference guides", slug: "textbooks" },
  { name: "Drafters", icon: "📐", desc: "Engineering & architecture drafters", slug: "drafters" },
  { name: "Calculators", icon: "🧮", desc: "Scientific & graphing calculators", slug: "calculators" },
  { name: "Stationery", icon: "✏️", desc: "Pens, pencils, notebooks & more", slug: "stationery" },
  { name: "Electronics", icon: "💻", desc: "Laptops, tablets & accessories", slug: "electronics" },
  { name: "Hostel Essentials", icon: "🛏️", desc: "Bedding, kitchenware & storage", slug: "hostel-essentials" },
];

export function CampusCartCategories() {
  return (
    <section id="categories" className="py-24 sm:py-32 px-6 bg-cream/40">
      <div className="max-w-6xl mx-auto">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-4 block text-center">Categories</span>
        <h2 className="font-display text-4xl sm:text-5xl tracking-tight mb-14 text-balance text-center">
          What's <span className="italic text-primary">on campus</span> today?
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c) => (
            <a
              key={c.slug}
              href={`/campus-cart/category/${c.slug}`}
              className="group relative bg-card p-7 rounded-3xl ring-1 ring-border hover:ring-primary/30 transition-all hover:-translate-y-1 duration-500 block"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="text-3xl mb-4">{c.icon}</div>
              <h3 className="font-display text-xl mb-1">{c.name}</h3>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
