'use strict'

// Load environmental constiables from .env file:
require('dotenv').config()
const SLACK_TOKEN = process.env.SLACK_TOKEN
const GIPHY_TOKEN = process.env.GIPHY_TOKEN
const WITAI_TOKEN = process.env.WITAI_TOKEN

if (!SLACK_TOKEN || !GIPHY_TOKEN || !WITAI_TOKEN) {
  throw new Error('Specify API tokens in environment!')
}

// Imports:
const botkit = require('botkit')
const wit = require('botkit-middleware-witai')({token: WITAI_TOKEN})
const giphy = require('giphy-api')(GIPHY_TOKEN)

// Initialize and spawn a slackbot using Botkit:
const controller = botkit.slackbot({
  debug: false,
  storage: undefined
})

controller.spawn({token: SLACK_TOKEN}).startRTM((error) => {
  if (error) {
    throw new Error(error)
  }
})

// Initialize wit.ai middleware:
controller.middleware.receive.use(wit.receive)

// Make the bot listen to direct messages and direct mentions, using wit.ai middleware:
controller.hears('default_intent', ['direct_message', 'direct_mention'], wit.hears, (bot, message) => {
  // Get entities from the intents detected by wit.ai:
  const entities = message.intents[0].entities

  // If wit.ai was able to extract entities, get going:
  if (entities.has_gif_request && entities.search_query) {
    const queryString = entities.search_query[0].value

    // Search for a GIF using the Giphy API:
    giphy.search(queryString).then((result) => {
      // Return the first search result:
      const gif = result.data.pop()
      bot.reply(message, `there you go: ${queryString}`)
      bot.reply(message, gif.images.fixed_width.url)
    })
  } else {
    bot.reply(message, 'Sorry, I did not get that. Could you try it again?')
  }
})
