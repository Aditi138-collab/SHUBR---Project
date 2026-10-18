const Model = require("../Expense");
const createCrudRouter = require("./crudFactory");
module.exports = createCrudRouter(Model, "expenses");
