'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

module.exports = (sequelize, DataTypes) => {
const Admin = sequelize.define('Admin', {
    seq: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: '시퀀스'
    },
    email: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
        unique: true,
        comment: '이메일'
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '비밀번호'
    },
    name: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '이름'
    },
    birth: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '생년월일'
    }, 
    phone_number: {
        type: DataTypes.STRING(11),
        allowNull: false,
        comment: '핸드폰번호'
    },
    nickname: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '닉네임'
    },
    writer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '작성자'
    },
    reg_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('now()'),
        comment: '등록일자'
    },
    updater: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '수정자'
    },
    update_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('now()'),
        comment: '수정일자'
    }
}, {
    tableName: 'admin', // 기존 테이블 이름
    underscored: true, // snake_case 컬럼명 사용
    timestamps: false,
});
    return Admin;
};
