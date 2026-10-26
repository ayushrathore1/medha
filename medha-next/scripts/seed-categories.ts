/**
 * Seed default CampusCart categories
 * Run with: npx tsx scripts/seed-categories.ts
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/medha";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

const CATEGORIES = [
  {
    name: "Textbooks",
    slug: "textbooks",
    description: "Engineering, science, and academic textbooks",
    icon: "📘",
  },
  {
    name: "Drafters",
    slug: "drafters",
    description: "Drafting instruments and accessories",
    icon: "📐",
  },
  {
    name: "Calculators",
    slug: "calculators",
    description: "Scientific and graphing calculators",
    icon: "🧮",
  },
  {
    name: "Stationery",
    slug: "stationery",
    description: "Notebooks, pens, art supplies, and more",
    icon: "✏️",
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets, accessories, and components",
    icon: "💻",
  },
  {
    name: "Hostel Essentials",
    slug: "hostel-essentials",
    description: "Bedding, storage, kitchen, and room essentials",
    icon: "🏠",
  },
  {
    name: "Lab Equipment",
    slug: "lab-equipment",
    description: "Lab coats, instruments, and kits",
    icon: "🔬",
  },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Sports gear, gym equipment, and accessories",
    icon: "🏏",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (const cat of CATEGORIES) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (existing) {
        console.log(`⏭️  Skipping "${cat.name}" — already exists`);
      } else {
        await Category.create(cat);
        console.log(`✅ Created category: ${cat.name}`);
      }
    }

    console.log("\n🎉 Category seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
