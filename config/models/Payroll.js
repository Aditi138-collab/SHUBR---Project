const mongoose = require("mongoose");
const PayrollSchema = new mongoose.Schema({
  payrollNumber: { type: String, required: true, trim: true },
  employeeId: { type: String, required: true, trim: true },
  employeeName: { type: String, required: true, trim: true },
  month: { type: String, required: true, trim: true },
  basicSalary: { type: Number, required: true, min: 0 },
  allowances: { type: Number, default: 0, min: 0 },
  deductions: { type: Number, default: 0, min: 0 },
  netSalary: { type: Number, required: true, min: 0 },
  paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  paidDate: { type: Date, default: null }
}, { timestamps: true });
PayrollSchema.index({ employeeId: 1, month: 1 }, { unique: true });
module.exports = mongoose.models.Payroll || mongoose.model("Payroll", PayrollSchema);
