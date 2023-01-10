const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const app = express();
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(morgan('dev')); // morgan 미들웨어
app.use('/', express.static(path.join(__dirname, 'public'))); // static 미들웨어
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); // body-parser 미들웨어

app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie-parser 미드웨어

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
})); // express-session 미들웨어

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});