const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

// Models
const Tought = require('./models/Tought')
const User = require('./models/User')

// Import routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

//Import controller
const ToughtsController = require('./controllers/ToughtController')


app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

//Session middleware
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () { },
      path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
      secure: false,
      maxAge: 36000000,
      expires: new Date(Date.now() + 36000000),
      httpOnly: true
    }
  })
)

//Flash messages
app.use(flash())

//Public path
app.use(express.static('public'))

// set session to res
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session
  }
  next()
})

//Routes

app.use('/toughts', toughtsRoutes)

app.use('/', authRoutes)
app.get('/', ToughtsController.showToughts)

conn.sync().then(() => { app.listen(3000) }).catch(err => console.log(err))