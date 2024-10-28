require('dotenv').config()

module.exports = {
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  BASE_URL: process.env.BASE_URL,
  STATIC_URL: process.env.STATIC_URL,
  DATABASE_URI: process.env.DATABASE_URI,
  BOT_TOKEN: process.env.BOT_TOKEN,
  WEB_APP_URI: process.env.WEB_APP_URI,
  ADMINS: process.env.ADMINS,
  HASH_SALT: process.env.HASH_SALT,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME,
}
