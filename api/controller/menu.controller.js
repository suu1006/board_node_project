
const service = require('../../api/services/menu.service');
const authController = require('./auth.controller');

// 모든 메뉴 리스트 조회
exports.getMenuList = async (req, res) => {
    try {
        const getMenuList = await service.getMenuList();
        const filterMenuList = getMenuList.map(item => item.dataValues);
        if (!filterMenuList || filterMenuList.length === 0) {
            return { message: 'No menu found' };
        }
        return filterMenuList;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '메뉴 조회 오류' });
    }
}

// 메뉴 생성 폼 페이지 렌더링
exports.createPage = async (req, res) => {
    try {
        res.render('menuCreateForm', {
            left_side : req.user.menuList,
            menuList : req.user.menuList,
            user: req.user || null,                
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '메뉴 생성 페이지 오류' });
    }
}

// 메뉴 생성
exports.create = async (req, res) => {
    try {
        const createMenu = await service.createMenu(req.body);
        if(createMenu.success) {
            res.redirect('/menus');
        } else {
            res.redirect('/menu/create');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '메뉴 생성 오류' });
    }
}

// 사이드바 - 메뉴 게시판 클릭 시 
exports.sideMenuList = async (req, res) => {
    console.log('req.user.menuList >> ', req.user.menuList)
    // 메뉴 전체 리스트 가져오기
    const getAllMenuList = await service.getMenuList();
    const menuList = req.user.menuList;
    console.log('req.user.menuList >> ', req.user.menuList)
    console.log('menuList >> ', menuList)
    res.render('menuList', {
        user: req.user || null, 
        getMenuList: getAllMenuList, // menuList 페이지 (전체 메뉴)
        menuList: menuList   // 왼쪽 사이드바 (유저에 맞는 메뉴)
    });
}

// 사이드바 - 권한 게시판
exports.sideAuthList = async(req, res) => {
    try {
        const sideAuthList = await service.sideAuthList(req, res);
        const menuList = req.user.menuList;
        if (sideAuthList) {
            res.render('authList', {
                user: req.user || null, 
                left_side: menuList,
                menuList: menuList,
                authList : sideAuthList.authList
            });
        } else {
            res.status(404).send('No menu found');
        }
    } catch (error) {
        console.error('Error in renderAuthListPage:', error);
        res.status(500).send('Server Error');
    }
}

exports.getAuth = async (req, res) => {
    try {
        const getAuth = await service.getAuth(req.params.id);
        if (!getAuth) {
            return { message: 'No auth found' };
        }
        return getAuth;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '권한 조회 오류' });
    }
}

// 메뉴 상세 조회
exports.getMenuPage = async (req, res) => {
    try {
        const menuResult = await service.getMenuPage(req);
        const menuList = req.user.menuList;
        if (menuResult && menuList) {
            res.render('menuDetail', {
                user: req.user || null,
                menu : menuResult,
                menuList : menuList,
            });
        } else {
            res.status(404).send('No menu found');
        }
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: '메뉴 조회 오류' });
    }
}

// 메뉴 수정
exports.updateMenu = async (req, res) => {
    try {
        const updateMenu = await service.updateMenu(req.body);
        if (updateMenu.success) {
            res.redirect('/menus');
        } else {
            res.redirect(`/menu/${req.params.id}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '메뉴 수정 오류' });
    }
}

// 메뉴 삭제
exports.deleteMenu = async (req, res) => {
    try {
        const deleteMenu = await service.deleteMenu(req.params.id);
        if (deleteMenu.success) {
            res.status(200).json({ok: true});
        } else {
            res.status(500).json({ error: '메뉴 삭제 오류' });  
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '메뉴 삭제 오류' });
    }
}



