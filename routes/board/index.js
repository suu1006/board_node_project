const router = require('express').Router();
const controller = require('../../api/controller/board.controller'); 

// 게시글 생성 페이지 렌더링
router.get('/createPage', isAuthenticated, controller.createBoardPage);

// 게시글 생성
router.post('/createBoard', isAuthenticated, controller.createBoard);

// 게시글 단건 조회
router.get('/:id', isAuthenticated, controller.getBoard);

// 게시글 수정
router.patch('/update/:id', controller.updateBoard);

// 게시글 삭제
router.delete('/delete/:id', controller.deleteBoard);

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/loginPage'); // 로그인 페이지로 리다이렉트
}

module.exports = router;