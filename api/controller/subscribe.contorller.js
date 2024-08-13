const service = require('../../api/services/subscribe.service');

// 구독 전체 리스트 조회(유저)
exports.getAllSubscribeList = async (req, res) => {
    try {
        const subscribeListResult = await service.getAllSubscribeList(req, res);

        // 구독 목록
        const subscribeList = subscribeListResult.subscribeList;

        // 안읽은 게시물 작성자 리스트 
        const unreadWriterSeq = subscribeListResult.unreadWriterSeq;

        console.log('구독 목록 >> ', subscribeList)
        console.log('안읽은 게시물 작성자 리스트 >> ', unreadWriterSeq)

        res.render('subscribeList', {  
            menuList: req.user.menuList,
            unreadWriterSeq : unreadWriterSeq, // 새 글을 가진 작성자 리스트
            user: req.user || null,
            subscribeList : subscribeList
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '구독 리스트 오류'})
    }
}

// 내 게시글 목록 조회(유저)
exports.getMyPostList = async (req, res) => {
    try {
        const myPostList = await service.getMyPostList(req, res);
        console.log('내 게시글 목록 >> ', myPostList)
        res.render('myPostList', {
            menuList: req.user.menuList,
            user: req.user || null,
            myPostList : myPostList
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '내 게시글 목록 조회 오류'})
    }
}

// 전체 포스팅 목록(관리자)
exports.getAllUserPostList = async (req, res) => {
    try {
        const myPostList = await service.getAllUserPostList(req, res);
        console.log('전체 포스팅 목록 >> ', myPostList)
        res.render('allUserPostList', {
            menuList: req.user.menuList,
            user: req.user || null,
            myPostList : myPostList
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '내 게시글 목록 조회 오류'})
    }
}

// 팔로우 버튼 클릭 시
exports.createFollow = async(req, res) => {
    try {
        const userSession = req.user.seq;
        req.body.userSession = userSession;
        // 이미 팔로우 되어 있는지 확인
        const getFollower = await service.getFollower(req.body);
        console.log('이미 팔로우 되어 있는지 확인 >> ', getFollower)
        if (getFollower) {
            res.status(400).json({error : '이미 팔로우 되어 있습니다.'})
            return;
        }

        const subscribeList = await service.createFollow(req.body);
        if (subscribeList) {
            return res.status(200).json({ success: true, subscribeList: subscribeList });
        } 
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '팔로우 오류'})
    }
}

// Poster의 전체 게시물 조회
exports.getPosterList = async (req, res) => {
    const posterFindAllListResult = await service.getPosterList(req, res);
    // 게시글 목록
    const posterFindAllList = posterFindAllListResult.posterList;
    // 읽지않은 게시글 번호
    const unreadPostSeq = posterFindAllListResult.unreadPostSeq;
    console.log('111 unreadPostSeq >> ', unreadPostSeq)

    console.log('posterFindAllList >> ', posterFindAllList)
    if(posterFindAllList) {
        res.render('posterList', {
            posterId : req.params.id,
            menuList : req.user.menuList,
            user : req.user || null,
            postList : posterFindAllList,
            unreadPostSeq : unreadPostSeq
        })
    }
};

// poster의 게시글 상세조회
exports.getPosterPost = async (req, res) => {
    const userId = req.params.id; // 유저 번호
    const boardSeq = req.params.postId; // 게시글 번호
    console.log('userId >> ', userId)
    console.log('boardSeq >> ', boardSeq)
    const getPosterPost = await service.getPosterPost(req, res);

    // 게시글 정보 
    const boardList = getPosterPost.posterPost;
    // 댓글
    const filteredCommentList = getPosterPost.filteredCommentList || [];
    // 대댓글
    const recommentMap = getPosterPost.recommentMap || {};
    // 읽음 처리
    const readPost = getPosterPost.readPost? true : false;

    console.log('readPost >>> ', readPost)
    
    const boardData = boardList.dataValues;
    const menuList = req.user.menuList;

    if(getPosterPost) {
        res.render('board/boardDetail', {
            left_side : menuList,
            menuList: req.user.menuList,
            user: req.user || null,
            post : getPosterPost,
            commentList : filteredCommentList,
            recommentMap : recommentMap,
            readPost : readPost,
            userType : req.user.type, // 유저 타입
            isUserTrue : boardData.writer === req.user.seq ? true : false, // 작성자가 자신인지 확인
            boardData : boardData
        })
    }
};

// 게시물 읽음 처리 
exports.readPost = async (req, res) => {    
    console.log('게시물 읽음 처리 >>>>>>>', req.user.seq, req.body.postId, req.body.writer)
    const readPostResult = await service.readPost(req, res);
    console.log('readPostResult >> ', readPostResult)
    if (readPostResult) {
        return res.status(200).json({ success: true, readPost: readPostResult });
    } 
}

// 읽은 게시물 조회
exports.getReadPosts = async(req, res) => {
    try {
        console.log('1111 >>', req.user.seq)
        const userReadSeq = await service.getReadPosts(req, res);
        console.log('00번 유저가 읽은 게시물 조회 >> ', userReadSeq)
        if(userReadSeq) {
            res.status(200).json({ success: true, userReadSeq: userReadSeq });
        } else {
            res.status(404).json({ success: false, message: '게시물이 없습니다.' });
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '읽은 게시물 조회 오류'})
    }
}

// 팔로우 취소
exports.deleteFollow = async (req, res) => {
    try {
        const subscribeList = await service.deleteFollow(req);
        if (subscribeList) {
            return res.status(200).json({ success: true, subscribeList: subscribeList });
        } 
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '팔로우 취소 오류'})
    }
}



