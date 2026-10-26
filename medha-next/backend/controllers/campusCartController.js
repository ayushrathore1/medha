const Product = require("../models/Product");
const Category = require("../models/Category");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const mongoose = require("mongoose");

// Helper to generate order number
function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MCC-${ts}-${rand}`;
}

// ─── PRODUCTS ───

exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      college,
      university,
      condition,
      seller,
      featured,
      status = "active",
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sort = "-createdAt"
    } = req.query;

    const filter = {};
    if (status !== "all") {
      filter.status = status;
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          filter.category = cat._id;
        } else {
          filter.category = new mongoose.Types.ObjectId();
        }
      }
    }

    if (college) {
      filter.college = { $regex: college, $options: "i" };
    }

    if (university) {
      const usersInUniversity = await User.find({ university: { $regex: university, $options: "i" } }).select("_id");
      const userIds = usersInUniversity.map((u) => u._id);
      filter.seller = { $in: userIds };
    }

    if (condition) {
      filter.condition = condition;
    }

    if (seller) {
      filter.seller = seller;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("seller", "name avatar college")
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({ products, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({ message: "Error fetching products." });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("seller", "name avatar college");
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ message: "Error fetching product details." });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description = "",
      sellerPrice,
      originalPrice,
      images = [],
      category,
      stock = 1,
      condition = "used",
      college = "",
      tags = []
    } = req.body;

    if (!name || !slug || !sellerPrice || !category) {
      return res.status(400).json({ message: "Name, slug, sellerPrice, and category are required." });
    }

    // Resolve category
    let categoryId = category;
    let categorySlug = "";
    if (mongoose.Types.ObjectId.isValid(category)) {
      const cat = await Category.findById(category);
      if (!cat) return res.status(400).json({ message: "Invalid category." });
      categoryId = cat._id.toString();
      categorySlug = cat.slug;
    } else {
      const cat = await Category.findOne({ slug });
      if (!cat) return res.status(400).json({ message: "Invalid category." });
      categoryId = cat._id.toString();
      categorySlug = cat.slug;
    }

    const LIMITS = {
      "textbooks": 1500,
      "drafters": 800,
      "calculators": 2000,
      "stationery": 500,
      "electronics": 35000,
      "hostel-essentials": 4000
    };

    const maxLimit = LIMITS[categorySlug] || 5000;
    const priceNum = parseFloat(sellerPrice);

    if (priceNum < 10 || priceNum > maxLimit) {
      return res.status(400).json({ message: `Price must be between ₹10 and ₹${maxLimit} for this category.` });
    }

    const product = new Product({
      name,
      slug,
      description,
      sellerPrice: priceNum,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      images,
      category: categoryId,
      stock: parseInt(stock),
      condition,
      college,
      tags,
      seller: req.user.userId,
      commissionPercent: 6 // Enforce 6% commission
    });

    await product.save();
    res.status(201).json({ product });
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ message: "Error listing product." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    if (product.seller.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      product.set(key, updates[key]);
    });

    const updated = await product.save();
    res.status(200).json({ product: updated });
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ message: "Error updating product." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    if (product.seller.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product." });
  }
};

// ─── CATEGORIES ───

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories." });
  }
};

// ─── CART ───

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate("items.product");
    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart." });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required." });

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({ product: productId, quantity: parseInt(quantity) });
    }

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart." });
  }
};

exports.updateCartQty = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required." });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart." });

    const qtyNum = parseInt(quantity);
    if (qtyNum <= 0) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      item.quantity = qtyNum;
    }

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Error updating cart quantity." });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    if (productId) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      cart.items = [];
    }

    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart." });
  }
};

// ─── ORDERS ───

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders." });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, orderNotes = "" } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.college) {
      return res.status(400).json({ message: "Shipping address details are incomplete." });
    }

    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;
      if (!product) continue;

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}.` });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      totalAmount += product.price * item.quantity;

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      status: "pending",
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
      orderNotes,
      orderNumber: generateOrderNumber()
    });

    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Error placing order." });
  }
};
