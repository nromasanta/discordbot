// Client = represents bot
// Events = what the bot can listen to
// GatewayIntentBits = Type of events receieved 
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv';
import fs from 'node:fs'; // file system module to read commands dir
import path from 'node:path'; // construct paths to access other files/dirs
import { fileURLToPath, pathToFileURL} from 'node:url';

dotenv.config(); // reads .env and stores in process.env obj
const token = process.env.DISCORD_TOKEN; // use token to log into discord and, in turn, use API

// init client (bot)
// declares the intent to receive info about guilds(server) like avail channels/roles
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//client.once = listen for single occurence (ClientReady), stops listening after
// Events (what we listen to) => ClientReady (bot logged in, this is the specific event)

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

client.login(token);


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
            
            try {
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


// receiving interactions
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return; // ensure only slash commands
    console.log(interaction);

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'There was an error while executing this command', ephemeral: true})
        } else {
            await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true });
        }
    }
});

