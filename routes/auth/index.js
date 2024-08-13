const router = require("express").Router();
const bodyParser = require('body-parser');
const controller = require('../../api/controller/auth.controller'); 
const session = require("express-session");
var passport = require('../../passport/localStrategy');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false}));
router.use(passport.initialize());
router.use(passport.session());

router.get('/loginPage', controller.loginPage); 
router.get('/signupPage', controller.signupPage);
router.post('/signup', controller.signup);

// 로그인 
router.post('/login', passport.authenticate('local'), controller.login);

// 유저 및 관리자 전체조회
router.get('/userAndAdminList', controller.userAndAdminList);

// 권한 생성 페이지 
router.get('/createPage', isAuthenticated, controller.createPage);

// 권한 생성
router.post('/create',isAuthenticated, controller.createAuth);

// 권한 상세 조회
router.get('/:id', isAuthenticated, controller.getAuthPage);

// 권한 수정
router.patch('/update/:id', isAuthenticated, controller.updateAuth);

// 권한 삭제
router.delete('/delete/:id', isAuthenticated, controller.deleteAuth);


// 로그아웃
router.post('/logout', controller.logout);

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/auth/loginPage'); // 로그인 페이지로 리다이렉트
}

module.exports = router;


