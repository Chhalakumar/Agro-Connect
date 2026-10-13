const Order = require("../models/orderSchema");
const { decreaseProductStocks } = require("../services/productServices");

// Add Order
const addOrder = async (req, res) => {
  try {
    const orders = req.body;
    const userId = req.userId;
    
    // Check orders variable is an array
    if (!Array.isArray(orders)) {
      return res.status(400).send({ message: "Invalid orders data" });
    }

    for (const order of orders) {
      order.userId = userId;

      let data = Order(order);
      let result = await data.save();
      console.log(result);
      await decreaseProductStocks(data.productId, data.orderQty);
    }

    res.status(200).send({ message: `All orders successfully received` });
  } catch (error) {
    res.status(500).send("Something went wrong!");
    console.log(error);
  }
};

// Retrieve Order by Seller ID
const showOrdersBySeller = async (req, res) => {
  try {
    let data = await Order.find({ sellerId: req.sellerId })
      .populate({
        path: "productId",
        select: "image category name measuringUnit pricePerUnit",
      })
      .populate({ path: "userId", select: "name email contact" })
      .lean();

    console.log(data);

    data = data.map((order) => {
      const totalPrice = order.orderQty * order.productId.pricePerUnit;
      return { ...order, totalAmount: totalPrice };
    });

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("Something went wrong!");
    console.log(error);
  }
};

// Retrieve Orders by User ID
const showOrdersByUser = async (req, res) => {
  try {
    let data = await Order.find({ userId: req.userId })
      .populate({
        path: "productId",
        select: "image category name measuringUnit pricePerUnit",
      })
      .populate({ path: "sellerId", select: "name brandName email contact" })
      .sort({ date: -1 })
      .lean();

    data = data.map((order) => {
      const totalPrice = order.orderQty * order.productId.pricePerUnit;
      return { ...order, totalAmount: totalPrice };
    });

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Something went wrong!" });
    console.log(error);
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ 
        message: "Invalid status. Valid statuses are: " + validStatuses.join(", ") 
      });
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Verify seller owns this order
    if (order.sellerId.toString() !== req.sellerId) {
      return res.status(403).send({ message: "Unauthorized: You can only update your own orders" });
    }

    const updateData = { status };
    
    // Set deliveredAt timestamp when status changes to Delivered
    if (status === "Delivered" && order.status !== "Delivered") {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate({
      path: "productId",
      select: "image category name measuringUnit pricePerUnit",
    })
    .populate({ path: "userId", select: "name email contact" });

    console.log(`✅ Order ${orderId} status updated to: ${status}`);

    res.status(200).send({ 
      message: `Order status updated to ${status}`,
      order: updatedOrder 
    });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong!" });
    console.log(error);
  }
};

module.exports = {
  addOrder,
  showOrdersBySeller,
  showOrdersByUser,
  updateOrderStatus,
};
