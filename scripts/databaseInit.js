import { Sequelize, DataTypes } from "sequelize";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // convert current url (import.meta.url) into a file path
const __dirname = path.dirname(__filename); // get directory name of current module

const sequelizeObj = new Sequelize('database', 'user', 'password', {
    host: 'localhost', // localhost for on machine, insert connection address for remote
    dialect: 'sqlite', // engine
    logging: console.log,
    storage: path.resolve(__dirname, '../slabbo.sqlite'),  // db path, located in the root folder
});

const Users = sequelizeObj.define('users', {
    id: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
    }, 
    wins: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    losses: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    currency: {
        type: DataTypes.INTEGER,
        defaultValue: 100000,
        allowNull: false,
    },
}, {timestamps: false});

const activeWagers = sequelizeObj.define('activeWagers', {
    wagerId: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
    }, 
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    optionA: {
        type: DataTypes.TEXT,
    },
    optionB: {
        type: DataTypes.TEXT,
    },
    createdAt: {
        type: DataTypes.TEXT
    }
}, {timestamps: false});

async function initDatabase() {
    try {
        await sequelizeObj.authenticate();
        await sequelizeObj.sync(); // { force: true } to rebuild users table
        console.log('Connection successful!');
    } catch (error) {
        console.error('Unable to connect to db:', error);
    }
}

export default sequelizeObj;
export { Users, activeWagers, initDatabase };