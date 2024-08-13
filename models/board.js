'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
    seq : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '시퀀스'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '제목'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '내용'
    },
    is_new : {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '새 글 기간'
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
    tableName: 'board', // 기존 테이블 이름
    underscored: false, // timestamp 컬럼명 그대로 사용
    timestamps: false,
  });

  // Board.associate = models => {
  //   Board.belongsTo(models.Menu, {
  //     foreignKey: 'menu_id',
  //     onDelete: 'CASCADE'
  //   });
  // }
  return Board;
}