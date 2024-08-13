const router = require('express').Router();
const controller = require('../../api/controller/menu.controller');

// 메뉴 조회
router.get('/getMenuList', (req, res) => {
    controller.getMenuList(req, res);
});

// 메뉴 생성 페이지
router.get('/createPage',  isAuthenticated, (req, res) => {
    console.log('req.user seq >>>> ', req.user.dataValues.seq); // 사용자 세션값
    controller.createPage(req, res);
}); 

// 메뉴 생성
router.post('/create', isAuthenticated, (req, res) => {
    controller.create(req, res);
});

// 메뉴 상세 조회
router.get('/:id', isAuthenticated, (req, res) => {
    controller.getMenuPage(req, res);
});

// 메뉴 수정
router.post('/update/:id', isAuthenticated, (req, res) => {
    controller.updateMenu(req, res);
});

// 메뉴 삭제 
router.delete('/delete/:id', isAuthenticated, (req, res) => {
    controller.deleteMenu(req, res);
});

// 사이드바 - 메뉴 게시판 클릭 시 (관리자)
router.get('/', isAuthenticated, (req, res) => {
    controller.sideMenuList(req, res);
})

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/loginPage'); // 로그인 페이지로 리다이렉트
}

module.exports = router;

