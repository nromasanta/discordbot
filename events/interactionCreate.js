import { Events, EmbedBuilder, InteractionResponse, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Embed } from 'discord.js';
import { v4 as uuidv4 } from "uuid";
import { activeWagers } from '../scripts/databaseInit.js';


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
            const interactionTime = new Date().toLocaleString(); // timestamp submission
            console.log(`Interaction User: ${interactionUser.nickname}`);

            // check if modal has been submitted for creation of a wager
            if (interaction.customId == 'betModal') {
                await interaction.reply({ content: '...', ephemeral: true });
                // 1. extract relevant information
                // 2. insert into database
                // 3. create embed
                // 4. attach buttons
                // 5. send it

                // 1. extract relevant information
                const scenario = interaction.fields.getTextInputValue('scenarioInput');
                const opt1 = interaction.fields.getTextInputValue('optionOneInput');
                const opt2 = interaction.fields.getTextInputValue('optionTwoInput');

                let wagerId = uuidv4();
                console.log('Extracted from interaction ->', { scenario, opt1, opt2 });

                // 2. insert 
                const wagerRecord = activeWagers.create({ wagerId: wagerId, creatorId: interaction.user.id});
                console.log("wager record ->" , wagerRecord);

                // 3. create modal
                const betEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    //.setTitle(`${interactionUser.nickname} introduces a new wager...`)
                    .setTitle(`**-----------------------------\n${scenario}\n-----------------------------**`)
                    .addFields(
                        {
                            name: `\u0031\uFE0F\u20E3   ${opt1}  :coin: **placeholder**`,
                            value: `\u200B`
                        },
                        {
                            name: `\u0032\uFE0F\u20E3   ${opt2}  :coin: **placeholder**`,
                            value: `\u200B`
                        }
                    )
                    .setThumbnail(botIcon)
                    .setFooter({ text: `${interactionTime} || ID: ${wagerId}`, iconURL: `${interactionUserIcon}` });
                // 4. attach buttons
                const opt1Btn = new ButtonBuilder()
                    .setCustomId(`opt1Btn_${scenario}`) // attach senario to button so we can extract it later
                    .setLabel(`1`)
                    .setStyle(ButtonStyle.Primary);
                const opt2Btn = new ButtonBuilder()
                    .setCustomId(`opt2Btn_${scenario}`)
                    .setLabel(`2`)
                    .setStyle(ButtonStyle.Secondary);
                const finishBtn = new ButtonBuilder()
                    .setCustomId(`finishBtn_${scenario}`)
                    .setLabel(`Finish`)
                    .setStyle(ButtonStyle.Danger);
                const buttonRow = new ActionRowBuilder()
                    .addComponents(opt1Btn, opt2Btn, finishBtn);
                // 5. send 
                interaction.guild.channels.cache.get('1283977584652320850').send({ embeds: [betEmbed], components: [buttonRow] }); // send to appropriate channel
                
            }
            // ----- Button Resolution ----- // 
        } else if (interaction.isButton()) {
            console.log(interaction.customId);
            let footerText = interaction.message.embeds[0].footer.text;
            let footerRegex = /ID:\s([0-9A-z]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12})/;
            const extractedWagerId = footerText.match(footerRegex);
            console.log(`Extracted wager id -> ${extractedWagerId[1]}`);
            console.log(`Id of message creator -> ${interaction.user.id}`);


            let selectedBtn = (interaction.customId).slice(0, 7); // covers opt1Btn and opt2Btn
            let scenario = '!! ERROR !!';
            if (selectedBtn == ('opt1Btn' || 'opt2Btn')) {
                scenario = (interaction.customId).slice(8); // extract scenario by slicing off 'opt?Btn_'
                console.log(`Scenario extracted from ${selectedBtn} -> ${scenario}`);
            } else {
                console.log(`Pre-tested interaction.customId-> ${interaction.customId}`);
                scenario = (interaction.customId).slice(10);
                console.log(`Scenario extracted from finish button press-> ${scenario}`);
            }
            const max_wager = 500;


            // opt1 or op2
            if (interaction.customId != 'resolveBtn') {
                await interaction.reply({ content: `<@${interactionUser.id}> Enter amount you want to wager` });
                const messageFilter = m => m.author.id === interactionUser.id;
                const collector = interaction.channel.createMessageCollector({ filter: messageFilter, max: 1 });
                collector.on('collect', m => {
                    console.log(`Message collected: ${m}`);
                    if ((m.content.match(/^[0-9]+$/)) == null) { // sanitize input
                        console.log(`'${m.content}' contains non-numerical digits`);
                        interaction.followUp({ content: `Invalid Input` });
                        return;
                    }
                    const userInput = Number(m.content);
                    console.log(`Bet amount: ${userInput}`);
                    if (userInput > max_wager) {
                        interaction.followUp({ content: `Bet amount exceeds available balance` });
                        return;
                    }
                    interaction.followUp({ content: `${interactionUser.nickname} has wagered ${m} Slab Bucks` });

                });
                // finish
            } else if (interaction.customId == 'resolveBtn') {
                
                await interaction.reply({ content: `<@${interactionUser.id}> Select the Winner (1 or 2)` });
                const messageFilter = m => m.author.id === interactionUser.id;
                const collector = interaction.channel.createMessageCollector({ filter: messageFilter, max: 1 });
                collector.on('collect', m => {
                    console.log(`Message collected: ${m}`);
                    if (m.content != '1' || '2') { // sanitize input
                        console.log(`'${m.content}' is not a valid option`);
                        interaction.followUp({ content: `Invalid Input` });
                        return;
                    }
                    const userInput = Number(m.content);
                    console.log(`Winner declared: ${userInput}`);
                    interaction.followUp({ content: `${interactionUser.nickname} has wagered ${m} Slab Bucks` });

                });
            }



        }
    }
};

export default interactionCreateEvent;