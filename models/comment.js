'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    seq : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false, // not null
      autoIncrement: true,
      comment: '시퀀스'
    },
    board_seq : {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '게시글번호'
    },
    comment_seq : {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '댓글번호'
    },
    content : {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '내용'
    },
    comment_seq : {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '댓글 번호'
    },
    writer : {
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
    },
  }, {
    tableName: 'comment', // 기존 테이블 이름
    underscored: false, // timestamp 컬럼명 그대로 사용
    timestamps: false,
  });

  return Comment;
}