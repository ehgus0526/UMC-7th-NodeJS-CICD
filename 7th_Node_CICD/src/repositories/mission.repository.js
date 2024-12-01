import { prisma } from "../db.config.js";

// 미션 추가
export const addMission = async (data) => {
    // 매장 존재 여부 확인
    const restaurantExists = await prisma.restaurant.findFirst({
        where: { id: data.restaurantId }
    });

    if (!restaurantExists) {
        return null;
    }

    // 미션 생성
    const result = await prisma.mission.create({
        data: {
            restaurantId: data.restaurantId,
            price: data.price,
            point: data.point,
            certificationNumber: data.certification_number,
        }
    });

    return result.id;
};

// 미션 조회
export const getMission = async (missionId) => {
    const mission = await prisma.mission.findFirst({
        where: { id: missionId }
    });

    if (!mission) {
        return null;
    }

    return mission;
};

// 매장별 미션 목록 조회
export const getStoreMissions = async (restaurantId, cursor) => {
    const missions = await prisma.mission.findMany({
        select: { id: true, price: true, point: true, certificationNumber: true, restaurant: true },
        where: { restaurantId: restaurantId, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });

    if (missions.length ===0 ) {
        return null;
    };

    return missions;
};