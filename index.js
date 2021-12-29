// KingCh1ll //
// Last Edited: 7/19/2021 //
// Index.js //

// Librarys //
const { Intents } = require("discord.js")
const dotenv = require("dotenv")
const express = require("express")

const logger = require("./modules/logger")

// Loading Splash Screen
console.log(require("asciiart-logo")(require("./package.json")).render());

if (require("./config.json").debug === true) {
  console.log(require("chalk").grey("----------------------------------------"));
  require("./modules/logger")("DEBUG - ENABLED -> Some features may not work on this mode.");
  console.log(require("chalk").grey("----------------------------------------"));
}

// Start //
dotenv.config({
    path: __dirname + "/.env"
})

process.on("uncaughtException", (err) => {
    logger(err.stack, "error")
})

process.on("unhandledRejection", (err) => {
    logger(err.stack, "error")
})

const Client = require("./structures/client")
const Web = express()
const server = require('http').Server(Web);

const Ch1llz = new Client({
    bot: {
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_PRESENCES
        ],
        allowedMentions: {
            parse: [
                "users",
                "roles",
                "everyone"
            ],
            repliedUser: true
        },
        presence: {
            activity: {
                name: `Ch1ll Studio`,
                type: "WATCHING"
            },
            status: "online"
        }
    }
})

// Functions //
async function Start() {
    await Ch1llz.LoadEvents(__dirname)
    await Ch1llz.LoadCommands(__dirname)

    await Ch1llz.LoadModules()

    Web.get('*', function (req, res) {
      res.status(200).send({ response: 200, message: "online" });
    })

    server.listen(3000, () => console.log("📋 | Website online."))

    require('socket.io')(server);
}

Start()

Ch1llz.login(process.env.token)