import { Events } from 'discord.js';

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
            if (interaction.customId == 'betModal') {
                await interaction.reply({ content: 'Model Submitted' });
            }
        }
    }
};

export default interactionCreateEvent;