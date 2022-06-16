const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const moment = require('moment');

/* mongodb connection */
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const indexRouter = require('./routes/index');

const app = express();

/* set mongoose connection */
const db_url = 'mongodb://ec2-54-180-153-35.ap-northeast-2.compute.amazonaws.com/subscribe';
const mongoDB = process.env.MONGODB_URI || db_url;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology:true
};

const store = new MongoDBStore({
  uri: 'mongodb://ec2-54-180-153-35.ap-northeast-2.compute.amazonaws.com/subscribe',
  collection: 'userSessions'
})

mongoose.connect(db_url, options, err => {
  if(err) throw err;
  console.log('Connected to MongoDB!!!')
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to mongod server')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
  name: 'subscribe.sid',
  // secret: 세션을 설정할 때의 key값, 혹시 모를 세션 해킹을 대비하기 위해 주기적으로 값 변경
  secret: "subscribe365@Keysecretoqwinoins",
  // resave: 세션을 저장하고 불러오는 과정에서 세션을 다시 저장할건지 선택가능
  resave: false,
  // saveUninitialized: 세션을 저장할 때 초기화를 할 것인지
  saveUninitialized: true,
  // cookie: 쿠키 설정 (maxAge: 최대 머무르는 시간, httpOnly: 해커가 세션 접근을할 때 자신이 만든 프로그램을 이용해 접근하는 것을 막아줌)
  cookie: { maxAge: 12000000, httpOnly: true },
  //rolling: 로그인 상태에서 다른페이지로 이동할 때마다, 세션 값에 변화를 줄건지 등등..
  rolling: false,
  store: store
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next){
  res.locals.moment = moment;
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
})

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
