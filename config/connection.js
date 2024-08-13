const { Sequelize } = require('sequelize');

// 데이터베이스 정보
const databaseName = 'ojt';
const username = 'root';
const password = 'jeongsu97!';
const host = 'localhost'; 
const dialect = 'mysql'; 

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(databaseName, username, password, {
  host: host,
  dialect: dialect,
  logging: false, // 콘솔에 SQL 쿼리 로그 출력하지 않음 (원하는 경우 true로 설정)
  timezone: '+00:00' // 한국 시간 적용으로 변경
});

// 데이터베이스 연결 테스트
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
