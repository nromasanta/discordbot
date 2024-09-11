import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';


const commandData = new SlashCommandBuilder()
    .setName('server')
    .setDescription('Server Stats');

async function execute(interaction) {
    const guild = interaction.guild;
    const serverIcon = guild.iconURL();
    const serverStatEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Server Info')
        .addFields(
            {
                name: '---',
                value: `**${interaction.guild.name}**\n**Date Created:** ${guild.createdAt.toDateString()}\n**ServerID:** ${guild.id}`,
                inline: false
            }
        )
        .setThumbnail(serverIcon)
    await interaction.reply({ embeds: [serverStatEmbed] });
};

const serverCommand = {
    data: commandData,
    execute
};

export default serverCommand;