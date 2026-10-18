const mongoose = require("mongoose");
const SupplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true, trim: true },
  companyName: { type: String, trim: true, default: "" },
  phone: { type: String, trim: true, default: "" },
  email: { type: String, trim: true, lowercase: true, default: "" },
  address: { type: String, trim: true, default: "" },
  productsSupplied: { type: String, trim: true, default: "" },
  paymentStatus: { type: String, enum: ["Unpaid", "Partial", "Paid"], default: "Unpaid" }
}, { timestamps: true });
module.exports = mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);
