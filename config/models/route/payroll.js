const Model = require("../Payroll");
const createCrudRouter = require("./crudFactory");
module.exports = createCrudRouter(Model, "payroll");
