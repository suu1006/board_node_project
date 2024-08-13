'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const { Comment } = require('./comment');
const {board} = require('./board');
const {ReadPost} = require('./readPost')
let sequelize;

// sequelize 인스턴스 생성
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 모델 초기화 및 설정
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// 모델 관계 설정
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//모든 모델을 동기화
// sequelize.sync({ alter : true })  // alter : 추가 , 수정 컬럼 변경 시, force : 강제 변경
//     .then(() => {
//         console.log("=================모델이 성공적으로 동기화되었습니다.===================");
//     })
//     .catch(error => {
//         console.error("모델 동기화 중 오류 발생:", error);
//     });

//특정 테이블 삭제 후 재생성 함수
// async function recreateCommentTable() {
//     try {
//         // 데이터베이스 연결
//         await db.sequelize.authenticate();
//         console.log('Connection has been established successfully.');

//         // 기존 테이블 삭제 (ORM 사용)
//         if (db.ReadPost) {
//             await db.ReadPost.drop(); // ORM을 통해 테이블 삭제
//             console.log('read_post table dropped.');
//         } else {
//             console.error('ReadPost model not found.');
//             return; // 모델이 없으면 함수 종료
//         }

//         // 테이블 재생성
//         await db.ReadPost.sync({ force: true }); // force: true로 테이블 재생성
//         console.log('===========read_post 테이블 재생성 완료===========');
//     } catch (error) {
//         console.error('Unable to connect to the database or process query:', error);
//     } finally {
//         await db.sequelize.close();
//     }
// }

// recreateCommentTable();

// 테이블 목록 확인
// async function listTables() {
//     try {
//         await db.sequelize.authenticate();
//         console.log('Connection has been established successfully.');

//         // MySQL 데이터베이스에서 테이블 목록을 조회하는 쿼리
//         const [tables] = await db.sequelize.query("SHOW TABLES");
//         console.log('Tables:', tables);
//     } catch (error) {
//         console.error('Unable to connect to the database or fetch tables:', error);
//     } finally {
//         await db.sequelize.close();
//     }
// }

// listTables();


module.exports = db;
