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

controller.hears(['pizzatime'], ['direct_message', 'direct_mention'], (bot, message) => {
  function askFlavor (response, convo) {
    convo.say(':pizza:')
    convo.say('It is pizzatime! I am here to order a pizza for you.')
    convo.ask('What flavor of pizza would you like?', (response, convo) => {
      convo.say('Awesome.')
      askSize(response, convo)
      convo.next()
    })
  }

  function askSize (response, convo) {
    convo.ask('What size do you want?', (response, convo) => {
      convo.say('Ok.')
      askWhereDeliver(response, convo)
      convo.next()
    })
  }

  function askWhereDeliver (response, convo) {
    convo.ask('So where do you want it delivered?', (response, convo) => {
      convo.say('Understood! Your pizza is on its way')
      convo.say('Talk to you later!')
      convo.next()
    })
  }

  bot.startConversation(message, askFlavor)
})
