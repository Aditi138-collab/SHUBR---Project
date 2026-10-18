const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Unique order number
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ------------------------------------------------
    // OLD FIELD - kept for frontend compatibility
    // ------------------------------------------------
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    // ------------------------------------------------
    // NEW CUSTOMER RELATIONSHIP
    // ------------------------------------------------
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    // ------------------------------------------------
    // OLD FIELD - kept for frontend compatibility
    // ------------------------------------------------
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    // ------------------------------------------------
    // NEW PRODUCT RELATIONSHIP
    // ------------------------------------------------
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Existing frontend field
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // New professional naming
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Current frontend statuses remain supported
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Future professional order workflow
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "In Production",
        "Ready",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Payment tracking for future
    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Partially Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    // Future delivery tracking
    deliveryDate: {
      type: Date,
      default: null,
    },

    // Future customization support
    customization: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Optional customer instructions
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);