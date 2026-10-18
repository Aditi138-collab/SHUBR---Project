const express = require("express");
const mongoose = require("mongoose");

const Order = require("../Order");
const Customer = require("../Customer");
const Product = require("../Product");

const router = express.Router();

// ==========================================
// HELPER: ESCAPE REGEX
// ==========================================
function escapeRegex(value = "") {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

// ==========================================
// HELPER: OLD STATUS -> NEW ORDER STATUS
// ==========================================
function convertOldStatusToNewStatus(status) {
  switch (status) {
    case "Pending":
      return "Pending";

    case "Processing":
      return "In Production";

    case "Completed":
      return "Delivered";

    case "Cancelled":
      return "Cancelled";

    default:
      return "Pending";
  }
}

// ==========================================
// GET ALL ORDERS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "customer",
        "name email phone address"
      )
      .populate(
        "product",
        "productName category price stock"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE ORDER
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate(
        "customer",
        "name email phone address"
      )
      .populate(
        "product",
        "productName category price stock"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("GET SINGLE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// ==========================================
// ADD ORDER
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      orderNumber,
      customerName,
      productName,
      quantity,
      amount,
      status,

      // Relationship fields
      customer: customerId,
      product: productId,

      // New professional fields
      totalAmount,
      orderStatus,
      paymentStatus,
      deliveryDate,
      customization,
      notes,
    } = req.body;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================
    if (
      !orderNumber ||
      !customerName ||
      !productName ||
      quantity === undefined ||
      quantity === null ||
      amount === undefined ||
      amount === null
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    // ==========================================
    // CHECK DUPLICATE ORDER NUMBER
    // ==========================================
    const existingOrder = await Order.findOne({
      orderNumber: orderNumber.trim(),
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Order number already exists",
      });
    }

    // ==========================================
    // FIND CUSTOMER
    // ==========================================
    let customer = null;

    if (customerId) {
      if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid customer ID",
        });
      }

      customer = await Customer.findById(customerId);
    } else {
      customer = await Customer.findOne({
        name: {
          $regex: `^${escapeRegex(
            customerName.trim()
          )}$`,
          $options: "i",
        },
      });
    }

    // ==========================================
    // FIND PRODUCT
    // ==========================================
    let product = null;

    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      product = await Product.findById(productId);
    } else {
      product = await Product.findOne({
        productName: {
          $regex: `^${escapeRegex(
            productName.trim()
          )}$`,
          $options: "i",
        },
      });
    }

    // ==========================================
    // CREATE ORDER
    // ==========================================
    const finalAmount = Number(
      totalAmount !== undefined &&
      totalAmount !== null &&
      totalAmount !== ""
        ? totalAmount
        : amount
    );

    const finalOrderStatus =
      orderStatus ||
      convertOldStatusToNewStatus(status);

    const order = await Order.create({
      orderNumber: orderNumber.trim(),

      // Old compatibility fields
      customerName: customerName.trim(),
      productName: productName.trim(),

      quantity: Number(quantity),
      amount: Number(amount),

      // Relationships
      customer: customer
        ? customer._id
        : null,

      product: product
        ? product._id
        : null,

      // Professional fields
      totalAmount: finalAmount,

      status: status || "Pending",

      orderStatus: finalOrderStatus,

      paymentStatus:
        paymentStatus || "Pending",

      deliveryDate:
        deliveryDate || null,

      customization:
        customization || null,

      notes:
        notes || "",
    });

    // ==========================================
    // POPULATE CREATED ORDER
    // ==========================================
    const populatedOrder =
      await Order.findById(order._id)
        .populate(
          "customer",
          "name email phone address"
        )
        .populate(
          "product",
          "productName category price stock"
        );

    res.status(201).json({
      success: true,
      message: "Order added successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("ADD ORDER ERROR:", error);

    // Duplicate key safety
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Order number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add order",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE ORDER
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const {
      orderNumber,
      customerName,
      productName,
      quantity,
      amount,
      status,

      // Relationship fields
      customer: customerId,
      product: productId,

      // Professional fields
      totalAmount,
      orderStatus,
      paymentStatus,
      deliveryDate,
      customization,
      notes,
    } = req.body;

    // ==========================================
    // FIND EXISTING ORDER
    // ==========================================
    const existingOrder =
      await Order.findById(req.params.id);

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // CHECK DUPLICATE ORDER NUMBER
    // ==========================================
    if (
      orderNumber &&
      orderNumber.trim() !==
        existingOrder.orderNumber
    ) {
      const duplicateOrder =
        await Order.findOne({
          orderNumber: orderNumber.trim(),
          _id: {
            $ne: req.params.id,
          },
        });

      if (duplicateOrder) {
        return res.status(400).json({
          success: false,
          message: "Order number already exists",
        });
      }
    }

    // ==========================================
    // FIND CUSTOMER
    // ==========================================
    let customer = null;

    if (customerId) {
      if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid customer ID",
        });
      }

      customer =
        await Customer.findById(customerId);
    } else if (customerName) {
      customer =
        await Customer.findOne({
          name: {
            $regex: `^${escapeRegex(
              customerName.trim()
            )}$`,
            $options: "i",
          },
        });
    }

    // ==========================================
    // FIND PRODUCT
    // ==========================================
    let product = null;

    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      product =
        await Product.findById(productId);
    } else if (productName) {
      product =
        await Product.findOne({
          productName: {
            $regex: `^${escapeRegex(
              productName.trim()
            )}$`,
            $options: "i",
          },
        });
    }

    // ==========================================
    // PREPARE UPDATE
    // ==========================================
    const updateData = {};

    if (orderNumber !== undefined) {
      updateData.orderNumber =
        orderNumber.trim();
    }

    if (customerName !== undefined) {
      updateData.customerName =
        customerName.trim();
    }

    if (productName !== undefined) {
      updateData.productName =
        productName.trim();
    }

    if (quantity !== undefined) {
      updateData.quantity =
        Number(quantity);
    }

    if (amount !== undefined) {
      updateData.amount =
        Number(amount);
    }

    // ==========================================
    // CUSTOMER RELATIONSHIP
    // ==========================================
    if (customer) {
      updateData.customer =
        customer._id;
    } else if (customerName !== undefined) {
      // New/manual customer name
      // means no existing relationship
      updateData.customer = null;
    }

    // ==========================================
    // PRODUCT RELATIONSHIP
    // ==========================================
    if (product) {
      updateData.product =
        product._id;
    } else if (productName !== undefined) {
      // New/manual product name
      updateData.product = null;
    }

    // ==========================================
    // TOTAL AMOUNT
    // ==========================================
    if (
      totalAmount !== undefined &&
      totalAmount !== null &&
      totalAmount !== ""
    ) {
      updateData.totalAmount =
        Number(totalAmount);
    } else if (amount !== undefined) {
      updateData.totalAmount =
        Number(amount);
    }

    // ==========================================
    // OLD STATUS
    // ==========================================
    if (status !== undefined) {
      updateData.status = status;
    }

    // ==========================================
    // ORDER STATUS
    // ==========================================
    if (orderStatus !== undefined) {
      updateData.orderStatus =
        orderStatus;
    } else if (status !== undefined) {
      updateData.orderStatus =
        convertOldStatusToNewStatus(status);
    }

    // ==========================================
    // PAYMENT STATUS
    // ==========================================
    if (paymentStatus !== undefined) {
      updateData.paymentStatus =
        paymentStatus;
    }

    // ==========================================
    // DELIVERY DATE
    // ==========================================
    if (deliveryDate !== undefined) {
      updateData.deliveryDate =
        deliveryDate || null;
    }

    // ==========================================
    // CUSTOMIZATION
    // ==========================================
    if (customization !== undefined) {
      updateData.customization =
        customization;
    }

    // ==========================================
    // NOTES
    // ==========================================
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // ==========================================
    // UPDATE ORDER
    // ==========================================
    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "customer",
          "name email phone address"
        )
        .populate(
          "product",
          "productName category price stock"
        );

    res.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Order number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE ORDER
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order =
      await Order.findByIdAndDelete(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
});

module.exports = router;