const router = require('express').Router();
const controller = require('../../api/controller/board.controller'); 

// 대댓글 생성
router.post('/create', controller.createRecomment);

// 대댓글 수정
router.patch('/update/:id', controller.updateRecomment);

// 대댓글 삭제
router.delete('/delete/:id', controller.deleteRecomment);

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/loginPage'); // 로그인 페이지로 리다이렉트
}

module.exports = router;