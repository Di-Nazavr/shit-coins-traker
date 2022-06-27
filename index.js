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

            tokensStorage.forEach(token => {
              if(post.includes(`name: ${token}`)){
                bot.telegram.sendMessage(process.env.CHAT_ID, post);
              }
            })
          }
        }

        if(msg.message?.forward_from_chat?.username ===  process.env.SNIPER_2) {
          const coin = msg.message.caption.split("\n")[0].toLowerCase();
          if(!tokensStorage.includes(coin)){
            tokensStorage.push(coin);

            postsStorage.forEach(postMsg => {
              if(postMsg.includes(`name: ${coin}`) || postMsg.includes(`name: ${coin.replace(/ /g, "")}`)){
                bot.telegram.sendMessage(process.env.CHAT_ID, postMsg);
              }
            }) 
          }
        }
      }
    });
  }))

bot.launch();