const os = require("os");
const Discord = require("discord.js");

module.exports = {
    data: {
      name: "userinfo",
      description: "See your information.",
      options: [
        {
          type: 6,
          name: "user",
          description: "The user to check the information of. If left empty, the user will be you.",
          required: false
        }
      ]
    },
	
  async execute(bot, interaction) {
    let user

    if (interaction.options.get("user")) {
      user = interaction.options.get("user").value
    } else {
      user = interaction.user.id
    }

    let member = interaction.channel.guild.members.cache.get(user);
    var age2 = Date.parse(new Date(member.user.id/4194304+1420070400000))

    const InfoEmbed = new Discord.MessageEmbed()
      .setAuthor(
        member.user.tag, member.user.displayAvatarURL({ dynamic: true})
      )
      .addFields(
        {
          name: "**Account Info**",
          value: `Joined: <t:${~~(
            member.joinedAt / 1000
          )}:R>\nRegistered: <t:${~~(age2 / 1000)}:R>`,
          inline: true,
        },
        {
          name: "**Profile Links**",
          value: `Avatar URL: [Click Here](${
            member.user
              ? member.user.displayAvatarURL({ dynamic: true, format: "png" })
              : member.displayAvatarURL({ dynamic: true, format: "png" })
          })`,
          inline: true,
        }
      )
      .setFooter(
        "Ch1llz - Making Ch1ll Studio Better",
        bot.user.displayAvatarURL({ dynamic: true, format: "png" })
      )
      .setColor("BLUE");

    interaction.reply({
      embeds: [InfoEmbed],
    });
  },
};