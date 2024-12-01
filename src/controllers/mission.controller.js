import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission, listStoreMissions } from "../services/mission.service.js";

// 미션 등록
export const handleCreateMission = async (req, res, next) => {
    /*
        #swagger.summary = '미션 등록 API';
        #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                price: { type: "number" },
                point: { type: "number" },
                certification_number: { type: "string" }
                }
            }
            }
        }
        };
        #swagger.responses[200] = {
        description: "미션 등록 성공 응답",
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
                    restaurantId: { type: "number" },
                    price: { type: "number" },
                    point: { type: "number" },
                    certification_number: { type: "string" }
                    }
                }
                }
            }
            }
        }
        };
        #swagger.responses[400] = {
        description: "미션 등록 실패 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                    type: "object",
                    properties: {
                    errorCode: { type: "string", example: "R001" },
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
    console.log("미션등록을 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

    // 경로에서 restaurantId를 가져옴 (정수로 변환)
    const restaurantId = parseInt(req.params.restaurantId, 10);

    // postReview 함수에 전달할 데이터 구조 준비
    const missionData = bodyToMission({ ...req.body, restaurantId });

    // 미션 생성
    const mission = await createMission(missionData);
    res.status(StatusCodes.OK).success(mission);
    // res.status(StatusCodes.OK).json({ result: mission });
};


// 매장별 미션 목록 조회
export const handleListStoreMissions = async (req, res, next) => {
    /*
        #swagger.summary = '매장 미션 목록 조회 API';
        #swagger.responses[200] = {
        description: "매장 미션 목록 조회 성공 응답",
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
                            price: { type: "number" },
                            point: { type: "number" },
                            certificationNumber: { type: "number" },
                            restaurant: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }, location: { type: "string" },
                                                                        addressDetail: { type: "string" }, openStatus: { type: "boolean" }, foodCategory: { type: "string" } } },
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
        description: "매장 미션 목록 조회 실패 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                    type: "object",
                    properties: {
                    errorCode: { type: "string", example: "R001" },
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
    const reviews = await listStoreMissions(
        parseInt(req.params.restaurantId),
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(reviews);
};