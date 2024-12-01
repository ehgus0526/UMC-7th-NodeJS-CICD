/* ---------- 유저 관련 에러 ---------- */
// 이메일 중복 에러
export class DuplicateUserEmailError extends Error {
    errorCode = "U001";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
};
// 유저 미존재 에러
export class NotExistUserError extends Error {
    errorCode = "U002";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
};


/* ---------- 식당 관련 에러 ---------- */
// 식당 미존재 에러
export class NotExistRestaurantError extends Error {
    errorCode = "R001";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
};


/* ---------- 리뷰 관련 에러 ---------- */
// 리뷰 중복 에러
export class DuplicateUserReviewError extends Error {
    errorCode = "RV001";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
};


/* ---------- 미션 관련 에러 ---------- */
// 미션 미존재 에러
export class NotExistMissionError extends Error {
    errorCode = "M001";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
};
// 기존 도전 여부 확인 에러
export class NotExisPersontMissionError extends Error {
    errorCode = "M002";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
};