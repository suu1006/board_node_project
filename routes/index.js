const express = require('express');
const router = express.Router();
const boardRoutes = require('./board/index');
const authRoutes = require('./auth/index');
const authorityRoutes = require('./authority/index');
const menuRoutes = require('./menu/index');
const mainRoutes = require('./main');
const homeRoutes = require('./home/index');
const recommentRoutes = require('./recomment/index');
const commentRoutes = require('./comment/index');
const subscribeRoutes = require('./subscribe/index');

// 메인 페이지
router.use('/', mainRoutes);
router.use('/boards', boardRoutes);
router.use('/auth', authRoutes);
router.use('/comments', isAuthenticated, commentRoutes); // 댓글
router.use('/recomments', isAuthenticated, recommentRoutes); // 댓글

// 사이드바 
router.use('/menus', menuRoutes); // 메뉴게시판
router.use('/authority', authorityRoutes); // 권한게시판
router.use('/home', homeRoutes); // 사이드 바 > 홈
router.use('/subscribe', isAuthenticated, subscribeRoutes); // 구독 목록

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/loginPage'); // 로그인 페이지로 리다이렉트
}

module.exports = router;
