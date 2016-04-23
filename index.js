'use strict'

require('dotenv').config()

const SLACK_TOKEN = process.env.SLACK_TOKEN

if (!SLACK_TOKEN) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

const Botkit = require('botkit')

const controller = Botkit.slackbot({
  debug: false,
  storage: undefined
})

controller.spawn({token: SLACK_TOKEN}).startRTM((error) => {
  if (error) {
    throw new Error(error)
  }
})

controller.hears(['gif of a (.*)'], ['direct_message', 'direct_mention'], (bot, message) => {
  const queryString = message.match[1]

  bot.reply(message, `You wanted me to find this GIF of a ${queryString}`)
})
