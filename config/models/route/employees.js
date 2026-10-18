const Model = require("../Employee");
const createCrudRouter = require("./crudFactory");
module.exports = createCrudRouter(Model, "employees");
