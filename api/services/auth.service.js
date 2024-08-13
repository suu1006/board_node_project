
const bcrypt = require('bcrypt');
const { Authority } = require('../../models');
const { User } = require('../../models');
const { Admin } = require('../../models');
const { UserAuthority } = require('../../models');
const { MenuAuthority } = require('../../models');
const { Menu } = require('../../models');

// 회원가입
exports.signup = async (req, res) => {
    try {
        const { email, password, name, birth, phone_number, nickname, writer, updater } = req.body;
        console.log('회원가입 data >> ', req.body)

        const saltRounds = 10;
        const hashed_password = bcrypt.hashSync(password, saltRounds);

        const user = await User.create({ 
            email : email,
            password: hashed_password,
            name : name,
            birth : birth,
            phone_number : phone_number,
            nickname : nickname,
            writer : writer, 
            updater : updater,
        });
        

        console.log('seq로 업데이트 전 회원가입 결과 >> ', user)
        if(user) {
            await User.update({
                writer: user.dataValues.seq,
                updater: user.dataValues.seq
            }, {
                where: { seq: user.dataValues.seq }
            })
        }
        return true;
    }  catch(error) {
        throw error;
    }
}

// 유저 이메일 조회
exports.findUserByEmail = async (email) => {
    try {
        const userFindResult = await User.findOne({ where: { email : email } });
        const adminFindResult = await Admin.findOne({ where: { email : email } });
        
        if (userFindResult) {
            return { ...userFindResult.dataValues, type: 'user' };
        } else if (adminFindResult) {
            return { ...adminFindResult.dataValues, type: 'admin' };
        } else {
            throw new Error(`이메일로 유저 찾기 실패.`);
        }
    } catch (error) {
        throw error;
    }
}

// 유저 조회
exports.findUser = async (seq) => {
    try {
        const user = await User.findOne({ where: { seq : seq } });
        if (!user) {
            throw new Error(`${seq} 번 유저 찾기 실패.`);
        }
        return user;
    } catch (error) {
        throw error;
    }
}


// 전체 권한 조회
exports.getAuthList = async (seq) => {
    try {
        const authority = await Authority.findAll();
        if (!authority) {
            throw new Error(`권한 조회 실패.`);
        }
        return authority;
    } catch (error) {
        throw error;
    }
}

// 전체 유저 조회
exports.getUserList = async () => {
    try {
        const user = await User.findAll();
        if (!user) {
            throw new Error(`유저 조회 실패.`);
        }
        return user;
    } catch (error) {
        throw error;
    }
}

// 권한 생성
exports.createAuth = async (req) => {
    try {
        const userSession = req.user ? req.user.dataValues.seq : null;
        console.log('service 안에서 세션값 >> ', userSession);
        const { name, description, type, menu } = req.body;
        let selectedUsers = [];

        if (type === 'user') {
            selectedUsers = req.body.selectedUsers;
        } else if (type === 'admin') {
            selectedUsers = req.body.selectedAdmins;
        }

        if (req.body.selectedUser === 'undifined' || req.body.selectedAdmins === 'undifined') {
            selectedUsers = [];
        }

        // 권한 테이블 저장
        const auth = await Authority.create({ 
            name: name, 
            description: description, 
            type: type,
            writer: userSession, 
            updater: userSession, 
        });

        if (!auth) {
            throw new Error('권한 생성 실패.');
        }

        // 메뉴 - 권한 테이블 저장
        if (Array.isArray(menu)) {
            for (const menuId of menu) {
                await MenuAuthority.create({
                    menu_id: menuId,
                    auth_id: auth.dataValues.seq,
                    writer: userSession,
                    updater: userSession,
                });
            }
        } else {
            await MenuAuthority.create({
                menu_id: menu,
                auth_id: auth.dataValues.seq,
                writer: userSession,
                updater: userSession,
            });
        }
    
        // 회원 - 권한 매핑 테이블 저장
        for (const userId of selectedUsers || []) {
            console.log('selectedUsers >> ', selectedUsers);
            console.log('userId >> ', userId)

            if (selectedUsers.length === 0) {
                userId = 0;
            }

            if (type === 'user') {
                await UserAuthority.create({
                    auth_id: auth.dataValues.seq,
                    user_id: userId,
                    admin_id: 0,
                    writer: userSession,
                    updater: userSession,
                });
            } else if (type === 'admin') {
                await UserAuthority.create({
                    auth_id: auth.dataValues.seq,
                    user_id: 0,
                    admin_id: userId,
                    writer: userSession,
                    updater: userSession,
                });
            }
        }

        return { success: true, data: auth };

    } catch (error) {
        console.error('권한 생성 오류:', error);
        return { success: false, message: error.message };
    }
};


// 전체 관리자 조회
exports.getAdminList = async () => {
    try {
        const adminList = await Admin.findAll();
        if (!adminList) {
            throw new Error(`관리자 조회 실패.`);
        }
        return adminList;
    } catch (error) {
        throw error;
    }
}

// 권한 단건 조회
exports.getAuth = async (seq) => { // seq : 45
    try {
        console.log('seq >> ', seq);
        // 1. 권한 테이블 조회
        const auth = await Authority.findOne({ where: { seq: seq } });
        if (!auth) {
            throw new Error(`${seq} 번 권한 찾기 실패.`);
        }

        const authName = auth.dataValues.name; // 권한명
        const authDescription = auth.dataValues.description; // 권한설명

        // 2. 메뉴 - 권한 테이블 조회
        const menuAuthResults = await MenuAuthority.findAll({ where: { auth_id: seq } });
        const menuIds = menuAuthResults.map(result => result.dataValues.menu_id);

        // 2-1. 메뉴명 조회
        const menuNames = await Menu.findAll({ where: { seq: menuIds } });
        const menuNamesList = menuNames.map(menu => ({
            seq: menu.dataValues.seq,
            name: menu.dataValues.name
        }));

        console.log('menuNamesList >> ', menuNamesList);

        // 3. 회원 - 권한 테이블 조회
        const userAuthResults = await UserAuthority.findAll({ where: { auth_id: seq } });
        const userIds = userAuthResults.map(result => result.dataValues.user_id);
        const adminIds = userAuthResults.map(result => result.dataValues.admin_id);
        const userResult = await User.findAll({ where: { seq : userIds }});
        const adminResult = await Admin.findAll({ where: { seq : adminIds }});
        
        let extractedData;

        if (userIds[0] === 0) {
            extractedData = {
                type: 'admin',
                data: adminResult.map(admin => ({
                    seq: admin.dataValues.seq,
                    email: admin.dataValues.email,
                    name: admin.dataValues.name
                }))
            };
        } else {
            extractedData = {
                type: 'user',
                data: userResult.map(user => ({
                    seq: user.dataValues.seq,
                    email: user.dataValues.email,
                    name: user.dataValues.name
                }))
            };
        }

        // 전체 메뉴 조회
        const menuList = await Menu.findAll(); // 모든 메뉴 조회

        if (userIds[0] !== 0) {
            console.log('1111111111') 
            const menuListForUser = menuList.filter(menu => menuIds.includes(menu.dataValues.seq));
            return {
                authName, // 권한명
                authDescription, // 권한 설명
                selectedMenus: menuNamesList, // 유저 부여메뉴리스트
                allMenuList: menuList, // 전체 메뉴 리스트
                leftMenuList: menuList, // left 메뉴 리스트
                extractedData : extractedData // 접근대상 리스트(유저)
            };
        } else if (adminIds[0] !== 0) { 
            console.log('22222222') 
            return {
                authName, // 권한명
                authDescription, // 권한 설명
                selectedMenus: menuNamesList, // 관리자 부여메뉴리스트
                allMenuList: menuList, // 전체 메뉴 리스트
                leftMenuList: menuList, // left 메뉴 리스트
                extractedData : extractedData // 접근대상 리스트(관리자)
            };
        } else {
            return {
                authName, // 권한명
                authDescription, // 권한 설명
                selectedMenus: [], // 관리자 부여메뉴리스트
                allMenuList: [], // 전체 메뉴 리스트
                leftMenuList: [], // left 메뉴 리스트
                extractedData : []
            };
        }
    } catch (error) {
        console.error('Error in getAuth:', error);
        throw error;
    }
}

exports.authCreatePage = async(req) => {
    try {
        if (!req.user) {
            // req.user가 없으면 빈 배열 반환
            return { filteredMenuData: [], authList: [] };
        }

        let filteredMenuData = [];
        let menuListForUser = [];
        const menuList = await Menu.findAll();

        // 유저 이메일 조회
        const userEmail = req.user.dataValues.email;
        let result;
        const userFindResult = await User.findOne({ where: { email: userEmail } });
        const adminFindResult = await Admin.findOne({ where: { email: userEmail } });
        if (userFindResult) {
            result = { ...userFindResult.dataValues, type: 'user' };
        } else if (adminFindResult) {
            result = { ...adminFindResult.dataValues, type: 'admin' };
        } else {
            throw new Error(`이메일로 유저 찾기 실패.`);
        }

        if (result.type === 'user') {
            menuListForUser = await MenuAuthority.findAll({
                where: { auth_id: menuListForUser }
            });
            filteredMenuData = menuList.filter(menu => menuListForUser.map(m => m.seq).includes(menu.seq));
        } else if (result.type === 'admin') {
            filteredMenuData = menuList;
        } else {
            filteredMenuData = [];
        }

        return filteredMenuData;
    } catch (error) {
        console.error('Error in authCreatePage:', error);
        throw error; // 에러를 컨트롤러로 던짐
    }
}

// 권한 수정
exports.updateAuth = async (req, res) => {
    const userSession = req.user ? req.user.dataValues.seq : null;
    console.log('service 안에서 세션값 >> ', userSession);
    
    const { name, description, checkedUser, selectedMenus, type, roleId } = req.body;
    
    try {
        console.log('type ???? ', typeof selectedMenus )
        // 권한 테이블 저장
        const auth = await Authority.update({
            name: name,
            description: description,
            type: type,
            updater: userSession,
        }, { where: {
                seq: roleId  
            }
        });

        if (!auth) {
            throw new Error('권한 생성 실패.');
        }

         // 메뉴 - 권한 테이블 저장
        if (roleId) {
            await MenuAuthority.destroy({
                where: {
                    auth_id: roleId
                }
            });
        }
        for (const menuId of selectedMenus) {
            console.log('menuId >>> ', menuId)
                await MenuAuthority.create({
                    menu_id: menuId,
                    auth_id: roleId,
                    writer: userSession,
                    updater: userSession,
                }, {
                    where: { auth_id: roleId }
                });
        }

        // 회원 - 권한 매핑 테이블 저장
        if (roleId) {
            await UserAuthority.destroy({
                where: {
                    auth_id: roleId
                }
            });
        }
        for (const userId of checkedUser) {
            if (type === 'user') {
                await UserAuthority.create({
                    auth_id: roleId,
                    user_id: userId || 0,
                    admin_id: 0,
                    writer: userSession,
                    updater: userSession,
                });
            } else if (type === 'admin') {
                await UserAuthority.create({
                    auth_id: roleId,
                    user_id: 0,
                    admin_id: userId || 0,
                    writer: userSession,
                    updater: userSession,
                });
            }
        }
        // 응답 반환
        res.json({ success: true, data: auth });
    } catch (error) {
        console.error('권한 생성 오류:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 권한 삭제
exports.deleteAuth = async (id) => {
    try {
        const auth = await Authority.destroy({
            where: {
                seq: id
            }
        });
        return auth;
    } catch (error) {
        throw error;
    }
}












