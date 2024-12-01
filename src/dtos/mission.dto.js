export const bodyToMission = (body) => {
    return {
        restaurantId: body.restaurantId,
        price: body.price || 0,
        point: body.point || 0,
        certification_number: body.certification_number,
    };
  };

// 반환할 데이터를 가공 (미션 등록)
export const responseFromMission = (mission) => {
    return {
        restaurantId: mission.restaurantId,
        price: mission.price,
        point: mission.point,
        certification_number: mission.certificationNumber,
    };
};

// 반환할 데이터를 가공 (미션 목록 조회)
export const responseFromMissions = (missions) => {
    return {
        data: missions,
        pagination: {
            cursor: missions.length ? missions[missions.length - 1].id : null,
        },
    };
};