'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');
const Authority = require('./authority.js');
const Menu = require('./a_menu.js');

module.exports = (sequelize, DataTypes) => {
    const MenuAuthority = sequelize.define('MenuAuthority', {
        seq : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            comment : '시퀀스'
        },
        menu_id: { 
            type: DataTypes.INTEGER,
            allowNull: false,         
            comment : '메뉴ID'
        },
        auth_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment : '권한ID'
        },
        writer : {
            type: DataTypes.INTEGER, 
            allowNull: false,
            comment : '작성자'
        },
        reg_date : {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment : '등록일자'
        },
        updater : {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment : '수정자'
        },
        update_date : {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            comment : '수정일자'
        },
    }, {
        tableName: 'menu_authority', // 기존 테이블 이름
        underscored: true, // timestamp 컬럼명 그대로 사용
        timestamps: false,
    });

    // MenuAuthority.associate = models => {
    //     MenuAuthority.belongsTo(models.Authority, {
    //         foreignKey: 'auth_id',
    //         onDelete: 'CASCADE'
    //     });
    //     MenuAuthority.belongsTo(models.Menu, {
    //         foreignKey: 'menu_id',
    //         onDelete: 'CASCADE'
    //     });
    // };
    return MenuAuthority;
};