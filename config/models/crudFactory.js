const express = require("express");
function createCrudRouter(Model, label) {
  const router = express.Router();
  router.get("/", async (_req, res) => {
    try { const records = await Model.find().sort({ createdAt: -1 }); res.json({ success: true, count: records.length, records }); }
    catch (e) { res.status(500).json({ success: false, message: `Failed to load ${label}`, error: e.message }); }
  });
  router.get("/:id", async (req, res) => {
    try { const record = await Model.findById(req.params.id); if (!record) return res.status(404).json({ success: false, message: `${label} not found` }); res.json({ success: true, record }); }
    catch (e) { res.status(400).json({ success: false, message: `Invalid ${label} ID`, error: e.message }); }
  });
  router.post("/", async (req, res) => {
    try { const record = await Model.create(req.body); res.status(201).json({ success: true, message: `${label} created`, record }); }
    catch (e) { res.status(400).json({ success: false, message: e.code === 11000 ? `Duplicate ${label} value` : `Could not create ${label}`, error: e.message }); }
  });
  router.put("/:id", async (req, res) => {
    try { const record = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!record) return res.status(404).json({ success: false, message: `${label} not found` }); res.json({ success: true, message: `${label} updated`, record }); }
    catch (e) { res.status(400).json({ success: false, message: `Could not update ${label}`, error: e.message }); }
  });
  router.delete("/:id", async (req, res) => {
    try { const record = await Model.findByIdAndDelete(req.params.id); if (!record) return res.status(404).json({ success: false, message: `${label} not found` }); res.json({ success: true, message: `${label} deleted` }); }
    catch (e) { res.status(400).json({ success: false, message: `Could not delete ${label}`, error: e.message }); }
  });
  return router;
}
module.exports = createCrudRouter;
