const Model = require("../Supplier");
const createCrudRouter = require("./crudFactory");
module.exports = createCrudRouter(Model, "suppliers");
