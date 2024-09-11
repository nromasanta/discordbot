import { ActionRowBuilder, Events, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const commandData = new SlashCommandBuilder()
.setName('bet')
.setDescription('place a bet');

async function execute(interaction) {
    const modalData = new ModalBuilder()
        .setCustomId('betModal')
        .setTitle('Create your scenario');

    const scenarioInput = new TextInputBuilder()
        .setCustomId('scenarioInput')
        .setLabel("What are you betting on?")
        .setStyle(TextInputStyle.Short);

    const optionOneInput = new TextInputBuilder()
        .setCustomId('optionOneInput')
        .setLabel("Option 1")
        .setStyle(TextInputStyle.Short);

    const optionTwoInput = new TextInputBuilder()
        .setCustomId('optionTwoInput')
        .setLabel('Option 2')
        .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(scenarioInput);
    const secondActionRow = new ActionRowBuilder().addComponents(optionOneInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(optionTwoInput);

    modalData.addComponents(firstActionRow, secondActionRow, thirdActionRow);


    interaction.showModal(modalData);
}

const betCommand = { 
    data: commandData,
    execute
};

export default betCommand;