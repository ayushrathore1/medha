/**
 * Seed script: CampusCart categories and products.
 * Run: node seeds/seed-campus-cart.js
 *
 * Populates the database with sample categories and products
 * for the CampusCart marketplace.
 */

require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/medha";

const categories = [
  { name: "Textbooks", slug: "textbooks", description: "Semester books, reference guides, and competitive exam prep", image: "📘" },
  { name: "Drafters", slug: "drafters", description: "Engineering and architecture drafters, all sizes", image: "📐" },
  { name: "Calculators", slug: "calculators", description: "Scientific, graphing, and basic calculators", image: "🧮" },
  { name: "Stationery", slug: "stationery", description: "Pens, pencils, notebooks, geometry boxes and more", image: "✏️" },
  { name: "Electronics", slug: "electronics", description: "Laptops, tablets, headphones and accessories", image: "💻" },
  { name: "Hostel Essentials", slug: "hostel-essentials", description: "Bedding, kitchenware, storage and daily needs", image: "🛏️" },
];

const products = [
  // Textbooks
  { name: "Engineering Mathematics (BS Grewal)", slug: "eng-maths-bs-grewal", price: 349, originalPrice: 550, image: "📘", categorySlug: "textbooks", condition: "good", college: "RTU Kota", tags: ["semester", "maths"] },
  { name: "Computer Networks (Tanenbaum)", slug: "computer-networks-tanenbaum", price: 399, originalPrice: 650, image: "📕", categorySlug: "textbooks", condition: "good", college: "RTU Kota", tags: ["cse", "networking"] },
  { name: "Database Management Systems (Korth)", slug: "dbms-korth", price: 449, originalPrice: 699, image: "📘", categorySlug: "textbooks", condition: "like-new", college: "RTU Kota", tags: ["cse", "dbms"] },
  { name: "Physics for Engineers", slug: "physics-for-engineers", price: 299, originalPrice: 450, image: "📕", categorySlug: "textbooks", condition: "fair", college: "RTU Kota", tags: ["semester", "physics"] },

  // Drafters
  { name: "Engineering Drafter (Full Set)", slug: "engineering-drafter-full", price: 249, originalPrice: 450, image: "📐", categorySlug: "drafters", condition: "like-new", college: "RTU Kota", tags: ["engineering", "drawing"] },
  { name: "Mini Drafter", slug: "mini-drafter", price: 149, originalPrice: 299, image: "📐", categorySlug: "drafters", condition: "new", college: "RTU Kota", tags: ["engineering", "portable"] },
  { name: "Professional Drafter Set", slug: "professional-drafter-set", price: 399, originalPrice: 599, image: "📐", categorySlug: "drafters", condition: "new", college: "RTU Kota", tags: ["engineering", "professional"] },
  { name: "Sheet Holder (A3 Size)", slug: "sheet-holder-a3", price: 79, originalPrice: 150, image: "📁", categorySlug: "drafters", condition: "new", college: "RTU Kota", tags: ["drawing", "storage"] },

  // Calculators
  { name: "Scientific Calculator (Casio FX-991)", slug: "casio-fx-991", price: 899, originalPrice: 1299, image: "🧮", categorySlug: "calculators", condition: "good", college: "RTU Kota", tags: ["scientific", "casio"] },
  { name: "Basic Calculator", slug: "basic-calculator", price: 199, originalPrice: 350, image: "🧮", categorySlug: "calculators", condition: "new", college: "RTU Kota", tags: ["basic", "everyday"] },
  { name: "Graphing Calculator", slug: "graphing-calculator", price: 2499, originalPrice: 3999, image: "🧮", categorySlug: "calculators", condition: "good", college: "RTU Kota", tags: ["graphing", "advanced"] },

  // Stationery
  { name: "A4 Notebook Bundle (5 pcs)", slug: "a4-notebook-bundle", price: 199, originalPrice: 350, image: "📓", categorySlug: "stationery", condition: "new", college: "RTU Kota", tags: ["notebooks", "bundle"] },
  { name: "Geometry Box", slug: "geometry-box", price: 149, originalPrice: 299, image: "✏️", categorySlug: "stationery", condition: "like-new", college: "RTU Kota", tags: ["geometry", "school"] },
  { name: "Mechanical Pencil Set (5 pcs)", slug: "mechanical-pencil-set", price: 89, originalPrice: 150, image: "✏️", categorySlug: "stationery", condition: "new", college: "RTU Kota", tags: ["pencils", "drafting"] },
  { name: "Color Pen Set (12 colors)", slug: "color-pen-set", price: 129, originalPrice: 249, image: "🖊️", categorySlug: "stationery", condition: "new", college: "RTU Kota", tags: ["pens", "colors"] },
  { name: "Sticky Notes Set", slug: "sticky-notes-set", price: 59, originalPrice: 99, image: "📋", categorySlug: "stationery", condition: "new", college: "RTU Kota", tags: ["notes", "study"] },
  { name: "Highlighters Pack (6 colors)", slug: "highlighters-pack", price: 119, originalPrice: 199, image: "🖍️", categorySlug: "stationery", condition: "new", college: "RTU Kota", tags: ["highlighters", "study"] },
  { name: "Pencil Box", slug: "pencil-box", price: 99, originalPrice: 179, image: "📦", categorySlug: "stationery", condition: "new", college: "RTU Kota", tags: ["storage", "pencils"] },

  // Electronics
  { name: "Laptop Stand (Foldable)", slug: "laptop-stand-foldable", price: 449, originalPrice: 799, image: "💻", categorySlug: "electronics", condition: "good", college: "RTU Kota", tags: ["laptop", "accessories"] },
  { name: "Wired Headphones", slug: "wired-headphones", price: 599, originalPrice: 999, image: "🎧", categorySlug: "electronics", condition: "like-new", college: "RTU Kota", tags: ["audio", "study"] },
  { name: "USB Hub (4-port)", slug: "usb-hub-4-port", price: 299, originalPrice: 499, image: "🔌", categorySlug: "electronics", condition: "new", college: "RTU Kota", tags: ["usb", "accessories"] },

  // Hostel Essentials
  { name: "Hostel Bed Sheet Set (Double)", slug: "bed-sheet-set-double", price: 599, originalPrice: 999, image: "🛏️", categorySlug: "hostel-essentials", condition: "new", college: "RTU Kota", tags: ["bedding", "comfort"] },
  { name: "Pillow (Memory Foam)", slug: "memory-foam-pillow", price: 349, originalPrice: 599, image: "🛏️", categorySlug: "hostel-essentials", condition: "new", college: "RTU Kota", tags: ["pillow", "sleep"] },
  { name: "Mess Tiffin Set (3 pcs)", slug: "tiffin-set-3pcs", price: 249, originalPrice: 399, image: "🍱", categorySlug: "hostel-essentials", condition: "new", college: "RTU Kota", tags: ["kitchen", "food"] },
  { name: "Plastic Storage Box", slug: "plastic-storage-box", price: 199, originalPrice: 349, image: "📦", categorySlug: "hostel-essentials", condition: "new", college: "RTU Kota", tags: ["storage", "organization"] },
  { name: "Electric Kettle", slug: "electric-kettle", price: 499, originalPrice: 799, image: "🫖", categorySlug: "hostel-essentials", condition: "good", college: "RTU Kota", tags: ["kitchen", "appliance"] },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB: ${MONGO_URI}`);

    const Category = mongoose.model("Category", new mongoose.Schema({}, { strict: false, collection: "categories" }));
    const Product = mongoose.model("Product", new mongoose.Schema({}, { strict: false, collection: "products" }));

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing categories and products.");

    // Create categories
    const createdCats = await Category.insertMany(categories);
    console.log(`Created ${createdCats.length} categories.`);

    const catMap = {};
    for (const cat of createdCats) {
      catMap[cat.slug] = cat._id;
    }

    // Create products
    const qualityOptions = ["pending", "verified", "premium", "standard"];
    const productDocs = products.map((p) => {
      const sellerPrice = p.price;
      const commissionPercent = 5;
      const commissionAmount = Math.round(sellerPrice * commissionPercent) / 100;
      const finalPrice = sellerPrice + commissionAmount;
      return {
        name: p.name,
        slug: p.slug,
        price: finalPrice,
        sellerPrice,
        commissionPercent,
        commissionAmount,
        originalPrice: p.originalPrice,
        images: [p.image],
        category: catMap[p.categorySlug],
        stock: Math.floor(Math.random() * 15) + 1,
        condition: p.condition,
        college: p.college,
        tags: p.tags,
        qualityVerification: qualityOptions[Math.floor(Math.random() * qualityOptions.length)],
        featured: Math.random() > 0.6,
        status: "active",
        description: `${p.name} in ${p.condition} condition. Priced at ₹${p.price}.`,
        seller: null,
      };
    }));

    const createdProducts = await Product.insertMany(productDocs);
    console.log(`Created ${createdProducts.length} products.`);

    console.log("\n✅ Seed complete!");
    console.log(`   ${createdCats.length} categories`);
    console.log(`   ${createdProducts.length} products`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
