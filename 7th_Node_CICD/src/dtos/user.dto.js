export const bodyToUser = (body) => {
    const birth = new Date(body.birth);
  
    return {
        name: body.name || "",
        gender: body.gender,
        birth,
        location: body.location || "",
        address_detail: body.address_detail || "",
        email: body.email,
        phone_number: body.phone_number,
        location_share: body.location_share,
        marketing_receive: body.marketing_receive,
        favorite_food: body.favorite_food,
    };
};

// 반환할 데이터를 가공
export const responseFromUser = ({ user, preferences }) => {
    const preferFoods = preferences.map(
        (preference) => preference.foodCategory.name
    );
    
    return {
        email: user.email,
        name: user.name,
        favorite_food: preferFoods,
    };
};

// 반환할 데이터를 가공 (유저 정보 수정)
export const responseFromUserUpdate = (user) => {
    return {
        id: user.id,
        name: user.name,
        gender: user.gender,
        birth: user.birth,
        location: user.location,
        addressDetail: user.addressDetail,
        phoneNumber: user.phoneNumber,
        profileImgUrl: user.profileImgUrl,
    };
};