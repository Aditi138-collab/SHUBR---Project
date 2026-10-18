const Model = require("../PurchaseOrder");
const createCrudRouter = require("./crudFactory");
module.exports = createCrudRouter(Model, "purchases");
