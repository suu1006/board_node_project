var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User, Admin, MenuAuthority, UserAuthority, Menu } = require('../models');

// 메뉴 리스트를 필터링하는 함수
const getMenuListForUser = async (userType, userId) => {
    const menuList = await Menu.findAll();
    let menuListForUser = [];

    if (userType === 'user') {
        const findUserAuths = await UserAuthority.findAll({ where: { user_id: userId } });
        if (!findUserAuths.length) {
            throw new Error('No user authorities found.');
        }
        const authIds = findUserAuths.map(auth => auth.auth_id);
        const findMenuIds = await MenuAuthority.findAll({ where: { auth_id: authIds } });
        menuListForUser = findMenuIds.map(menu => menu.menu_id);

    } else if (userType === 'admin') {
        const findAdminAuths = await UserAuthority.findAll({ where: { admin_id: userId } });
        if (!findAdminAuths.length) {
            throw new Error('No admin authorities found.');
        }
        const authIds = findAdminAuths.map(auth => auth.auth_id);
        const findMenuIds = await MenuAuthority.findAll({ where: { auth_id: authIds } });
        menuListForUser = findMenuIds.map(menu => menu.menu_id);
    }

    // 전체 메뉴 리스트에서 필터링
    return menuList.filter(menu => menuListForUser.includes(menu.seq));
};

// 로그인
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: true
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email } });
            const admin = await Admin.findOne({ where: { email } });

            let foundUser = user || admin;
            if (!foundUser) {
                return done(null, false, { message: '존재하지 않는 계정입니다.' });
            }
            foundUser.type = user ? 'user' : 'admin';
            // 메뉴 리스트 필터링
            foundUser.menuList = await getMenuListForUser(foundUser.type, foundUser.seq);

            // 비밀번호 비교
            const isMatch = await bcrypt.compare(password, foundUser.password);

            if (!isMatch) {
                return done(null, false, { message: '잘못된 비밀번호입니다.' });
            }

            //console.log('사용자 정보 foundUser >>> ', foundUser.menuList);

            // 로그인 성공 시 사용자 정보 반환
            return done(null, foundUser);

        } catch (err) {
            return done(err);
        }
    }
));

// 직렬화 - 사용자 세션에 이메일 저장
passport.serializeUser(function (user, done) {
    done(null, { email: user.email, seq: user.seq });
});

// 역직렬화 - 이메일로 사용자 정보 조회
passport.deserializeUser(async (user, done) => {
    try {
        // 사용자 조회
        let foundUser = await User.findOne({ where: { email: user.email } });

        if (!foundUser) {
            // 관리자 조회
            foundUser = await Admin.findOne({ where: { email: user.email } });
            if (foundUser) {
                foundUser.type = 'admin';
                foundUser.menuList = await getMenuListForUser('admin', foundUser.seq);
            }
        } else {
            // 사용자 조회
            foundUser.type = 'user';
            foundUser.menuList = await getMenuListForUser('user', foundUser.seq);
        }
        // 사용자 정보 반환
        done(null, foundUser);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
