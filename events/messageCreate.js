const Discord = require("discord.js")

module.exports.run = async (bot, message) => {
  if (message.content === "support"){
    message.reply("To get support, you can go to the channel #support")
  }
}