'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Authority = require('./authority');

module.exports = (sequelize, DataTypes) => {
const Authority = sequelize.define('Authority', {
  seq : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '시퀀스',
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment : '권한이름'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment : '권한설명'
  },
  type : {
      type: DataTypes.STRING(100),
      allowNull: false,
    comment : '권한유형'
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
  tableName: 'authority', // 기존 테이블 이름
  underscored: false, // timestamp 컬럼명 그대로 사용
  timestamps: false,
});

  // Authority.associate = models => {
  //   Authority.hasMany(models.MenuAuthority, {
  //     foreignKey: {
  //       name: 'auth_id',
  //       allowNull: false
  //     },
  //     onDelete: 'CASCADE'
  //   });
  // };
return Authority;
};