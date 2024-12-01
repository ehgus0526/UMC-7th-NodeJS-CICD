import { responseFromPersonalMission } from "../dtos/personalMission.dto.js";
import { addPersonalMission, getPersonalMission, updatePersonalMissionStatus } from "../repositories/personalMission.repository.js";

// 미션 도전
export const createPersonalMission = async (data) => {
    const personalMissionId = await addPersonalMission({
        userId: data.userId,
        missionId: data.missionId,
        progressStatus: data.progressStatus || "진행중",
        successStatus: data.successStatus || "실패",
    });

    const mission = await getPersonalMission(personalMissionId);

    return responseFromPersonalMission(mission);
};


// 미션 진행 완료
export const completeMission = async (userId, missionId) => {
    const updatedMission = await updatePersonalMissionStatus(userId, missionId);
    return responseFromPersonalMission(updatedMission);
};