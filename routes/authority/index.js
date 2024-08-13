const express = require('express');
const router = express.Router();
const menuController = require('../../api/controller/menu.controller');

// 권한리스트 렌더링
router.get('/', isAuthenticated, menuController.sideAuthList);

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;