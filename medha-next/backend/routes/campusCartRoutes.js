const express = require("express");
const router = express.Router();
const campusCartController = require("../controllers/campusCartController");
const auth = require("../middleware/auth");

// Products Routes
router.get("/products", campusCartController.getProducts);
router.get("/products/:id", campusCartController.getProductById);
router.post("/products", auth, campusCartController.createProduct);
router.put("/products/:id", auth, campusCartController.updateProduct);
router.delete("/products/:id", auth, campusCartController.deleteProduct);

// Categories Routes
router.get("/categories", campusCartController.getCategories);

// Cart Routes
router.get("/cart", auth, campusCartController.getCart);
router.post("/cart", auth, campusCartController.addToCart);
router.put("/cart", auth, campusCartController.updateCartQty);
router.delete("/cart", auth, campusCartController.removeFromCart);

// Orders Routes
router.get("/orders", auth, campusCartController.getOrders);
router.post("/orders", auth, campusCartController.createOrder);

module.exports = router;
