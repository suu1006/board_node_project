
const service = require('../../api/services/auth.service');
const boardService = require('../services/board.service');
const authService = require('../services/auth.service');
const menuController = require('../controller/menu.controller');

// 로그인 페이지 렌더링
exports.loginPage = async(req, res) => {
    try {
        res.render('login', { layout: 'login' } ); // layout 없이 단독 렌더링
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '로그인 페이지 오류'})
    }
}

// 로그인
exports.login = async(req, res) => {
    try {
        const boardList = await boardService.getAllBoards();
        res.render('index', {
            user: req.user || null, 
            boards: boardList, 
            menuList: req.user.menuList
        });
    } catch (error) {
        console.error('로그인 처리 중 오류:', error);
        res.status(500).send('서버 오류');
    }
}

// 회원가입 페이지 렌더링
exports.signupPage = async(req, res) => {
    try {
        res.render('signup', { layout: 'signup' } );
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '회원가입 페이지 오류'})
    }
} 

// 회원가입
exports.signup = async(req, res) => {
    try {
        const createUser = await service.signup(req, res);
        if(createUser) {
            return res.redirect('/auth/loginPage');
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '회원가입 오류'})
    }
}

// 로그아웃
exports.logout = async (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                return next(err); 
            }
            req.session.destroy((err) => {
                if (err) {
                    return next(err); 
                }
                res.clearCookie('connect.sid');
                res.redirect('/auth/loginPage'); 
            });
        });
    } catch (err) {
        next(err); 
    }
};

// 회원가입
exports.adminSignup = async(req, res) => {
    try {
        const createAdmin = await service.signup(req, res);
        if(createAdmin) {
            return res.redirect('/auth/loginPage');
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '관리자 회원가입 오류'})
    }
}

// 전체 권한 조회
exports.getAuthList = async(req, res) => {
    try {
        const authList = await service.getAuthList(req, res);
        return authList;
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '권한 데이터 오류'})
    }
}

// 전체 유저 조회
exports.getUserList = async(req, res) => {
    try {
        const userList = await service.getUserList(req, res);
        return userList;
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '유저 데이터 오류'})
    }
}

// 권한 생성
exports.createAuth = async(req, res) => {
    try {
        console.log(req.body, '권한생성 바디값');
        const createAuth = await service.createAuth(req, res);
        if(createAuth) {
            return res.redirect('/authority');
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '권한 생성 오류'})
    }
}

// 유저 + 관리자 리스트 전체 조회
exports.userAndAdminList = async(req, res) => {
    try {
        const userList = await service.getUserList(req, res);
        const adminList = await service.getAdminList(req, res);
        return res.json({ userList, adminList });
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '유저 및 관리자 리스트 오류'})
    }
}

// 유저 이메일 조회
exports.findUserByEmail = async(req, res) => {
    try {
        const user = await service.findUserByEmail(req, res);
        return user;
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '이메일로 유저 찾기 오류'})
    }
}

// 권한 상세 조회
exports.getAuthPage = async (req, res) => {
    try {
        const seq = req.params.id; 
        if (!seq) {
            throw new Error('권한 ID가 제공되지 않았습니다.');
        }
        const authData = await service.getAuth(seq);
        res.render('authDetail', {
            user: req.user || null, 
            seq : seq,
            type : authData.extractedData.type,
            left_side : authData.leftMenuList, // 사이드바(전체 메뉴)
            authName: authData.authName, // 권한명
            authDescription: authData.authDescription, // 권한설명
            selectedMenu : authData.selectedMenus, // 권한 부여 메뉴
            menuList: authData.leftMenuList, // 전체 메뉴
            extractedData : authData.extractedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '권한 조회 오류' });
    }
}

// 권한 생성 페이지
exports.createPage = async (req, res) => {
    try {
        const menuList = req.user.menuList;
        res.render('createAuthForm', {
            user: req.user || null,
            menuList: menuList
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '권한 생성 페이지 오류' });
    }
}

// 권한 수정
exports.updateAuth = async (req, res) => {
    try {
        console.log('권한 수정 req >> ', req.body);
        const updateAuth = await service.updateAuth(req, res);
        if(updateAuth) {
            return res.redirect('/authority');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '권한 수정 오류' });
    }
}

// 권한 삭제
exports.deleteAuth = async (req, res) => {
    try {
        console.log('권한 삭제 req >> ', req.params.id);
        const deleteAuth = await service.deleteAuth(req.params.id);
        if(deleteAuth) {
            return res.redirect('/authority');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '권한 삭제 오류' });
    }
}









