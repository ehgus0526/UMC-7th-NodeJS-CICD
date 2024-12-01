import { prisma } from "../db.config.js";

// 리뷰 작성
export const addReview = async (data) => {
    // 매장 존재 여부 확인
    const restaurantExists = await prisma.restaurant.findFirst({
        where: { id: data.restaurantId }
    });

    if (!restaurantExists) {
        return null;
    }

    // 중복 리뷰 방지
    const reviewExists = await prisma.review.findFirst({
        where: {
            userId: data.userId,
            restaurantId: data.restaurantId
        }
    });

    if (reviewExists) {
        return null;
    }

    // 리뷰 생성
    const review = await prisma.review.create({
        data: {
            userId: data.userId,
            restaurantId: data.restaurantId,
            score: data.score,
            body: data.body
        }
    });

    return review.id;
};

// 리뷰 조회
export const getReview = async (reviewId) => {
    const review = await prisma.review.findFirst({
        where: { id: reviewId }
    });

    if (!review) {
        return null;
    }

    return review;
};

// 리뷰 이미지 추가
export const setReviewImage = async (reviewId, imgUrl) => {
    const result = await prisma.reviewImage.create({
        data: {
            reviewId: reviewId,
            imgUrl: imgUrl
        }
    });

    return result.id;
};

// 리뷰 이미지 조회
export const getReviewImagesByReviewId = async (reviewId) => {
    const images = await prisma.reviewImage.findMany({
        where: { reviewId: reviewId }
    });

    return images;
};

// 매장별 리뷰 목록 조회
export const getAllStoreReviews = async (restaurantId, cursor) => {
    const reviews = await prisma.review.findMany({
        select: { id: true, body: true, restaurant: true, user: true },
        where: { restaurantId: restaurantId, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });

    return reviews;
};

// 유저별 리뷰 목록 조회
export const getUserReviews = async (userId, cursor) => {
    const reviews = await prisma.review.findMany({
        select: { id: true, body: true, score: true, restaurant: true, user: true },
        where: { userId: userId, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });

    if (reviews.length ===0 ) {
        return null;
    };

    return reviews;
};