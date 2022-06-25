const { Telegraf, Context } = require('telegraf');
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const postsStorage = [];
const tokensStorage = [];


bot.on(["channel_post", "message", "text"], (ctx) => 
    ctx
    .telegram
    .getUpdates(10000, 20, 100,["channel_post"])
    .then(value => {
      value.forEach((msg) => {
        if(msg.message) {
          if(msg.message?.forward_from_chat?.username === process.env.SNIPER_1) {
            const post = msg.message.text.toLowerCase();
            if(!postsStorage.includes(post)){
              postsStorage.push(post);

              postsStorage.forEach(postMsg => {
                tokensStorage.forEach(token => {
                  if( postMsg.includes(`name: ${token}`)){
                    bot.telegram.sendMessage(process.env.CHAT_ID, postMsg);
                  }
                })
              })   
            }
          }

          if(msg.message?.forward_from_chat?.username ===  process.env.SNIPER_2) {
            const coin = msg.message.caption.split("\n")[0].toLowerCase();
            if(!tokensStorage.includes(coin)){
              tokensStorage.push(msg.message.caption.split("\n")[0].toLowerCase());

              tokensStorage.forEach(token => {
                postsStorage.forEach(postMsg => {
                  if(postMsg.includes(`name: ${token}`)){
                    bot.telegram.sendMessage(process.env.CHAT_ID, postMsg);
                  }
                })
              }) 
            }
          }
        }
      });
    }))

bot.launch();