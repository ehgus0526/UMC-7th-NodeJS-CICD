import { responseFromReview, responseFromReviews } from "../dtos/review.dto.js";
import { DuplicateUserReviewError, NotExistUserError } from "../errors.js";
import {
    addReview,
    getReview,
    setReviewImage,
    getReviewImagesByReviewId,
    getAllStoreReviews,
    getUserReviews,
} from "../repositories/review.repository.js";

// 리뷰 작성
export const postReview = async (data) => {
    const joinReviewId = await addReview({
        userId: data.userId,
        restaurantId: data.restaurantId,
        score: data.score,
        body: data.body,
    });

    if (joinReviewId === null) {
        throw new DuplicateUserReviewError("매장이 존재하지 않거나, 이미 해당 매장의 리뷰를 작성하였습니다.", data);
        // throw new Error("매장이 존재하지 않거나, 이미 해당 매장의 리뷰를 작성하였습니다.");
    }

    for (const reviewImg of data.images || []) {
        await setReviewImage(joinReviewId, reviewImg);
    }

    const review = await getReview(joinReviewId);
    const reviewImgs = await getReviewImagesByReviewId(joinReviewId);

    return responseFromReview({ review, reviewImgs });
};


// 매장별 리뷰 목록 조회
export const listStoreReviews = async (storeId, cursor) => {
    const reviews = await getAllStoreReviews(storeId, cursor);
    return responseFromReviews(reviews);
};


// 유저별 리뷰 목록 조회
export const listUserReviews = async (userId, cursor) => {
    const reviews = await getUserReviews(userId, cursor);
    if (reviews === null) {
        throw new NotExistUserError("유저가 존재하지 않습니다.");
    }
    return responseFromReviews(reviews);
};