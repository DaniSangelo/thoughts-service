require('dotenv').config()
const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('thoughts', 'root', 'daniel', {
    dialect: process.env.SEQUELIZE_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
})

try {
    sequelize.authenticate()
} catch (err) {
    console.log(`Unable to connect to database: ${err}`);
}

module.exports = sequelize;