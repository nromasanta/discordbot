import { SlashCommandBuilder, EmbedBuilder} from 'discord.js';
import { Users } from '../../scripts/databaseInit.js';
import sequelizeObj  from '../../scripts/databaseInit.js';
// -------------------------------------------------------
// Purpose: Display leaderboard
// Details:
// -------------------------------------------------------

// defining command using discord's SlashCommandBuilder tool
const commandData = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('display server leaderboard');


// defining execute command
async function execute(interaction) {
    const userList = await Users.findAll();
    console.log(userList);
    for (var i = 0; i < userList.length; i++) {
        console.log("hi");
    }
    const leaderboardEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`Leaderboard`)
        .addFields(
            {
                name: 'Placeholder',
                value: `tempval`,
                inline: false
            }
        )
    await interaction.reply({ embeds: [leaderboardEmbed] });
}

// command obj with data and the execute func
const registerCommand = {
    data: commandData,
    execute,
};

// exporting
export default registerCommand;