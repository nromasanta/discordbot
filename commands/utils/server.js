import { SlashCommandBuilder } from 'discord.js';
const commandData = new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides info about server');

async function execute(interaction) {
    await interaction.reply(`${interaction.guild.name} has ${interaction.guild.memberCount} members.`);
};

const serverCommand = {
    data: commandData,
    execute
};

export default serverCommand;