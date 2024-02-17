require('dotenv').config()
const express = require('express');
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const app = express();
const conn = require('./db/conn')

const Thought = require('./models/Thought')
const User = require('./models/User');
const thoughtsRoutes = require('./routes/thoughtsRoutes');
const ThoughtsController = require('./controllers/ThoughtsController');

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json())

app.use(
    session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function(){},
            path: require('path').join(require('os').tmpdir(), process.env.SESSION_FOLDER),
        }),
        cookie: {
            secure: false,
            maxAge: +process.env.SESSION_COOKIE_AGE,
            expires: new Date(Date.now() + process.env.SESSION_COOKIE_EXPIRATION),
            httpOnly: true,
        }
    })
)

app.use(flash())

app.use((req, res, next) => {
    if(req.session.userId) {
        res.locals.session = req.session
    }

    next();
})

// routes
app.use('/thoughts', thoughtsRoutes);

app.get('/', ThoughtsController.showAll);

conn.sync()
    .then(() => {
        app.listen(+process.env.APP_PORT)
        console.info(`Server is running on port ${process.env.APP_PORT}`)
    })
    .catch((err) => console.log('DB connection failed: ' + err))

app.use(express.json());
