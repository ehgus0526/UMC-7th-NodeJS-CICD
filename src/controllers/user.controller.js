import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { updateUser } from "../services/user.service.js";

// 회원가입
export const handleUserSignUp = async (req, res, next) => {
    /*
        #swagger.summary = '회원 가입 API';
        #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                name: { type: "string" },
                gender: { type: "string" },
                birth: { type: "string", format: "date" },
                location: { type: "string" },
                address_detail: { type: "string" },
                email: { type: "string" },
                phone_number: { type: "string" },
                location_share: { type: "boolean" },
                marketing_receive: { type: "string" },
                favorite_food: { type: "array", items: { type: "number" } }
                }
            }
            }
        }
        };
        #swagger.responses[200] = {
        description: "회원 가입 성공 응답",
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
                    email: { type: "string" },
                    name: { type: "string" },
                    favorite_food: { type: "array", items: { type: "string" } }
                    }
                }
                }
            }
            }
        }
        };
        #swagger.responses[400] = {
        description: "회원 가입 실패 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                    type: "object",
                    properties: {
                    errorCode: { type: "string", example: "U001" },
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
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

    const user = await userSignUp(bodyToUser(req.body));
    
    res.status(StatusCodes.OK).success(user);
    // res.status(StatusCodes.OK).json({ result: user });
};


// 유저 정보 수정
export const handleUpdateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const updatedUser = await updateUser(parseInt(userId), req.body);
        res.status(StatusCodes.OK).success(updatedUser);
    } catch (error) {
        next(error);
    }
};