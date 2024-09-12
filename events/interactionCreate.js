import { Events, EmbedBuilder } from 'discord.js';

//json obj
const interactionCreateEvent = {
    name: Events.InteractionCreate,
    // --
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {// ensure only slash commands
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
                    await interaction.followUp({ content: 'There was an error while executing this command', ephemeral: true })
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true });
                }
            }
        } else if (interaction.isModalSubmit()) {
            const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
            const botIcon = interaction.guild.members.me.user.displayAvatarURL();
            const interactionUserIcon = interactionUser.displayAvatarURL();

            console.log(`Interaction User: ${interactionUser.nickname}`);
            if (interaction.customId == 'betModal') {
                await interaction.reply({ content: '...' });
                const scenario = interaction.fields.getTextInputValue('scenarioInput');
	            const opt1 = interaction.fields.getTextInputValue('optionOneInput');
                const opt2 = interaction.fields.getTextInputValue('optionTwoInput');
	            console.log({ scenario, opt1, opt2 });

                const betEmbed = new EmbedBuilder() 
                .setColor(0x0099FF)
                .setTitle(`--------------------------------\n${scenario}\n--------------------------------`)
                .addFields( 
                    {
                        name: `1.`,
                        value: `${opt1}`
                    },
                    {
                        name: `2.`,
                        value: `${opt2}`
                    }
                )
                .setThumbnail(botIcon)
                .setFooter({ text: `Created by ${interactionUser.nickname}`, iconURL: `${interactionUserIcon}`})

                interaction.guild.channels.cache.get('1097682508381958174').send({ embeds: [betEmbed] });

            }
        }
    }
};

export default interactionCreateEvent;