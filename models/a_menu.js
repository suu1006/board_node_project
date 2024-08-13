'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');
const Authority = require('./authority.js');

module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define('Menu', {
        seq : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            comment : '시퀀스'
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false,
            comment: '이름'
        },        
        description : {
            type : DataTypes.STRING(100),
            allowNull: false,
            comment: '설명'
        },
        link : {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: '링크'
        },
        writer : {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '작성자'
        },
        reg_date : {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: '등록일자'
        },
        updater : {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '수정자'
        },
        update_date : {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            comment: '수정일자'
        },
    }, {
        tableName: 'menu', 
        underscored: false,
        timestamps: false,
    });

    // 관계 설정
    // Menu.associate = models => { 
    //     Menu.hasMany(models.MenuAuthority, {
    //         foreignKey: 'menu_id',
    //         onDelete: 'CASCADE'
    //     });
    //     Menu.hasMany(models.Board, { 
    //         foreignKey: 'menu_id',
    //         onDelete: 'CASCADE'
    //     });
    // }
    return Menu;
}
