
import { SlashCommandBuilder } from 'discord.js';


const commandData = new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides info about user');

async function execute(interaction) {
    await interaction.reply(`${interaction.user.username}. Join Date: ${interaction.member.joinedAt}`);
}

const userCommand = {
    data: commandData,
    execute
}

export default userCommand;