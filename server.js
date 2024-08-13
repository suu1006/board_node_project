const express = require('express'); 
const path = require('path');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
var logger = require('morgan');
const passport = require("passport");
const session = require("express-session");
const ejsLayouts = require('express-ejs-layouts');

// 세션 설정
app.use(require("express-session")({
  secret: "This is the secret line",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// 뷰 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', 3000);

// 레이아웃 미들웨어 등록
app.use(ejsLayouts);
// 레이아웃 파일의 기본 경로 설정 (optional)
app.set('layout', 'layouts/layout');

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.get('/api/session', (req, res) => {
  res.json({
    writer: req.session.writer, 
    updater: req.session.updater 
  });
});

// 읽음 상태 세션에 저장
// app.post('/api/postRead', (req,res) => {
//   const { postId } = req.body;    
//     if (!req.session.readPost) {
//         req.session.readPost = [];
//     }
    
//     if (!req.session.readPost.includes(postId)) {
//         req.session.readPost.push(postId); // 세션에 읽음처리 저장
//     }
//     res.status(200).send({ message: '읽음 처리 완료' });

// })

// // 게시글 읽음 상태를 확인
// app.get('/api/readPosts', (req, res) => {
//   const readPosts = req.session.readPost || [];
//   res.json({ readPosts });
// });

// model 작성
app.listen(app.get('port'), () => {
  console.log('server is running on port', app.get('port'));
});