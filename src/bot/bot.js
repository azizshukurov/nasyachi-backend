const { Telegraf, Markup } = require('telegraf')
const { BOT_TOKEN, ADMINS } = require('../config/environments')

const bot = new Telegraf(BOT_TOKEN)

bot.start(async (ctx) => {
  // console.log(`User telegram ID: ${ctx.from.id}`)

  // if (!ADMINS.split(',').join(' ').includes(ctx.from.id)) {
  //   return   ctx.reply(
  //     'Assalomu alaykum! Nasyachi botga xush kelibsiz! Siz Admin emassiz!'
  //   )
  // }

  ctx.reply(
    'Assalomu alaykum! Nasyachi botga xush kelibsiz!',
    Markup.inlineKeyboard([
      Markup.button.webApp(
        'Web appni ochish',
        `https://nasyachi-uz.vercel.app`
      ),
    ])
  )
})

module.exports = { bot }
