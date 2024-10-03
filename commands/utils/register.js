import { SlashCommandBuilder } from 'discord.js';
import { Users } from '../../events/ready.js';

// defining command using discord's SlashCommandBuilder tool
const commandData = new SlashCommandBuilder()
    .setName('register')
    .setDescription('register for wagering');

// defining execute command
async function execute(interaction) {
    const caller = await Users.create({ name: interaction.user.username});
    console.log(caller instanceof Users);
    await interaction.reply('Successfully registered!');
}

// command obj with data and the execute func
const registerCommand = {
    data: commandData,
    execute,
};

// exporting
export default registerCommand;