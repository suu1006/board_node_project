
const { DATE } = require('sequelize');
const dayjs = require('dayjs');
const { UserPoster } = require('../../models');
const { Board } = require('../../models');
const { Comment } = require('../../models');
const { sequelize } = require('../../models');
const { ReadPost } = require('../../models')
const { QueryTypes } = require('sequelize');
const { Op } = require('sequelize'); // Sequelize의 Op 모듈을 가져옵니다.

// 현재 datetime 얻는 함수
function getCurrentDateTime() {
    const now = dayjs().add(9, "hour").toDate();
    return now;
}

// 구독 전체 리스트 조회(유저)
exports.getAllSubscribeList = async (req, res) => {
    try {        
        // // 구독 목록 >> 1번 유저 - 2,3 구독중
        const subscribeList = await UserPoster.findAll({
            where: {
                user_id: req.user.seq 
            }
        });

        // const poster_id_list = subscribeList.map(data => data.dataValues.poster_id);
        // console.log('poster_id_list >> ', poster_id_list);
        
        // // read_post에서 유저가 읽은 게시물 가져오기
        // const readPosts = await ReadPost.findAll({
        //     where: {
        //         user_seq: req.user.seq // 유저 세션 번호
        //     }
        // });
        // // 중복 제거
        // const readPostList = new Set(readPosts.map(data => data.dataValues.board_seq));
        
        // // poster의 모든 게시물 리스트
        // const allPostList = await Board.findAll({
        //     where: {
        //         writer: {
        //             [Op.in]: poster_id_list
        //         }
        //     }
        // });

        // // 안읽은 게시물 리스트
        // const unreadPostList = allPostList.filter(post => !readPostList.has(post.dataValues.seq));

        // // New 기간 체크
        // const newPostList = unreadPostList.filter(post => {
        //     return dayjs(post.is_new).isAfter(dayjs())
        // });

        // // 안읽은 게시물 리스트
        // const unreadPostSeq = newPostList.map(data => data.dataValues.seq); // 안읽은 게시물 리스트
        // const unreadWriterSeq = newPostList.map(data => data.dataValues.writer); // 안읽은 게시물 작성자 리스트
        
        //////////////////////// 쿼리로 변환 ////////////////////////
        const unreadList = await sequelize.query(
            `select bd.*
            from board bd
            join (
                select distinct bd.seq
                from board bd
                left join read_post rp on bd.seq = rp.board_seq 
                join user_poster up on up.poster_id = bd.writer 
                where 1=1
                and rp.seq is null -- 안읽은 목록
                and bd.is_new > now() -- is_new 기간이 넘지 않은것
                and up.poster_id in ( -- 구독하고 있는 구독자 아이디
                    select poster_id 
                    from user_poster up2 
                    where up2.writer = ${req.user.seq}
                ) 
            ) as sub 
            on bd.seq = sub.seq`,
            {
                type: QueryTypes.SELECT,
            }
        );

        const unreadWriterSeq = unreadList.map(data => data.writer); // 안읽은 게시물 작성자 리스트
        return { subscribeList, unreadWriterSeq };
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '구독 리스트 오류'})
    }
}

// 내 게시글 목록 조회(유저)
exports.getMyPostList = async (req, res) => {
    try {
        const myPostList = await Board.findAll({
            where: {
                writer: req.user.seq
            }
        });
        return myPostList;
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '내 게시글 목록 조회 오류'})
    }
}

// 전체 포스팅 목록(관리자)
exports.getAllUserPostList = async (req, res) => {
    try {
        const boardList = await Board.findAll();
        return boardList;
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '전체 포스팅 목록 조회 오류'})
    }
}

// 팔로우 버튼 클릭 시
exports.createFollow = async (bodyData) => {
    try {
        console.log('팔로우 bodyData >> ', bodyData);
        const userSession = bodyData.userSession;
        const follow = await UserPoster.create({
            user_id: userSession, // 팔로우 하는 사람
            poster_id: bodyData.poster_id, // 글쓴이
            writer: userSession,
            reg_date : getCurrentDateTime(),
            updater : userSession,
        });
        return follow;
    } catch(error) {
        throw error;
    }
}

// 팔로우 되어있는지 확인
exports.getFollower = async (bodyData) => {
    try {
        console.log('getFollower bodyData >> ', bodyData);
        const follower = await UserPoster.findOne({
            where: {
                user_id: bodyData.userSession,
                poster_id: bodyData.poster_id
            }
        });
        return follower;
    } catch(error) {
        throw error;
    }
}

// Poster의 전체 게시물 조회
exports.getPosterList = async (req, res) => {
    try { 
        // poster의 모든 게시물 리스트
        const posterList = await Board.findAll({
            where: {
                writer: req.params.id
            }
        });

        // read_post에서 유저가 읽은 게시물 가져오기
        // const readPosts = await ReadPost.findAll({
        //     where: {
        //         user_seq: req.user.seq // 유저 세션 번호
        //     }
        // });
        // // 중복 제거
        // const readPostList = new Set(readPosts.map(data => data.dataValues.board_seq));

        // console.log('123readPostList >> ', readPostList);
        
        // // 안읽은 게시물 리스트
        // const unreadPostList = posterList.filter(post => !readPostList.has(post.dataValues.seq));

        // console.log('123unreadPostList >> ', unreadPostList);

        // // New 기간 체크
        // const newPostList = unreadPostList.filter(post => {
        //     return dayjs(post.is_new).isAfter(dayjs())
        // });

        // console.log('123newPostList >> ', newPostList);

        // // 안읽은 게시물 리스트
        // const unreadPostSeq = newPostList.map(data => data.dataValues.seq);
        // console.log('123unreadPostSeq >> ', unreadPostSeq); 

         //////////////////////// 쿼리로 변환 ////////////////////////
        const unreadList = await sequelize.query(
            `select bd.*
            from board bd
            join (
                select distinct bd.seq
                from board bd
                left join read_post rp on bd.seq = rp.board_seq 
                join user_poster up on up.poster_id = bd.writer 
                where 1=1
                and rp.seq is null -- 안읽은 목록
                and bd.is_new > now() -- is_new 기간이 넘지 않은것
                and up.poster_id in (
                    select poster_id 
                    from user_poster up2 
                    where up2.writer = ${req.user.seq}
                ) 
            ) as sub 
            on bd.seq = sub.seq`,
            {
                type: QueryTypes.SELECT,
            }
        );

        const unreadPostSeq = unreadList.map(data => data.seq); // 안읽은 게시물 번호 리스트
        return { posterList, unreadPostSeq };
    } catch(error) {
        console.error(error);
        res.status(500).json({error : 'Poster의 전체 게시물 조회 오류'})
    }
}

// poster의 게시글 상세조회 
exports.getPosterPost = async (req, res) => {
    try {
        const filteredCommentList = [];
        const recommentMap = {};

        const posterPost = await Board.findOne({
            where: {
                seq: req.params.postId, // boardSeq
                writer: req.params.id
            }
        });

        const commentList = await Comment.findAll({
            where: {
                board_seq: req.params.postId
            }
        });

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

        return { posterPost, filteredCommentList, recommentMap };
    } catch(error) {
        console.error(error);
        res.status(500).json({error : 'poster의 게시글 조회 오류'})
    }
}

// 게시물 읽음 처리
exports.readPost = async (req, res) => {
    try {
        const userSession = req.user.seq;
        const readPost = await ReadPost.create({
            user_seq : userSession,            
            board_seq : req.body.postId,            
            reg_date : getCurrentDateTime(),
            writer: userSession,
            updater : userSession,
            update_date : getCurrentDateTime()
        })
        return readPost;
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '게시물 읽음 처리 오류'})
    }
}

exports.getReadPosts = async (req, res) => {
    try {
        const readPosts = await ReadPost.findAll({
            where: {
                user_seq: req.user.seq
            }
        });
        console.log('readPosts >> ', readPosts)
        return readPosts;
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '읽은 게시물 조회 오류'})
    }
}

// 팔로우 취소
exports.deleteFollow = async (req, res) => {
    try {
        const deleteFollow = await UserPoster.destroy({
            where: {
                user_id: req.user.seq,
                poster_id: req.params.id
            }
        });
        return deleteFollow;
    } catch(error) {
        console.error(error);
        res.status(500).json({error : '팔로우 취소 오류'})
    }
}



