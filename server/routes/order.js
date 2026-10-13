const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

// Add Order Item
router.post("/", verifyAccessToken, orderController.addOrder);

// Retrieve Order Items (User or Seller based on token)
router.get("/", verifyAccessToken, (req, res, next) => {
  if (req.sellerId) {
    return orderController.showOrdersBySeller(req, res, next);
  } else if (req.userId) {
    return orderController.showOrdersByUser(req, res, next);
  } else {
    return res.status(403).send({ message: "Invalid token" });
  }
});

// Update Order Status (Seller only)
router.patch("/:orderId/status", verifyAccessToken, orderController.updateOrderStatus);

module.exports = router;