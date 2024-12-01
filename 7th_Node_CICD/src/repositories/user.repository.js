import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (user) {
        return null;
    }

    const created = await prisma.user.create({ data: data });
    return created.id;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
    const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
    return user;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
    await prisma.favoriteFood.create({
        data: {
          userId: userId,
          foodId: foodCategoryId,
        },
    });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
    const preferences = await prisma.favoriteFood.findMany({
        select: {
          id: true,
          userId: true,
          foodId: true,
          foodCategory: true,
        },
        where: { userId: userId },
        orderBy: { foodId: "asc" },
    });
    
    return preferences;
};

// 유저 정보 수정
export const updateUserInfo = async (userId, data) => {
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name || undefined,
            gender: data.gender || undefined,
            birth: data.birth ? new Date(data.birth) : undefined,
            location: data.location || undefined,
            addressDetail: data.address_detail || undefined,
            phoneNumber: data.phone_number || undefined,
            profileImgUrl: data.profile_img_url || undefined,
        },
    });
    return updatedUser;
};