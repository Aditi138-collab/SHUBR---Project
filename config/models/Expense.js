const mongoose = require("mongoose");
const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  expenseDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: "Cash" },
  notes: { type: String, default: "" }
}, { timestamps: true });
module.exports = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
