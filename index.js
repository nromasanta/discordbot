// Client = represents bot
// Events = what the bot can listen to
// GatewayIntentBits = Type of events receieved 
import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv';

// reads .env and stores in process.env obj
dotenv.config();

// use token to log into discord and, in turn, use API
const token = process.env.DISCORD_TOKEN;

// init client (bot)
// declares the intent to receive info about guilds(server) like avail channels/roles
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//client.once = listen for single occurence (ClientReady), stops listening after
// Events (what we listen to) => ClientReady (bot logged in, this is the specific event)

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

client.login(token);