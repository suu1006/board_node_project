const express = require('express');
const router = express.Router();
const boardController = require('../../api/controller/board.controller');

// 사이드 바 > 홈 렌더링
router.get('/', isAuthenticated, boardController.getAllBoards);

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/loginPage'); // 로그인 페이지로 리다이렉트
}

module.exports = router;