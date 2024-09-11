// Client = represents bot
// Events = what the bot can listen to
// GatewayIntentBits = Type of events receieved 
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import fs from 'node:fs'; // file system module to read commands dir
import path from 'node:path'; // construct paths to access other files/dirs
import { fileURLToPath, pathToFileURL} from 'node:url';
import dotenv from 'dotenv';
dotenv.config(); // reads .env and stores in process.env obj
const token = process.env.DISCORD_TOKEN; // use token to log into discord and, in turn, use API

// init client (bot)
// declares the intent to receive info about guilds(server) like avail channels/roles
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// --------------------- END INIT SETUP --------------------- //
client.commands = new Collection(); // store commands here

// __dirname equivalent for ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// setting path to 'commands' directory
const foldersPath = path.join(__dirname, 'commands'); // set path to 'commands' dir
const commandFolders = fs.readdirSync(foldersPath);  // read all folders names in 'commands' dir

// ----- COMMAND HANDLER ----- // 
// FUTURE NOTE: consider changing files to .mjs instead of .js
(async () => {
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder); // think $pwd to current folder (commands)
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // read all .js files in folder
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            try { // potential issue loading command - use try/catch
                const commandModule = await import(pathToFileURL(filePath).href); // import
                const command = commandModule.default; // get the defaeult exports
                if (command && 'data' in command && 'execute' in command) { // if with have both data and execute
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`);
                }
            } catch (error) {
                console.log(`Error loading command at ${filePath}:`, error);
            }
        }
    }
})();

const eventsPath = path.join(__dirname, 'events'); // set path to 'events' dir
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js')); // read all files in dir
for (const file of eventFiles) {
    console.log(`File: ${file}`); // file populated fine
	const filePath = path.join(eventsPath, file);
    const eventModule = await import(pathToFileURL(filePath).href); // 1. import
    const event = eventModule.default //  2. extract the entirety of 'export default xxx' into a variable
    console.log(`Event registered: ${event.name}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args)); // args array holds event
	} else {
		client.on(event.name, (...args) => event.execute(...args)); 
	}
}


client.login(token);

