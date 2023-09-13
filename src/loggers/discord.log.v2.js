"use strict"

const { TOKEN_DISCORD, CHANNELID_DISCORD } = process.env

const { Client, GatewayIntentBits } = require("discord.js")
class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        })
        this.channelId = CHANNELID_DISCORD
        this.client.on("ready", () => {
            console.log(`Logged is as ${client.user.tag}`)
        })
        this.client.login(TOKEN_DISCORD)
    }
}

const loggerService = new LoggerService()

module.exports = loggerService
