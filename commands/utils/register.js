import { SlashCommandBuilder } from 'discord.js';
import { Users } from '../../scripts/databaseInit.js';
// -------------------------------------------------------
// Purpose: Insert new user joined into db
// Details:
// - Create a new Users
// - only need to define name, but the wins and losses default to 0 per the model
// -------------------------------------------------------

// defining command using discord's SlashCommandBuilder tool
const commandData = new SlashCommandBuilder()
    .setName('register')
    .setDescription('register for wagering');

// defining execute command
async function execute(interaction) {
    try {
        const caller = await Users.create({ id: interaction.user.id });
        await interaction.reply('Successfully registered!');
    } catch {
        await interaction.reply('Error registering. You might be already registered');
    }
}

// command obj with data and the execute func
const registerCommand = {
    data: commandData,
    execute,
};

// exporting
export default registerCommand;