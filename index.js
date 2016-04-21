'use strict'

require('dotenv').config()
var Botkit = require('botkit')

if (!process.env.token) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

var controller = Botkit.slackbot({
  debug: false,
  storage: undefined
})

controller.spawn({
  token: process.env.token
}).startRTM(function (error) {
  if (error) {
    throw new Error(error)
  }
})

controller.hears(['hello', 'hi'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
  bot.reply(message, 'Hellooo!')
})
