'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

module.exports = (sequelize, DataTypes) => {
  const ReadPost = sequelize.define('ReadPost', {
    seq : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '시퀀스'
    },
    user_seq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '유저ID'
    },
    board_seq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '게시글ID'
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
    update_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      comment: '수정일자'
  },
  }, {
    tableName: 'read_post', // 기존 테이블 이름
    underscored: false, // timestamp 컬럼명 그대로 사용
    timestamps: false,
  });

  return ReadPost;
};