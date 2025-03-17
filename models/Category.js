let { DataTypes, sequelize } = require("../lib/index");
const { Product } = require("./Products");

let Category = sequelize.define("categories", {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
});


module.exports = {
  Category,
};