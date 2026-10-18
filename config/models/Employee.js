const mongoose = require("mongoose");
const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  designation: { type: String, trim: true, default: "" },
  phone: { type: String, trim: true, default: "" },
  email: { type: String, trim: true, lowercase: true, default: "" },
  joiningDate: { type: Date, default: Date.now },
  monthlySalary: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, { timestamps: true });
module.exports = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
