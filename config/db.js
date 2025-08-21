const { Sequelize } = require('sequelize');

// Validate required environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const sequelize = new Sequelize(
    process.env.DB_NAME,      
    process.env.DB_USER,      
    process.env.DB_PASSWORD,  
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: process.env.NODE_ENV !== 'production',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            connectTimeout: 60000
        },
        pool: {
            max: 2,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        retry: {
            max: 3,
            timeout: 60000
        }
    }
);

module.exports = sequelize;