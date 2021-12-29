const os = require("os");
const Discord = require("discord.js");

module.exports = {
    data: {
      name: "status",
      description: "The status of the bots currently being watched."
    },
  async execute(bot, interaction) {
    let StatusEmbed = new Discord.MessageEmbed()
      .setTitle("**Ch1ll Status**")
      .setDescription(`**Services**\n${bot.config.services.status.bots.map(b => `${b.online === true ? "<a:Check:819934065025220668>" : "<a:Cross:819934065314234418>"} - ${bot.users.cache.get(b.userID)}`).join("\n")}`)
      .setTimestamp();

    if (global.ServiceOffline === true){
      StatusEmbed
        .setColor("GREEN")
        .setFooter("Service(s) offline!")
    } else {
      StatusEmbed
        .setColor("GREEN")
        .setFooter("All service(s) online.")
    }

    interaction.reply({
      embeds: [StatusEmbed]
    })
  },
};
