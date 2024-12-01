import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
    addUser,
    getUser,
    getUserPreferencesByUserId,
    setPreference,
} from "../repositories/user.repository.js";
import { updateUserInfo } from "../repositories/user.repository.js";
import { responseFromUserUpdate } from "../dtos/user.dto.js";

// 회원가입
export const userSignUp = async (data) => {
    const joinUserId = await addUser({
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        location: data.location,
        addressDetail: data.address_detail,
        email: data.email,
        phoneNumber: data.phone_number,
        locationShare: data.location_share,
        marketingReceive: data.marketing_receive,
    });

    if (joinUserId === null) {
        throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
        // throw new Error("이미 존재하는 이메일입니다.");
    }

    for (const preference of data.favorite_food || []) {
        await setPreference(joinUserId, preference);
    }

    const user = await getUser(joinUserId);
    const preferences = await getUserPreferencesByUserId(joinUserId);

    return responseFromUser({ user, preferences });
};

// 유저 정보 수정
export const updateUser = async (userId, data) => {
    const updatedUser = await updateUserInfo(userId, data);
    return responseFromUserUpdate(updatedUser);
};