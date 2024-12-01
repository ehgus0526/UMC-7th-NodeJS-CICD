import { prisma } from "../db.config.js";
import { NotExistUserError, NotExistMissionError, NotExisPersontMissionError } from "../errors.js";

// 개인 미션 추가
export const addPersonalMission = async (data) => {
    // 미션 존재 유무 확인
    const missionExists = await prisma.mission.findFirst({
        where: { id: data.missionId }
    });
    if (!missionExists) {
        throw new NotExistMissionError("존재하지 않는 미션입니다.", data);
    }

    // 유저 존재 유무 확인
    const userExists = await prisma.user.findFirst({
        where: { id: data.userId }
    });
    if (!userExists) {
        throw new NotExistUserError("존재하지 않는 사용자입니다.", data);
    }

    // 기존 도전 여부 확인
    const personalMissionExists = await prisma.personalMission.findFirst({
        where: {
            userId: data.userId,
            missionId: data.missionId
        }
    });
    if (personalMissionExists) {
        throw new NotExisPersontMissionError("이미 도전 중이거나 완료한 미션입니다.");
    }

    // 개인 미션 데이터 추가
    const result = await prisma.personalMission.create({
        data: {
            userId: data.userId,
            missionId: data.missionId,
            progressStatus: data.progressStatus,
            successStatus: data.successStatus
        }
    });

    return result.id;
};

// 개인 미션 조회
export const getPersonalMission = async (missionId) => {
    const mission = await prisma.personalMission.findUnique({
        where: { id: missionId }
    });

    if (!mission) {
        return null;
    }

    return mission;
};

// 개인 미션 진행 완료
export const updatePersonalMissionStatus = async (userId, missionId) => {
    const updatedMission = await prisma.personalMission.updateMany({
        where: {
            userId: userId,
            missionId: missionId,
            progressStatus: "진행중"  // 진행중 상태일 때만 완료로 변경
        },
        data: {
            successStatus: "성공",
            progressStatus: "완료"  // 성공상태와 진행상태 동시에 변경
        }
    });

    if (updatedMission.count === 0) {
        throw new NotExisPersontMissionError("진행 중인 미션이 없습니다.");
    }

    return await prisma.personalMission.findFirst({
        where: { userId: userId, missionId: missionId }
    });
};