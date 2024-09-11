
// source: https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
// adjustments made to make this ES compatible


import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config(); // reads .env and stores in process.env obj
const token = process.env.DISCORD_TOKEN; // use token to log into discord and, in turn, use API
const guildId = process.env.SERVER_ID;
const clientId = process.env.APP_ID;
import fs from 'node:fs'; // file system module to read commands dir
import path from 'node:path'; // construct paths to access other files/dirs
import { fileURLToPath, pathToFileURL } from 'node:url'; // ES module utilities for handling paths

const commands = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
(async () => {
    for (const folder of commandFolders) {

        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            try {
                // use dynamic import() to import command files
                const commandModule = await import(pathToFileURL(filePath).href);
                const command = commandModule.default; // Get the default export
                
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            } catch (error) {
                console.log(`Error loading command at ${filePath}:`, error);
            }
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(token);

    // deploy commands
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();