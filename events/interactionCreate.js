const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

async function GetTicketOpen(bot, member) {
  const ticket = await bot.channels.cache.filter(c => c.name.includes("ticket") && !c.name.includes("closed") && c.topic.includes(member.user.tag)).map(c => c);

  return ticket;
}

module.exports.run = async (bot, interaction) => {
  async function QAResponse(response) {
    await interaction.reply({
      content: response,
      ephemeral: true
    });
  }

  if (interaction.isCommand()) {
    const command = bot.commands.get(interaction.commandName);

    if (!command) return;

    const args = [];

    if (!command.data.options) command.data.options = [];

    for (const arg of command.data.options) {
      const gotArg = await interaction.options.get(arg.name);

      if (gotArg) {
        args.push([
          [arg.name] = gotArg.value
        ]);
      }
    }

    try {
      await command.execute(bot, interaction, args);
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: "❌ | There was an error while executing this command!", ephemeral: true
      });
    }
  } else if (interaction.isButton()) {
    if (interaction.customId.startsWith("B")) {
      if (interaction.customId === "B1") {
        // Q: How do I purchase premium?

        await QAResponse("You can purchase a subscription using Roblox Vip Servers here: https://ch1ll.tk/prenium");
      } else if (interaction.customId === "B2") {
        // Q: How do you invite SparkV?

        await QAResponse("Here's the invite link for SparkV. https://sparkv.tk/invite");
      } else if (interaction.customId === "B3") {
        // Q: How do you customize SparkV?

        await QAResponse("interaction 3");
      } else if (interaction.customId === "B4") {
        // Q: SparkV's audio quality sounds really laggy.

        await QAResponse("Laggy audio coming from SparkV is most likely the result of Discord's Servers having issues. If this problem continues, consider changing your Discord server's voice region. If that doesn't help, contact support (tap the phone interaction above).");
      } else if (interaction.customId === "B5") {
        // Q: I can't hear SparkV!

        await QAResponse("Error 404 (Not Found)");
      } else if (interaction.customId === "B6") {
        // Q: SparkV is not responding to my commands / not responding at all.

        await QAResponse("Make sure SparkV's role has permission to view, send messages and embed links.");
      }
    } else if (interaction.customId.startsWith("role")) {
      const roleID = interaction.customId.slice(5)
      const role = await interaction.guild.roles.cache.get(roleID) || await interaction.guild.roles.fetch(roleID)

      if (!interaction.member.roles.cache.get(roleID)) {
        await interaction.member.roles.add(roleID)

        interaction.reply({
          content: `The role <@&${roleID}> was successfully added to you!`,
          ephemeral: true
        })
      } else {
        await interaction.member.roles.remove(roleID)

        interaction.reply({
          content: `The role <@&${roleID}> was successfully removed from you.`,
          ephemeral: true
        })
      }
    } else if (interaction.customId.startsWith("ticket")) {
      if (interaction.customId === "ticket_create") {
        // Open ticket.

        let allChannels = await bot.channels.cache.filter(c => c.name.includes("ticket")).map(c => c);

        let already = await bot.channels.cache.some(c => c.name.includes("ticket") && !c.name.includes("closed") && c.topic.includes(interaction.member.user.tag));

        if (already === true) {
          return await interaction.reply({
            content: `You already have a ticket open in ${await GetTicketOpen(bot, interaction.member)}`,
            ephemeral: true
          });
        }

        let ticketChannel = await interaction.guild.channels.create(`ticket-${allChannels.length}`, {
          type: "text",
          topic: `${interaction.member.user.tag}'s Ticket | ${interaction.member.id}`,
          parent: "819277109750136852",
          permissionOverwrites: [
            {
              id: interaction.member.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
            },
            {
              id: interaction.guild.roles.everyone,
              deny: ["VIEW_CHANNEL"]
            },
            {
              id: bot.config.services.support.roleID,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
            }
          ]
        });

        let supportEmbed = new MessageEmbed()
          .setTitle(`Support Awaits!`)
          .setDescription(`Support will be with you shortly.\n\nTicket Creator: ${interaction.member.user}`)
          .setFooter("To close this ticket tap the 🔒 below.", bot.user.displayAvatarURL())
          .setColor("BLUE")
          .setTimestamp();

        let lockButton = new MessageButton()
          .setEmoji("🔒")
          .setStyle("SECONDARY")
          .setCustomId(`ticket_close_${interaction.channel.id}`);

        ticketChannel.send({
          embeds: [supportEmbed],
          components: [
            new MessageActionRow().addComponents(lockButton)
          ]
        });

        interaction.reply({
          content: `Your ticket has been created. ${ticketChannel}`,
          ephemeral: true
        });
      } else if (interaction.customId.startsWith(`ticket_close`)) {
        let closedEmbed = new MessageEmbed()
          .setColor("#ffffff")
          .setDescription(
            `Ticket closed by ${interaction.user}\n🔓 Reopen Ticket\n📛 Delete Ticket`
          );

        let reopen = new MessageButton()
          .setLabel("")
          .setCustomId(`ticket_reopen_${interaction.channel.id}`)
          .setEmoji("🔓")
          .setStyle("SUCCESS");

        let deleteinteraction = new MessageButton()
          .setLabel("")
          .setCustomId(`ticket_delete_${interaction.channel.id}`)
          .setEmoji("📛")
          .setStyle("DANGER");

        interaction.channel
          .edit({
            name: `${interaction.channel.name}-closed`,
            permissionOverwrites: [
              {
                id: interaction.member.id,
                deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: bot.config.services.support.roleID,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
            ],
          })
          .catch(err => { });

        interaction.reply({
          embeds: [closedEmbed],
          components: [
            new MessageActionRow().addComponents(reopen, deleteinteraction)
          ]
        }).catch(err => { });
      } else if (interaction.customId === `ticket_reopen_${interaction.channel.id}`) {
        let createdBy = interaction.channel.topic.replace("'s Ticket", "");
        console.log(interaction.channel.topic.split(" | ")[1])

        interaction.channel.edit({
          name: interaction.channel.name.toString().replace("-closed", ""),
          permissionOverwrites: [
            {
              id: interaction.channel.topic.split(" | ")[1],
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            },
            {
              id: interaction.guild.roles.everyone,
              deny: ["VIEW_CHANNEL"],
            },
            {
              id: bot.config.services.support.roleID,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            },
          ],
        });

        interaction.reply(`This ticket has been reopened. Welcome back!`)
      } else if (interaction.customId.startsWith("ticket_delete")) {
        let deleteEmbed = new MessageEmbed()
          .setColor("#ffffff")
          .setDescription("Ticket will be deleted in 5 seconds.");

        interaction.reply({
          embeds: [deleteEmbed]
        });
        try {
          setTimeout(() => {
            interaction.channel.delete().catch(err => { });
          }, 5000);
        } catch (err) {
          console.log("Attempted to delete a channel that didn't exist.");
        }
      }
    } else {
      console.log(`Unknown interaction: ${interaction.customId}.`);

      return await interaction.reply({
        content: `Unknown interaction: ${interaction.customId}.`,
        ephemeral: true
      });
    }
  }
};
