const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_udemy', 'root', 'xxxxxxxx', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;