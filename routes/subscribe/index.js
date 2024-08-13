const router = require('express').Router();
const controller = require('../../api/controller/subscribe.contorller');

// 구독 목록 조회
router.get('/all', isAuthenticated, (req, res) => {
    controller.getAllSubscribeList(req, res);
})

// Poster의 전체 게시물 조회
router.get('/poster/:id', isAuthenticated, (req, res) => {
    controller.getPosterList(req, res);
})

//poster의 게시글 조회
router.get('/poster/:id/post/:postId', isAuthenticated, (req, res) => {
    controller.getPosterPost(req, res);
})

// 내 게시글 목록 조회
router.get('/myPostList', isAuthenticated, (req, res) => {
    controller.getMyPostList(req, res);
})  

// 전체 포스팅 목록
router.get('/allUserPostList', isAuthenticated, (req, res) => {
    controller.getAllUserPostList(req, res);
})

// 팔로우 
router.post('/createFollow', isAuthenticated, (req, res) => {
    controller.createFollow(req, res);
})

// 팔로우 취소
router.delete('/deleteFollow/:id', isAuthenticated, (req, res) => {
    controller.deleteFollow(req, res);
})

// 게시물 읽음 처리
router.post('/readPost', isAuthenticated, (req, res) => {
    controller.readPost(req, res);
})

// 읽은 게시물 조회
router.get('/getReadPosts', isAuthenticated, (req, res) => {    
    controller.getReadPosts(req, res);
})

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/loginPage'); // 로그인 페이지로 리다이렉트
}

module.exports = router;
