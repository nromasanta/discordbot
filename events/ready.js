import { Events } from "discord.js";
import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost', // localhost for on machine, insert connection address for remote
    dialect: 'sqlite', // engine
    logging: console.log,
    storage: 'slabbo.sqlite'  // db name!
});

// create "model" aka how the table is represented in Sequelize
const Users = sequelize.define('users', {
    name: {
        type: DataTypes.STRING,
        unique: true,
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
});

const clientReadyEvent = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            await sequelize.authenticate();
            Users.sync(); // { force: true } to rebuild users table
            console.log('Connection successful!');
        } catch (error) {
            console.error('Unable to connect to db:', error);
        }
        console.log(`Logged in as ${client.user.tag}`);
    },
};

export default clientReadyEvent;
export { Users };