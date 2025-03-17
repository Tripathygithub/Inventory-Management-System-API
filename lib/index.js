let sq=require('sequelize');

let sequelize=new sq.Sequelize({
    storage:"Database.sqlite",
    dialect:"sqlite"
});

module.exports={DataTypes:sq.DataTypes,sequelize};