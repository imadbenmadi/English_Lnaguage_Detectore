const Sequelize = require("sequelize");
const dbConfig = require("../config/db.conf");

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
    }
);

module.exports = sequelize;
