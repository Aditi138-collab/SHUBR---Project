const mongoose = require("mongoose");
const PurchaseOrderSchema = new mongoose.Schema({
  purchaseNumber: { type: String, required: true, trim: true },
  supplierName: { type: String, required: true, trim: true },
  productName: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unitCost: { type: Number, required: true, min: 0 },
  totalCost: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["Ordered", "Received", "Cancelled"], default: "Ordered" },
  orderDate: { type: Date, default: Date.now },
  notes: { type: String, default: "" }
}, { timestamps: true });
module.exports = mongoose.models.PurchaseOrder || mongoose.model("PurchaseOrder", PurchaseOrderSchema);
