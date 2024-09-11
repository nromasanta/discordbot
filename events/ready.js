import { Events } from "discord.js";

const clientReadyEvent = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
    },
};

export default clientReadyEvent;