'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

module.exports = (sequelize, DataTypes) => {
    const UserPoster = sequelize.define('UserPoster', {
        seq : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            comment : '시퀀스'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment : '유저ID'
        },
        poster_id: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            comment : '구독자ID'
        },
        writer : {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment : '등록자'
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
        tableName: 'user_poster', // 기존 테이블 이름
        underscored: true, // timestamp 컬럼명 그대로 사용
        timestamps: false,
    });

    return UserPoster;
};