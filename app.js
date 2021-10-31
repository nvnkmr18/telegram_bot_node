var createError = require('http-errors');
var express = require('express');

require('dotenv').config()

const token = process.env.BOT_TOKEN

const { Telegraf } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api')


if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

// const bot = new Telegraf(token)
// bot.telegram.setWebhook(`https://red-kangaroo-45.loca.lt${secretPath}`)
// bot.on('text', (ctx) => ctx.replyWithHTML('<b>Hello</b>'))
// bot.start((ctx) => {
//   console.log("hi there")
//   ctx.reply('Welcome')}
//   )
// const secretPath = `/telegraf/${bot.secretPathComponent()}`

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, 'Received your message');
});

bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  const user = msg.new_chat_member.first_name
  const user_id = msg.new_chat_member.id
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Welcom new chat member'+user);
  bot.banChatMember(chatId, user_id);
});

bot.on('chat_member_updated', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Welcom new chat member');
});

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// app.use(bot.webhookCallback(secretPath))


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
