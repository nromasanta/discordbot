import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Users } from '../../scripts/databaseInit.js';

const commandData = new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides info about user');

async function execute(interaction) {
    // get the user data from the db
    console.log(`${interaction.user.username}`)
    let userData = await Users.findAll({
        where: {
            name: interaction.user.username,
        }
    }); // returns array of obj

    console.log('Userdata:', userData[0].dataValues)
    const username = userData[0].dataValues.name;
    const currency = userData[0].dataValues.currency;
    const wins = userData[0].dataValues.wins;
    const losses = userData[0].dataValues.losses;

    const guild = interaction.guild;
    const serverIcon = guild.iconURL();
    const serverStatEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`User Stats for ${username}`)
        .addFields(
            {
                name: 'Slab Bucks:',
                value: `${currency}`,
                inline: false
            },
            {
                name: 'Wins',
                value: `${wins}`,
                inline: true
            },
            {
                name: 'Losses',
                value: `${losses}`,
                inline: true
            },
            {
                name: '%',
                value: 'tempval',
                inline: true
            },
            {
                name: 'Highest Payout',
                value: 'tempval',
                inline: false
            }
        )
        .setThumbnail(serverIcon)
    await interaction.reply({ embeds: [serverStatEmbed] });
}

const userCommand = {
    data: commandData,
    execute
}

export default userCommand;