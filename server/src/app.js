const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieSession = require('cookie-session')
const { notes, auth } = require('./routes')
require('./lib/passport')
require('dotenv').config()

const port = process.env.PORT || 8080
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieSession({
    maxAge: 9000 * 60 * 60 * 1000,
    name: 'stickie_note_session',
    keys: [process.env.COOKIE_ENCRYPT_KEY],
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('../client/build'))

app.use('/api/notes', notes)
app.use('/auth', auth)


module.exports = app
