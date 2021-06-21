const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:061021_Webd3v@localhost:5432/workout-log");

module.exports = sequelize;