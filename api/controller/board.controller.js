const service = require('../../api/services/board.service');
const menuService = require('../../api/services/menu.service');
const authService = require('../../api/services/auth.service');
const { getMenuList } = require('./menu.controller');

// 메인 페이지 게시글 조회
exports.getAllBoards = async(req, res) => {
    try {
        const boardList = await service.getAllBoards();
        res.render('index', {
            user: req.user || null, 
            left_side: req.user.menuList,
            menuList : req.user.menuList,     
            boards : boardList 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '게시글 리스트 페이지 오류' });
    }
};

// 게시물 생성 페이지 렌더링
exports.createBoardPage = async(req, res) => {
    try {
        res.render('board/createForm', {
            user: req.user || null, 
            left_side: req.user.menuList,
            menuList : req.user.menuList,      
            
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '게시글 생성 페이지 오류'})
    }
}

// 게시물 생성
exports.createBoard = async(req, res) => {
    try {
        const createNewBoard = await service.createBoard(req.body);
        if(createNewBoard) {
            return res.redirect('/');
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '게시글 생성 오류'})
    }
};

// 게시글 조회
exports.getBoard = async(req, res) => {
    try {
        const boardList = await service.getBoard(req.params.id); 
        const boardData = boardList.dataValues;
        //console.log('메뉴리스트 >> ', req.user.menuList);
        const menuList = req.user.menuList;
        // 댓글 리스트 불러오기
        const commentList = await service.getCommentList(req.params.id);

        const filteredCommentList = [];
        const recommentMap = {};

        // 대댓글 분류
        for (const comment of commentList) {
            if (comment.dataValues.comment_seq === 0) { // 댓글
                filteredCommentList.push(comment);
            } else { // 대댓글
                const parentSeq = comment.dataValues.comment_seq;
                if (!recommentMap[parentSeq]) {
                    recommentMap[parentSeq] = [];
                }
                recommentMap[parentSeq].push(comment);
            }
        }

        res.render('board/boardDetail', {
            left_side : menuList,
            menuList : menuList,
            commentList : filteredCommentList,
            recommentMap : recommentMap,
            userType : req.user.type, // 유저 타입
            isUserTrue : boardData.writer === req.user.seq ? true : false, // 작성자가 자신인지 확인
            user: req.user || null,   
            boardData : boardData         
        });
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error : '게시글 찾기 오류'})
    }
}

// 게시글 수정
exports.updateBoard = async(req, res) => {
    try {
        console.log('update body >>' , req.body)
        const board = await service.updateBoard(req.params.id, req.body);
        console.log('게시물 update 결과 >> ', board)
        return res.status(200).json({ok: true});
    
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '게시글 수정 오류'})
    }
}

// 게시글 삭제
exports.deleteBoard = async(req, res) => {
    try {
        console.log('deleteBoard >>' , req.params.id)
        const board = await service.deleteBoard(req.params.id);
        if (board) {
            res.status(200).json({ok: true});
        }
        
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '게시글 삭제 오류'})
    }
}

// 댓글 생성
exports.createComment = async(req, res) => {
    try {
        const userSession = req.user.seq;
        req.body.userSession = userSession;
        const comment = await service.createComment(req.body);
        if (comment) {
            res.status(200).json({ok: true});
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '댓글 생성 오류'})
    }
}

// 대댓글 생성
exports.createRecomment = async(req, res) => {
    try {
        const userSession = req.user.seq;
        req.body.userSession = userSession;
        const comment = await service.createRecomment(req.body);
        if (comment) {
            res.status(200).json({ok: true});
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '대댓글 생성 오류'})
    }
}

// 댓글 수정
exports.updateComment = async(req, res) => {
    try {
        const userSession = req.user.seq;
        req.body.userSession = userSession;
        const comment = await service.updateComment(req.body);
        console.log('댓글 수정 결과 >> ', comment)
        if (comment) {
            res.status(200).json({ok: true});
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '댓글 수정 오류'})
    }
}

// 댓글 삭제
exports.deleteComment = async(req, res) => {
    try {
        console.log('댓글 삭제 >> ', req.body);
        const comment = await service.deleteComment(req.body);
        if (comment) {
            res.status(200).json({ok: true});
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '댓글 삭제 오류'})
    }
}

// 대댓글 수정
exports.updateRecomment = async(req, res) => {
    try {
        console.log('대댓글 수정 >> ', req.body);
        const userSession = req.user.seq;
        req.body.userSession = userSession;
        const comment = await service.updateRecomment(req.body);
        if (comment) {
            res.status(200).json({ok: true});
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '대댓글 수정 오류'})
    }
}

// 대댓글 삭제
exports.deleteRecomment = async(req, res) => {
    try {
        console.log('대댓글 삭제 >> ', req.body);
        const comment = await service.deleteRecomment(req.body);
        if (comment) {
            res.status(200).json({ok: true});
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '대댓글 삭제 오류'})
    }
}
