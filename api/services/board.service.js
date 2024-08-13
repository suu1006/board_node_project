const { DATE } = require('sequelize');
const { Board } = require('../../models'); // index 초기화파일 
const { Comment } = require('../../models');
const dayjs = require('dayjs');

// 현재 datetime 얻는 함수
function getCurrentDateTime() {
    const now = dayjs().add(9, "hour").toDate();
    return now;
}

exports.getHelloWorld = async () => {
    return 'Hello World!';
}

exports.getAllBoards = async (req, res) => {
    try {
        const boards = await Board.findAll();
        if(!boards || boards.length === 0) {
            return 0;
        }
        return boards;
    } catch(error) {
        throw error;
    }
}

exports.createBoard = async (bodyData) => {
    try {
        console.log('bodyData >> ', bodyData);
        // 7일을 더함
        const is_new = dayjs().add(7, 'day').toDate();
        const newBoard = await Board.create({
            title: bodyData.title,
            content: bodyData.content,
            writer: bodyData.writer,
            updater: bodyData.writer,
            is_new : is_new, // 새 글 기간
            reg_date: getCurrentDateTime(),
            update_date: getCurrentDateTime()
        });
        return newBoard;
    } catch(error) {
        console.error('게시물 생성 실패:', error);
        
    }
}

exports.getBoard = async (id) => {
    try {
        const board = await Board.findOne({
            where: {
                seq: id
            }
        });
        return board;
    } catch(error) {
        throw error;
    }
}

exports.updateBoard = async (id, bodyData) => {
    console.log('id >> ', id)
    console.log('bodydata>> ', bodyData)
    try {
        const board = await Board.update(
            {
                title: bodyData.updateTitle,
                content: bodyData.updateContent,
                updater : bodyData.updater,
                update_date : bodyData.update_date
            },
            {
                where: {
                    seq: id
                }
            }
        );
        console.log('서비스 안에서 >> ', board)
        return board;
    } catch(error) {
        throw error;
    }
}

exports.deleteBoard = async (id) => {
    try {
        const board = await Board.destroy({
            where: {
                seq: id
            }
        });
        return board;
    } catch(error) {
        throw error;
    }
}

// 댓글 생성
exports.createComment = async (bodyData) => {
    try {
        console.log('댓글 생성 bodyData >> ', bodyData);

        let formattedDate = getCurrentDateTime();
        const newComment = await Comment.create({
            comment_seq : 0, // 댓글 번호 ( 0: 댓글, 1: 대댓글 )
            content: bodyData.commentContent, // 내용
            board_seq: bodyData.boardSeq, // 게시글 번호
            writer: bodyData.userSession, // 작성자
            updater: bodyData.userSession,
            reg_date: formattedDate,
            update_date: formattedDate
        });
        return newComment; 
    } catch (error) {
        console.error('댓글 생성 오류:', error);
        throw error; 
    }
}

// 댓글 조회
exports.getCommentList = async (boardSeq) => {
    try {
        const comment = await Comment.findAll({
            where: {
                board_seq: boardSeq
            }
        });
        //console.log('comment 조회 >> ', comment);
        return comment;
    } catch(error) {
        throw error;
    }
}

// 대댓글 생성
exports.createRecomment = async (bodyData) => {
    try {
        let formattedDate = getCurrentDateTime();
        const newRecomment = await Comment.create({
            comment_seq: bodyData.parentCommentSeq, // 대댓글 번호 ( 0: 댓글, 댓글번호 : 대댓글 )
            content: bodyData.recommentContent, // 내용
            board_seq: bodyData.boardSeq, // 게시글번호
            writer: bodyData.userSession,
            updater: bodyData.userSession,
            update_date : formattedDate,
            reg_date: formattedDate
        });
        console.log('newRecomment >> ', newRecomment);
        return newRecomment;
    } catch(error) {
        throw error;
    }
}

// 댓글 수정
exports.updateComment = async (bodyData) => {
    try {
        let formattedDate = getCurrentDateTime();
        console.log('update comment formattedDate >> ', formattedDate);
        const comment = await Comment.update( // date 타입으로 캐스팅 하는거 찾아보기
            {
                content : bodyData.content,
                updater : bodyData.userSession,
                update_date: formattedDate             
            },
            {
                where: {
                    seq: bodyData.seq
                },
                //fields : ['content', 'updater', 'update_date'], // 업데이트할 필드명
            }
        );
        return comment;
    } catch(error) {
        throw error;
    }
}

// 댓글 삭제
exports.deleteComment = async (bodyData) => {
    try {        
        const comment = await Comment.destroy({
            where: {
                seq: bodyData.seq
            }
        });
        return comment;
    } catch(error) {
        throw error;
    }
}

// 대댓글 수정
exports.updateRecomment = async (bodyData) => {
    try {
        let formattedDate = getCurrentDateTime();
        const recomment = await Comment.update(
            {
                content : bodyData.content,
                updater : bodyData.userSession,
                update_date: formattedDate
            },
            {
                where: {
                    seq: bodyData.seq
                },
                fields : ['content', 'updater', 'update_date'], // 업데이트할 필드명
            }
        );
        console.log('recomment result  >> ', recomment);
        return recomment;
    } catch(error) {
        throw error;
    }
}

// 대댓글 삭제
exports.deleteRecomment = async (bodyData) => {
    try {        
        const recomment = await Comment.destroy({
            where: {
                seq: bodyData.seq
            }
        });
        return recomment;
    } catch(error) {
        throw error;
    }
}

