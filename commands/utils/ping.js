import { SlashCommandBuilder } from 'discord.js';

// defining command using discord's SlashCommandBuilder tool
const commandData = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('pong reply');

// defining execute command
async function execute(interaction) {
    await interaction.reply('Pong?');
}

// command obj with data and the execute func
const pingCommand = {
    data: commandData,
    execute,
};

// exporting
export default pingCommand;