import { Events, EmbedBuilder, InteractionResponse, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';

//json obj
const interactionCreateEvent = {
    name: Events.InteractionCreate,
    // --
    async execute(interaction) {
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id); // user who called interaction
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
            const botIcon = interaction.guild.members.me.user.displayAvatarURL(); // bot icon
            const interactionUserIcon = interactionUser.displayAvatarURL(); // user icon
            const interactionTime = new Date().toLocaleString();

            console.log(`Interaction User: ${interactionUser.nickname}`);
            if (interaction.customId == 'betModal') {
                await interaction.reply({ content: '...' });
                const scenario = interaction.fields.getTextInputValue('scenarioInput');
                const opt1 = interaction.fields.getTextInputValue('optionOneInput');
                const opt2 = interaction.fields.getTextInputValue('optionTwoInput');
                console.log({ scenario, opt1, opt2 });
                // ----- EMBED BUILDER ----- // 
                const betEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    // .setTitle(`${interactionUser.nickname} introduces a new wager...`)
                    .setTitle(`**-----------------------------\n${scenario}\n-----------------------------**`)
                    .addFields(
                        {
                            name: `\u0031\uFE0F\u20E3   ${opt1}`,
                            value: `\u200B`
                        },
                        {
                            name: `\u0032\uFE0F\u20E3   ${opt2}`,
                            value: `\u200B`
                        }
                    )
                    .setThumbnail(botIcon)
                    .setFooter({ text: `${interactionTime}`, iconURL: `${interactionUserIcon}` });
                // ----- BUTTON BUILDER ------ // 
                const opt1Button = new ButtonBuilder()
                    .setCustomId('opt1Button')
                    .setLabel(`1`)
                    .setStyle(ButtonStyle.Primary);
                const opt2Button = new ButtonBuilder()
                    .setCustomId('opt2Button')
                    .setLabel(`2`)
                    .setStyle(ButtonStyle.Secondary);

                const buttonRow = new ActionRowBuilder()
                    .addComponents(opt1Button, opt2Button);

                interaction.guild.channels.cache.get('1097682508381958174').send({ embeds: [betEmbed], components: [buttonRow] }); // send to appropriate channel

            }
        } else if (interaction.isButton()) {
            console.log("Button Clicked!");
            await interaction.reply({ content: `<@${interactionUser.id}> Enter amount you want to wager` });
            const messageFilter = m => m.author.id === interactionUser.id;
            const collector = interaction.channel.createMessageCollector({ filter: messageFilter, max: 1 });
            collector.on('collect', m => {
                console.log(`Message collected: ${m}`);
                interaction.followUp({ content: `${interactionUser.nickname} has wagered ${m} Slab Bucks` });
            });
        }
    }
};

export default interactionCreateEvent;