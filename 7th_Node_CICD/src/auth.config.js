import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as NaverStrategy } from "passport-naver";
import { prisma } from "./db.config.js";

dotenv.config();

// 구글 로그인
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/google",
        scope: ["email", "profile"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
        return googleVerify(profile)
        .then((user) => cb(null, user))
        .catch((err) => cb(err));
    }
);

const googleVerify = async (profile) => {
    const email = profile.emails?.[0]?.value;
    if (!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }
  
    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
        return { id: user.id, email: user.email, name: user.name };
    }
  
    const created = await prisma.user.create({
        data: {
            name: profile.displayName,
            // gender: "추후 수정",
            birth: new Date(1970, 0, 1),
            location: "추후 수정",
            addressDetail: "추후 수정",
            email,
            // phoneNumber: "추후 수정",
            // point: "추후 수정",
            // profileImgUrl: "추후 수정",
            // locationShare: "추후 수정",
            // marketingReceive: "추후 수정",
            // inactiveDate: "추후 수정",
            // createdAt: "추후 수정",
            // updatedAt: "추후 수정",
        },
    });
  
    return { id: created.id, email: created.email, name: created.name };
};


// 네이버 로그인
export const naverStrategy = new NaverStrategy(
    {
        clientID: process.env.PASSPORT_NAVER_CLIENT_ID,
        clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/naver",
    },
    (accessToken, refreshToken, profile, cb) => {
        return naverVerify(profile)
        .then((user) => cb(null, user))
        .catch((err) => cb(err));
    }
);

const naverVerify = async (profile) => {
    const email = profile.emails?.[0]?.value;
  
    if (!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }
  
    // 데이터베이스에서 사용자 찾기
    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
        return { id: user.id, email: user.email, name: user.name };
    }
  
    // 사용자가 없다면 새로운 사용자 생성
    const created = await prisma.user.create({
        data: {
            name: profile.displayName,
            birth: new Date(1970, 0, 1),
            location: "추후 수정",
            addressDetail: "추후 수정",
            email,
        },
    });
  
    return { id: created.id, email: created.email, name: created.name };
};
