const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");

const logger = require("../modules/logger.js")

exports.run = async bot => {
  const services = bot.config.services

  // Get the Support Channel
  let SupportChannel = await bot.channels.cache.get(services.support.channel_ID);

  if (!SupportChannel) {
    SupportChannel = await bot.channels.fetch(services.support.channel_ID);

    if (!SupportChannel) {
      logger(`Unable to find support channel in Ch1llz's cache. Fetching also failed.`, "error")

      return process.exit(1)
    }
  }

  // Get the Status Channel
  let StatusChannel = await bot.channels.cache.get(services.status.channel_ID);

  if (!StatusChannel) {
    StatusChannel = await bot.channels.fetch(services.status.channel_ID);

    if (!StatusChannel) {
      logger(`Unable to find status channel in Ch1llz's cache. Fetching also failed.`, "error")

      return process.exit(1)
    }
  }

  // Get the Rules Channel
  let RulesChannel = await bot.channels.cache.get(services.rules.channel_ID);

  if (!RulesChannel) {
    RulesChannel = await bot.channels.fetch(services.rules.channel_ID);

    if (!RulesChannel) {
      logger(`Unable to find rules channel in Ch1llz's cache. Fetching also failed.`, "error")

      return process.exit(1)
    }
  }

  for (const watchbot of services.status.bots) {
    let user = bot.users.cache.get(watchbot.userID);

    if (!user) {
      user = await bot.users.fetch(watchbot.userID)

      if (!user) {
        logger(`Unable to find ${watchbot.userID} in Ch1llz's cache. Fetching also failed.`, "error")

        return process.exit(1)
      }
    }

    const guild = bot.guilds.cache.get(watchbot.guildID)

    if (!guild) {
      logger(`Error: Server (${watchbot.guildID}) doesn't have Ch1llz. Therefore, Ch1llz cannot track ${watchbot.userID}.`)

      return process.exit(1)
    }
  }

  // Rules Message
  await RulesChannel.messages.fetch().then(async messages => {
    let messagesFilter = messages.filter((msg) => msg.author.id !== bot.user.id)
    RulesChannel.bulkDelete(messagesFilter).catch(err => { });

    const welcomeEmbed = new MessageEmbed()
      .setTitle("**Ch1ll Studio**")
      .setDescription(`*Welcome to Ch1ll Studio!\n\nBefore using the server, please review these rules/information.*`)
      .setImage("https://imgur.com/q6QEfDZ.png")
      .setFooter("Welcome to the server!", bot.user.displayAvatarURL({ format: "png" }))
      .setColor("BLUE")
      .setTimestamp();

    const alert13Embed = new MessageEmbed()
      .setTitle("**13+ AGE REQUIREMENT**")
      .setDescription("Discord REQUIRES you to be 13+ to use Discord. Age requirements may vary for your location. [Learn more](https://support.discord.com/hc/en-us/articles/360040724612).")
      .setFooter("Any users that are found to be >13 will be banned from this server.", bot.user.displayAvatarURL({ format: "png" }))
      .setColor("YELLOW")
      .setTimestamp();

      const rulesEmbed = new MessageEmbed()
      .setTitle("**Rules**")
      .setDescription(`
            <a:Check:819934065025220668> | Abide by the Discord TOS and Community Guildlines at all times!
            <:list_bottom:891363023216840764> Abide by Discord TOS inside this server. THIS INCLUDES THE <13 AGE REQUIREMENT.

            <a:Check:819934065025220668> | No Posting NSFW!
            <:list_bottom:891363023216840764> Posting NSFW will give you give you a permanent ban. This rule Includes, but not limited to: gore, pornography, and shock content

            <a:Check:819934065025220668> | No pinging all roles!
            <:list_bottom:891363023216840764> DO NOT ping an entire role unless an emergency.

            <a:Check:819934065025220668> | No disrespect!
            <:list_bottom:891363023216840764> Respect people no matter their rank.
            
            <a:Check:819934065025220668> | Use channels for their correct purpose!
            <:list_bottom:891363023216840764> For example, don't use bot commands in a general text channel.

            <a:Check:819934065025220668> | No nickname trends!
            <:list_bottom:891363023216840764> This rule explains itself. Do not use a lot of special characters in a nickname or username as it will make you unpingable.
            
            <a:Check:819934065025220668> | No languages other than English!
            <:list_bottom:891363023216840764> Our staff cannot moderate a language they don't understand (the bots can't either).

            <a:Check:819934065025220668> | Always be kind!
            <:list_bottom:891363023216840764> All I'm saying is just don't be a bitch.

            <:link:875799346623426570> Links
            Terms of Service: https://discordapp.com/terms
            Community Guidelines: https://discord.com/guidelines

            <:Rules:851976618020438107> Staff can punish you accordingly to what they believe. If you think a punishment was too far or that you didn't deserve it, you can open a ticket about it (<#763871537585061958>).

            :alert: See a user breaking these rules? Report them to a moderator.
            `)
      .setFooter("By interacting in this server, you agree to the rules above.", bot.user.displayAvatarURL({ format: "png" }))
      .setColor("BLUE")
      .setTimestamp();

    const boostingEmbed = new MessageEmbed()
      .setTitle("**Server Boosting Info**")
      .setDescription(`
        <:boost:875797879401361408> Server Booster Perks
          - You will unlock an exclusive pink booster role for this server, unlock booster-only channel, and get 1 MILLION SPARKV COINS (message an admin to claim)!
          - Hoisted booster role in the server for others to see your swag, and support!
          - You can add up to 4 emojis of your choice to this server (emojis must abide by our rules)
      `)
      .setFooter("Enjoy these awesome perks if you boost our server. Thank you!", bot.user.displayAvatarURL({ format: "png" }))
      .setColor("#ffc0cb")
      .setTimestamp();

    const infoEmbed = new MessageEmbed()
      .setTitle("**Other Information**")
      .setDescription(`
        <:OofPing:819679702587408474> Don't like pings? You can choose what pings you like! Just scroll down to the roles embed. (@Everyone pings may be used occasionally).

        <:Support:851973309339664435> If you need support, you can go to <#763871537585061958>! If you can't find it, simply say "support" in a text channel and a bot will tell you how.
        
        <:Website:851967862344384533> Visit our website! https://ch1lls.tk/
        <:Website:851967862344384533> Visit SparkV's website! https://sparkv.tk/
        <:Settings:851973309612163112> Want to configure the settings for SparkV in your server? Visit SparkV's Dashboard at https://dashboard.sparkv.tk/
        `)
      .setFooter("If you encounter a problem, please report it to one of our admins.", bot.user.displayAvatarURL({ format: "png" }))
      .setColor("BLUE")
      .setTimestamp();

    const inviteEmbed = new MessageEmbed()
      .setTitle("Invite your Friends!")
      .setDescription(`
      🤝🏻 Want to invite you're friends? Use our permanent invite link: https://discord.gg/PPtzT8Mu3h
      `)
      .setFooter("Thank you!", bot.user.displayAvatarURL({ format: "png" }))
      .setColor("BLUE")
      .setTimestamp();

    const rolesEmbed = new MessageEmbed()
      .setTitle("Ping Roles")
      .setDescription("Some people like to be mentioned when things like when we host game nights. Below, you can customize what you want to be mentioned for.")
      .setFooter("No more annoying pings!!", bot.user.displayAvatarURL({ format: "png" }))
      .setColor("BLUE")
      .setTimestamp();

    async function createRoleButton(role) {
      const button = new MessageButton()
				.setCustomId(`role_${role.ID}`)
				.setLabel(`${role.emoji} ${role.name}`)
				.setStyle("SECONDARY")

      return button
    }

    const b1 = await createRoleButton(services.roles[0]);
    const b2 = await createRoleButton(services.roles[1]);
    const b3 = await createRoleButton(services.roles[2]);
    const b4 = await createRoleButton(services.roles[3]);
    const b5 = await createRoleButton(services.roles[4]);

    let messagePayload = {
      embeds: [
        welcomeEmbed,
        alert13Embed,
        rulesEmbed,
        boostingEmbed,
        infoEmbed,
        inviteEmbed,
        rolesEmbed
      ],
      components: [
        new MessageActionRow().addComponents(b1, b2, b3, b4, b5)
      ]
    }

    messages.last() ? await messages.last().edit(messagePayload) : await RulesChannel.send(messagePayload)
  })

  await SupportChannel.messages.fetch().then(async messages => {
    let messagesFilter = messages.filter(msg => msg.author.id !== bot.user.id);
    SupportChannel.bulkDelete(messagesFilter).catch(err => { });

    const SupportEmbed = new MessageEmbed()
      .setTitle("__**Ch1ll Support**__")
      .setDescription(`
            **Ch1ll Studio**
            1️⃣ - How do I purchase premium?
            **SparkV**
            2️⃣ - How do you invite SparkV?
            3️⃣ - How do you customize SparkV?
            4️⃣ - SparkV's audio quality sounds really laggy.
            5️⃣ - I can't hear SparkV!
            6️⃣ - SparkV is not responding to my commands / not responding at all.
            ☎ - None of the options above helped me. (Live support)
            `)
      .setFooter("Tap the button below that matches with the number of the problem on the list above that you have.")
      .setColor("BLUE")
      .setTimestamp();

    const B1 = new MessageButton()
      .setLabel("1")
      .setCustomId("B1")
      .setStyle("PRIMARY");

    const B2 = new MessageButton()
      .setLabel("2")
      .setCustomId("B2")
      .setStyle("PRIMARY");

    const B3 = new MessageButton()
      .setLabel("3")
      .setCustomId("B3")
      .setStyle("PRIMARY");

    const B4 = new MessageButton()
      .setLabel("4")
      .setCustomId("B4")
      .setStyle("PRIMARY");

    const B5 = new MessageButton()
      .setLabel("5")
      .setCustomId("B5")
      .setStyle("PRIMARY");

    const B6 = new MessageButton()
      .setLabel("6")
      .setCustomId("B6")
      .setStyle("PRIMARY");

    const openTicket = new MessageButton()
      .setLabel("")
      .setEmoji("☎")
      .setCustomId("ticket_create")
      .setStyle("PRIMARY");

    const holderButton = new MessageButton()
      .setLabel("\u200b")
      .setStyle("PRIMARY")
      .setCustomId("BH")
      .setDisabled(true);

    const holderButton2 = new MessageButton()
      .setLabel("\u200b")
      .setStyle("PRIMARY")
      .setCustomId("BH2")
      .setDisabled(true);

    const supportPayload = {
        embeds: [SupportEmbed],
        components: [
          new MessageActionRow().addComponents(B1, B2, B3),
          new MessageActionRow().addComponents(B4, B5, B6),
          new MessageActionRow().addComponents(holderButton, openTicket, holderButton2)
        ]
      }
    
    let SMessage = messages.last() ? await messages.last().edit(supportPayload) : await SupportChannel.send(supportPayload)

    global.support_message = SMessage

    setInterval(async () => {
      await SupportChannel.messages.fetch().then(FetchedMessages => {
        if (!FetchedMessages || FetchedMessages.length <= 0) {
          return;
        }

        const MessagesToDelete = FetchedMessages.filter(msg => (msg.id !== SMessage.id));

        SupportChannel.bulkDelete(MessagesToDelete).catch(err => { });
      });
    }, 1 * 1000);
  });

  // Status Message
  await StatusChannel.messages.fetch().then(async messages => {
    let messagesFilter = messages.filter((msg) => msg.author.id !== bot.user.id)
    StatusChannel.bulkDelete(messagesFilter).catch(err => { });

    const StatusEmbed = new MessageEmbed()
      .setTitle("__**Ch1ll Status**__")
      .setDescription(`**Services**\n${services.status.bots.map(b => `${b.online === true ? "<a:Check:819934065025220668>" : "<a:Cross:819934065314234418>"} - ${bot.users.cache.get(b.userID)}`).join("\n")}`)
      .setFooter("All services are online.")
      .setColor("GREEN")
      .setTimestamp();

    const statusPayload = {
      embeds: [StatusEmbed]
    }
    
    let SMessage = await messages.last() ? await messages.last().edit(statusPayload) : await StatusChannel.send(statusPayload)

    bot.status_message = SMessage
    services.status.message_ID = SMessage.id
  });
};
