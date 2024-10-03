import { Events } from "discord.js";
import { initDatabase } from "../scripts/databaseInit.js";


// create "model" aka how the table is represented in Sequelize

const clientReadyEvent = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await initDatabase();
        console.log(`Logged in as ${client.user.tag}`);
    },
};

export default clientReadyEvent;