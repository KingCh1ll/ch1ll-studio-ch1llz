const Discord = require("discord.js")

module.exports.run = async (bot, old, updated) => {
  if (!old) return
  if (!updated) return

  const find = bot.config.services.status.bots.find(bot => bot.userID === updated.user.id)

  if (!find) return
  if (old.status === updated.status) return
  if (updated.guild.id !== find.guildID) return

  const statusChannel = await bot.channels.cache.get(bot.config.services.status.channel_ID)

  find.online = updated.status
  
  var SupportEmbed = new Discord.MessageEmbed()
    .setTitle("**Ch1ll Status**")
    .setDescription(`**Services**\n${bot.config.services.status.bots.map(b => `${b.online === true ? "<a:Check:819934065025220668>" : "<a:Cross:819934065314234418>"} - ${bot.users.cache.get(b.userID)}`).join("\n")}`)
    .setTimestamp();

  if (updated.status === "offline"){
      SupportEmbed
        .setFooter("Service(s) offline!")
        .setColor("RED")

      statusChannel.send("⚠️ | <@&829807263999852575>, SparkV is **OFFLINE**!")

      for (const id of bot.config.services.status.alertIDs){
        const user = bot.users.cache.get(id)

        if (!user){
          return console.log(`Alert contact: ${id} not found in bot user cache.`)
        }

        user.send(`⚠️ | ${await bot.users.cache.get(find.userID).username} is now **OFFLINE**!`)
      }
  } else if (updated.status === "online"){
      SupportEmbed
        .setFooter("All services online.")
        .setColor("GREEN")

      statusChannel.send("<a:Check:819934065025220668> | <@&829807263999852575>, SparkV is now back **ONLINE**.")

      for (const id of bot.config.services.status.alertIDs){
        const user = bot.users.cache.get(id)

        if (!user){
          return console.log(`Alert contact: ${id} not found in bot user cache.`)
        }

        user.send(`<a:Check:819934065025220668> | ${await bot.users.cache.get(find.userID).username} is now **ONLINE**.`)
      }
  }

  await statusChannel.lastMessage.edit(SupportEmbed)
}
