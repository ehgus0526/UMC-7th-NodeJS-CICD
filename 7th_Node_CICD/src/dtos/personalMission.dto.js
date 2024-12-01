// 요청을 위한 DTO 변환
export const bodyToPersonalMission = (body) => {
    return {
        userId: body.userId || 0,
        missionId: body.missionId || 0,
        progressStatus: body.progressStatus,
        successStatus: body.successStatus,
    };
};

// 반환할 데이터를 가공 (개인 미션)
export const responseFromPersonalMission = (mission) => {
    return {
        userId: mission.userId,
        missionId: mission.missionId,
        progressStatus: mission.progressStatus,
        successStatus: mission.successStatus,
    };
};
