const { Telegraf, Context } = require('telegraf');
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const pancakeStorage = [];
const bruisesStorage = [];


bot.on(["channel_post", "message", "text"], (ctx) => 
    ctx
    .telegram
    .getUpdates(10000, 20, 100,["channel_post"])
    .then(value => {
      value.forEach((msg) => {
        if(msg.message) {
          if(msg.message?.forward_from_chat?.username === process.env.SNIPER_1) {
            pancakeStorage.push(msg.message.text.toLowerCase());
          }

          if(msg.message?.forward_from_chat?.username ===  process.env.SNIPER_2) {
            bruisesStorage.push(msg.message.caption.split("\n")[0].toLowerCase());
          }
        }
      });

      pancakeStorage.forEach(tokenMsg => {
        bruisesStorage.forEach(token => {
          if(tokenMsg.includes(`name: ${token}`)) {
            bot.telegram.sendMessage(process.env.CHAT_ID, tokenMsg);
          }
        })
      });
    }))

bot.launch();