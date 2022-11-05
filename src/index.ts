import {Telegraf} from 'telegraf';
import * as dotenv from 'dotenv';
import {findIfTicketsExist} from './functions';
import {__} from './i18n';

dotenv.config();

let serverUrl = process.env.SERVER_URL;
const {TELEGRAM_TOKEN} = process.env;

if (!TELEGRAM_TOKEN) {
  throw new Error('TOKEN is not defined');
}

if (!serverUrl && process.env.FLY_APP_NAME) {
  serverUrl = `http://${process.env.FLY_APP_NAME}.fly.dev`;
} else if (!serverUrl) {
  throw new Error('SERVER_URL is not defined');
}

const bot = new Telegraf(TELEGRAM_TOKEN);

// logger middleware
bot.use(async (ctx, next) => {
  if (ctx.updateType === 'message') {
    const messageText = (ctx.message as any).text || '';
    console.log(`${ctx.from?.username} said ${messageText}`);
  } else {
    console.log(`${ctx.from?.username} sent ${ctx.updateType}`);
  }

  next();
});

bot.command('start', ctx => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    'hello there! Welcome to my new telegram bot.',
    {}
  );
});

bot.on('sticker', ctx => ctx.reply('👍'));

bot.hears(__('hi'), ctx => ctx.reply(__('hey there')));

bot.hears(__('do I have any tickets?'), async ctx => {
  ctx.reply(__('checking for tickets') + '...');
  findIfTicketsExist()
    .then(hasTickets => {
      if (hasTickets) {
        ctx.reply(__('you have tickets') + '!');
      } else {
        ctx.reply(__('you have no tickets') + '!');
      }
    })
    .catch(err => {
      console.log(err);
      ctx.reply(__('something went wrong... cannot check if you have tickets'));
    });
});

bot
  .launch({
    webhook: {
      domain: serverUrl,
      port: parseInt(process.env.PORT || '8080'),
    },
  })
  .then(() => {
    console.log('🤖 Bot started as webhook');
  })
  .catch(() => {
    console.log('❌ Bot failed to start as webhook');
  });
