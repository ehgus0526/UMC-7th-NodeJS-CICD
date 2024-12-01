export const bodyToReview = (body) => {
    return {
        userId: body.userId,
        restaurantId: body.restaurantId,
        score: body.score,
        body: body.body,
	    images: body.images,
    };
  };

// 반환할 데이터를 가공 (리뷰 작성)
export const responseFromReview = ({ review, reviewImgs }) => {
    return {
        userId: review.userId,
        restaurantId: review.restaurantId,
        score: review.score,
        body: review.body,
        images: reviewImgs,
    };
};

// 반환할 데이터를 가공 (리뷰 목록 조회)
export const responseFromReviews = (reviews) => {
    return {
        data: reviews,
        pagination: {
            cursor: reviews.length ? reviews[reviews.length - 1].id : null,
        },
    };
};