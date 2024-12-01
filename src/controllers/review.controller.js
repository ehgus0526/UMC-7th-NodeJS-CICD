import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { postReview, listStoreReviews, listUserReviews } from "../services/review.service.js";

// 리뷰 작성
export const handlePostReview = async (req, res, next) => {
    /*
        #swagger.summary = '리뷰 작성 API';
        #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                score: { type: "number" },
                body: { type: "string" },
                images: { type: "array", items: { type: "string" } }
                }
            }
            }
        }
        };
        #swagger.responses[200] = {
        description: "리뷰 작성 성공 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "SUCCESS" },
                error: { type: "object", nullable: true, example: null },
                success: {
                    type: "object",
                    properties: {
                    userId: { type: "number" },
                    restaurantId: { type: "number" },
                    score: { type: "number" },
                    body: { type: "string" },
                    images: { 
                        type: "array",
                        items: { type: "object",
                                properties: {
                                id: { type: "number" },
                                reviewId: { type: "number" },
                                imgUrl: { type: "string" }
                            }
                        }
                    }
                }
                }
                }
            }
            }
        }
        };
        #swagger.responses[400] = {
        description: "리뷰 작성 실패 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                    type: "object",
                    properties: {
                    errorCode: { type: "string", example: "RV001" },
                    reason: { type: "string" },
                    data: { type: "object" }
                    }
                },
                success: { type: "object", nullable: true, example: null }
                }
            }
            }
        }
        };
    */
    console.log("리뷰작성을 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
    
    // userId와 restaurantId를 req.params에서 가져오기 (정수로 변환)
    const userId = parseInt(req.params.userId, 10);
    const restaurantId = parseInt(req.params.restaurantId, 10);

    // postReview 함수에 전달할 데이터 구조 준비
    const reviewData = bodyToReview({ ...req.body, userId, restaurantId });

    // 리뷰 작성
    const review = await postReview(reviewData);
    res.status(StatusCodes.OK).success(review);
    // res.status(StatusCodes.OK).json({ result: review });
};


// 매장별 리뷰 목록 조회
export const handleListStoreReviews = async (req, res, next) => {
    /*
        #swagger.summary = '매장 리뷰 목록 조회 API';
        #swagger.responses[200] = {
        description: "매장 리뷰 목록 조회 성공 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "SUCCESS" },
                error: { type: "object", nullable: true, example: null },
                success: {
                    type: "object",
                    properties: {
                    data: {
                        type: "array",
                        items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            body: { type: "string" },
                            restaurant: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }, location: { type: "string" },
                                                                        addressDetail: { type: "string" }, openStatus: { type: "boolean" }, foodCategory: { type: "string" } } },
                            user: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }, gender: { type: "string" }, birth: { type: "string", format: "date" },
                                                                        location: { type: "string" }, addressDetail: { type: "string" }, email: { type: "string" }, phoneNumber: { type: "string" },
                                                                        point: { type: "number" }, profileImgUrl: { type: "string" }, locationShare: { type: "boolean" }, marketingReceive: { type: "boolean" },
                                                                        inactiveDate: { type: "string" }, createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" } } }
                        }
                        }
                    },
                    pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                    }
                }
                }
            }
            }
        }
        };
    */
    const reviews = await listStoreReviews(
        parseInt(req.params.restaurantId),
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).json(reviews);
};


// 유저별 리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
    /*
        #swagger.summary = '유저 리뷰 목록 조회 API';
        #swagger.responses[200] = {
        description: "유저 리뷰 목록 조회 성공 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "SUCCESS" },
                error: { type: "object", nullable: true, example: null },
                success: {
                    type: "object",
                    properties: {
                    data: {
                        type: "array",
                        items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            body: { type: "string" },
                            score: { type: "number" },
                            restaurant: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }, location: { type: "string" },
                                                                        addressDetail: { type: "string" }, openStatus: { type: "boolean" }, foodCategory: { type: "string" } } },
                            user: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }, gender: { type: "string" }, birth: { type: "string", format: "date" },
                                                                        location: { type: "string" }, addressDetail: { type: "string" }, email: { type: "string" }, phoneNumber: { type: "string" },
                                                                        point: { type: "number" }, profileImgUrl: { type: "string" }, locationShare: { type: "boolean" }, marketingReceive: { type: "boolean" },
                                                                        inactiveDate: { type: "string" }, createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" } } }
                        }
                        }
                    },
                    pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                    }
                }
                }
            }
            }
        }
        };
        #swagger.responses[400] = {
        description: "유저 리뷰 목록 조회 실패 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                    type: "object",
                    properties: {
                    errorCode: { type: "string", example: "U002" },
                    reason: { type: "string" },
                    data: { type: "object" }
                    }
                },
                success: { type: "object", nullable: true, example: null }
                }
            }
            }
        }
        };
    */
    const reviews = await listUserReviews(
        parseInt(req.params.userId),
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(reviews);
};