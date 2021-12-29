const os = require("os");
const { MessageSelectMenu, MessageActionRow } = require("discord.js");

module.exports = {
  data: {
    name: "role",
    description: "Get a mentionable role!",
    options: [
      {
        type: 6,
        name: "role",
        description: "The role I should give you. To get a list of roles, do /role.",
        required: false
      }
    ]
  },

  async execute(bot, interaction, args) {
    console.log(args)
    let role = args ? args[0] : null

    if (role) {
      
    } else {
      const Selections = [];

      bot.config.services.role_select.roles.forEach((role) => {
        Selections.push({
          label: role.name,
          description: role.description,
          value: role.name,
          emoji: role.emoji ? role.emoji : null,
        });
      });

      const RoleSelect = new MessageSelectMenu()
        .setCustomId("SelectRoleMenu")
        .setPlaceholder("Select ping option below to customize your pings.")
        .addOptions(Selections)
        .setMinValues(1)
        .setMaxValues(1);

      await interaction.reply({
        content: "role select testing",
        components: [new MessageActionRow().addComponents(RoleSelect)]
      })
    }
  },
};