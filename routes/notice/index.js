const express = require('express');
const router = express.Router();
const menuController = require('../../api/controller/menu.controller');

// 공지사항 렌더링
// router.get('/', menuController.sideNoticePage);

// // 공지사항 생성 페이지 렌더링
// router.get('/createPage', menuController.createNoticePage);

// // 공지사항 생성
// router.post('/create', menuController.createNotice);

module.exports = router;