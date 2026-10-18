require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./db");

// Existing routes
const customerRoutes = require("./models/route/customers");
const productRoutes = require("./models/route/products");
const orderRoutes = require("./models/route/orders");

// New Enterprise System routes
const suppliersRoute = require("./models/route/suppliers");
const purchasesRoute = require("./models/route/purchases");
const expensesRoute = require("./models/route/expenses");
const employeesRoute = require("./models/route/employees");
const payrollRoute = require("./models/route/payroll");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("SHUBHR Backend is running 🚀");
});

// Existing API routes
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// New Enterprise System API routes
app.use("/api/suppliers", suppliersRoute);
app.use("/api/purchases", purchasesRoute);
app.use("/api/expenses", expensesRoute);
app.use("/api/employees", employeesRoute);
app.use("/api/payroll", payrollRoute);

// Start server and connect database
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`SHUBHR Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();