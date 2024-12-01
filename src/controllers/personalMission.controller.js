import { StatusCodes } from "http-status-codes";
import { bodyToPersonalMission } from "../dtos/personalMission.dto.js";
import { createPersonalMission, completeMission } from "../services/personalMission.service.js";

// 미션 도전
export const handleCreatePersonalMission = async (req, res, next) => {
    /*
        #swagger.summary = '미션 도전 API';
        #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                userId: { type: "number" },
                progressStatus: { type: "string" },
                successStatus: { type: "string" }
                }
            }
            }
        }
        };
        #swagger.responses[200] = {
        description: "미션 도전 성공 응답",
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
                    missionId: { type: "number" },
                    progressStatus: { type: "string" },
                    successStatus: { type: "string" }
                    }
                }
                }
            }
            }
        }
        };
        #swagger.responses[400] = {
        description: "미션 도전 실패 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                    type: "object",
                    properties: {
                    errorCode: { type: "string", example: "M001" },
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
    console.log("미션 도전을 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

    // 경로에서 missionId 가져옴
    const missionId = parseInt(req.params.missionId, 10);

    // 요청 내용에서 userId 가져옴
    const { userId } = req.body;

    // bodyToPersonalMission 함수에 전달할 데이터 구조 준비
    const missionData = bodyToPersonalMission({ ...req.body, missionId, userId });

    // 개인 미션 생성
    const personalMission = await createPersonalMission(missionData);
    res.status(StatusCodes.OK).success(personalMission);
    // res.status(StatusCodes.OK).json({ result: personalMission });
};


// 미션 진행 완료
export const handleCompleteMission = async (req, res, next) => {
    /*
        #swagger.summary = '미션 진행 완료 API';
        #swagger.responses[200] = {
        description: "미션 진행 완료 성공 응답",
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
                            userId: { type: "number" },
                            missionId: { type: "number" },
                            progressStatus: { type: "string" },
                            successStatus: { type: "string" },
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
        description: "미션 진행 완료 실패 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                    type: "object",
                    properties: {
                    errorCode: { type: "string", example: "M002" },
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
    // 경로에서 userId, missionId 가져옴
    const { userId, missionId } = req.params;

    // 미션 진행 완료
    const updatedMission = await completeMission(parseInt(userId), parseInt(missionId));
    res.status(StatusCodes.OK).success(updatedMission);
};