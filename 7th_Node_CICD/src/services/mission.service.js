import { responseFromMission, responseFromMissions } from "../dtos/mission.dto.js";
import { NotExistRestaurantError } from "../errors.js";
import { addMission, getMission, getStoreMissions } from "../repositories/mission.repository.js";

// 미션 등록
export const createMission = async (data) => {
    const joinMissionId = await addMission({
        restaurantId: data.restaurantId,
        price: data.price,
        point: data.point,
        certification_number: data.certification_number,
    });

    if (joinMissionId === null) {
        throw new NotExistRestaurantError("존재하지 않는 식당입니다.", data);
        // throw new Error("존재하지 않는 식당입니다.");
    }

    const mission = await getMission(joinMissionId);

    return responseFromMission(mission);
};

// 매장별 미션 목록 조회
export const listStoreMissions = async (storeId, cursor) => {
    const missions = await getStoreMissions(storeId, cursor);
    if (missions === null) {
        throw new NotExistRestaurantError("존재하지 않는 식당입니다.");
    }
    return responseFromMissions(missions);
};