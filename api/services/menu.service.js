const e = require('express');
const { Menu } = require('../../models');
const { MenuAuthority } = require('../../models');
const { UserAuthority } = require('../../models');
const { User } = require('../../models');
const { Admin } = require('../../models');
const {Authority} = require('../../models');
const { sequelize } = require('../../models');
const { QueryTypes } = require('sequelize');

exports.getMenuList = async (req, res) => {
    try {
        const menuList = await Menu.findAll();
        if (!menuList || menuList.length === 0) {
            return { message: 'No menu found' };
        }
        return menuList;
    } catch(error) {
        throw error;
    }
}

// 메뉴 생성
exports.createMenu = async (bodyData) => {
    try {
        console.log('servive menu >>>> ', bodyData)
        const { menuName, menuDescription, writer, updater, link } = bodyData;
        const menu = await Menu.create({ // 메뉴 생성
            name: menuName,
            description: menuDescription,
            link : '/' + link,
            writer: writer,
            updater: updater 
        });
        if (menu) {
            MenuAuthority.create({
                menu_id: menu.dataValues.seq,
                auth_id: writer,
                writer : writer,
                updater : updater
            });
            return { success: true, menu: menu.dataValues };
        } else {
            return { success: false, message: '메뉴 생성 실패' };
        }
    } catch (error) {
        console.error(error);
    } 
};

exports.getMenuAuthList = async (req, res) => {
    try {
        const menuAuthList = await MenuAuthority.findAll();
        if (!menuAuthList || menuAuthList.length === 0) {
            return { message: 'No menu found' };
        }
        return menuAuthList;
    } catch (error) {
        throw error;
    }
}

exports.findMenuList = async (type) => {
    try {
        if (type === 'admin') {
            // 관리자가 접근 가능한 auth_id 추출
            const findAdminAuths = await UserAuthority.findAll({ where: { admin_id: '1' } });
            if (!findAdminAuths || findAdminAuths.length === 0) {
                throw new Error('No admin authorities found.');
            }
            const authIds = findAdminAuths.map(auth => auth.auth_id);
            console.log('관리자가 접근 가능한 auth_id 추출 >> ', authIds);

            // 메뉴 추출
            const findMenuIds = await MenuAuthority.findAll({ where: { auth_id: authIds } });
            const menuSeqs = findMenuIds.map(menu => menu.dataValues.menu_id);
            console.log('관리자가 접근 가능한 메뉴 seq >> ', menuSeqs);

            return menuSeqs;

        } else if (type === 'user') {
            const findUserAuths = await UserAuthority.findAll({ 
                where: { user_id: '1' } 
            });

            if (!findUserAuths || findUserAuths.length === 0) {
                throw new Error('No user authorities found.');
            }

            const authIds = findUserAuths.map(auth => auth.auth_id);

            const findMenuIds = await MenuAuthority.findAll({
                where: { auth_id: authIds }
            });

            const menuSeqs = findMenuIds.map(menu => menu.dataValues.menu_id);

            console.log(menuSeqs, 'menuSeqs');

            return menuSeqs;

        } else {
            throw new Error('Invalid type.');
        }
    } catch (error) {
        throw error;
    }
}

// 사이드바 - 메뉴 게시판 클릭 시
exports.sideMenuList = async (req, res) => {
    // 유저 이메일 조회
    const userEmail = req.user.dataValues.email;
    let userSeq;
    const userFindResult = await User.findOne({ where: { email : userEmail } });
    const adminFindResult = await Admin.findOne({ where: { email : userEmail } });
    if (userFindResult) { // 유저일때
        // 유저 seq 추출
        userSeq = userFindResult.dataValues.seq; // 1
        // 유저 권한 조회
        const findUserAuth = await UserAuthority.findOne({ where: { user_id: userSeq } });
        const authId = findUserAuth.dataValues.auth_id; // 48
        console.log('유저 권한 조회 >> ', authId);

        // 메뉴 추출
        const filteredMenuData = await sequelize.query(
            `SELECT 
                m.*
            FROM 
                menu m
            JOIN 
                menu_authority ma ON m.seq = ma.menu_id
            WHERE 
                ma.auth_id IN (:seqValues)`,
            {
                replacements: { seqValues: authId },  
                type: QueryTypes.SELECT,
            }
        );
        console.log('유저가 메뉴 게시판 클릭 시 >> ', filteredMenuData);
        return filteredMenuData;
    } else if (adminFindResult) { // 관리자일때
        // 전체 메뉴 리스트 조회
        const menuList = await Menu.findAll();
        console.log('관리자가 메뉴 게시판 클릭 시 >> ', menuList.map(menu => menu.dataValues));
        const filteredMenuData = menuList;
        return filteredMenuData;
    } else {
        throw new Error(`이메일로 유저 찾기 실패.`);
    }
}

// 사이드바 - 권한 게시판 클릭 시
exports.sideAuthList = async (req, res) => {
    let menuListForUser = [];
    let filteredMenuData = [];
    const authList = await Authority.findAll();
    const menuList = await Menu.findAll();

    // 유저 이메일 조회
    const userEmail = req.user.dataValues.email;
    let result;
    const userFindResult = await User.findOne({ where: { email : userEmail } });
    const adminFindResult = await Admin.findOne({ where: { email : userEmail } });
    if (userFindResult) {
        result =  { ...userFindResult.dataValues, type: 'user' };
    } else if (adminFindResult) {
        result =  { ...adminFindResult.dataValues, type: 'admin' };
    } else {
        throw new Error(`이메일로 유저 찾기 실패.`);
    }

    if (result.type == 'user') {
        menuListForUser = await MenuAuthority.findAll({
            where: { auth_id: menuListForUser }
        });
        filteredMenuData = menuList.filter(menu => menuListForUser.map(m => m.seq).includes(menu.seq));
    } else if (result.type == 'admin') {
        filteredMenuData = menuList;
    } else {
        filteredMenuData = [];
    }
    return {
        filteredMenuData: filteredMenuData.map(menu => menu.dataValues),
        authList: authList.map(auth => auth.dataValues)
    };
}

// 메뉴 상세 조회
exports.getMenuPage = async (req) => {
    try {
        const menuId = req.params.id;
        const menu = await Menu.findOne({ where: { seq: menuId } });
        const menuResult = menu ? menu.dataValues : null;
        return menuResult;
    } catch (error) {
        throw error;
    }    
}

// 메뉴 수정
exports.updateMenu = async (bodyData) => {
    try {
        const { seq, menuName, menuDescription, updater, link } = bodyData;
        console.log('seq >>> ', seq);
        const menu = await Menu.update({
            name: menuName,
            description: menuDescription,
            link : '/' + link,
            updater: updater
        }, { where: { seq: seq } });
        if (menu) {
            return { success: true, menu: menu.dataValues };
        } else {
            return { success: false, message: '메뉴 수정 실패' };
        }
    } catch (error) {
        console.error(error);
    }
}

// 메뉴 삭제
exports.deleteMenu = async (menuId) => {
    try {
        const menu = await Menu.destroy({ where: { seq: menuId } });
        if (menu) {
            return { success: true, message: '메뉴 삭제 성공' };
        } else {
            return { success: false, message: '메뉴 삭제 실패' };
        }
    } catch (error) {
        console.error(error);
    }
}
