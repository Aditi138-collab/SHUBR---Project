const express = require("express");
const Customer = require("../Customer");

const router = express.Router();

// ==========================================
// GET ALL CUSTOMERS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE CUSTOMER
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    });
  }
});

// ==========================================
// ADD CUSTOMER
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      status,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required",
      });
    }

    const existingCustomer = await Customer.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer with this email already exists",
      });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add customer",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE CUSTOMER
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      status,
    } = req.body;

    if (email) {
      const existingCustomer = await Customer.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: req.params.id },
      });

      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: "Another customer already uses this email",
        });
      }
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        address,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE CUSTOMER
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error.message,
    });
  }
});

module.exports = router;