import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleCreateMission, handleListStoreMissions } from "./controllers/mission.controller.js";
import { handlePostReview, handleListStoreReviews, handleListUserReviews } from "./controllers/review.controller.js";
import { handleCreatePersonalMission, handleCompleteMission } from "./controllers/personalMission.controller.js";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "passport";
import { googleStrategy } from "./auth.config.js";
import { naverStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";
import { handleUpdateUser } from "./controllers/user.controller.js";

dotenv.config();

passport.use(googleStrategy);                                // passport 라이브러리에 로그인 방식 등록 (구글)
passport.use(naverStrategy);                                // passport 라이브러리에 로그인 방식 등록 (네이버)
passport.serializeUser((user, done) => done(null, user));    // Session에 사용자 정보 저장
passport.deserializeUser((user, done) => done(null, user));  // Session 정보 호출

const app = express();
const port = process.env.PORT;

/* 공통 응답을 사용할 수 있는 헬퍼 함수 등록 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});


app.use(cors());                                   // cors 방식 허용
app.use(express.static('public'));                 // 정적 파일 접근
app.use(express.json());                           // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false }));  // 단순 객체 문자열 형태로 본문 데이터 해석


/* HTTP Cookie를 이용해서 Session ID(sid)는 프론트엔드(브라우저)에 저장하고,
이에 연결되는 사용자 데이터는 store를 통해 Prisma로 연결된 MySQL DB에 저장 */
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());  // 사용자의 모든 요청에 HTTP Cookie 중 sid 값이 있다면, 이를 MySQL DB에서 찾아, 일치하는 Session이 있다면 사용자 데이터를 가져와 req.user에 추가


/* Swagger UI가 렌더링 되도록 설정 */
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);


app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 7th",
      description: "UMC 7th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});


/* 구글 로그인을 위한 경로 설정 */
app.get("/oauth2/login/google", passport.authenticate("google"));
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    failureRedirect: "/oauth2/login/google",
    failureMessage: true,
  }),
  (req, res) => res.redirect("/")
);

/* 네이버 로그인을 위한 경로 설정 */
app.get("/oauth2/login/naver", passport.authenticate("naver"));
app.get(
  "/oauth2/callback/naver",
  passport.authenticate("naver", {
    failureRedirect: "/oauth2/login/naver",
    failureMessage: true,
  }),
  (req, res) => res.redirect("/")
);


app.get("/", (req, res) => {
  // #swagger.ignore = true
  console.log(req.user);
  res.send("Hello World!");
});


// 회원 가입
app.post("/users", handleUserSignUp);
// 미션 생성
app.post("/restaurants/:restaurantId/missions", handleCreateMission);
// 미션 도전
app.post("/missions/:missionId/challenges", handleCreatePersonalMission);
// 리뷰 작성
app.post("/users/:userId/restaurants/:restaurantId/reviews", handlePostReview);
// 매장별 리뷰 목록 조회
app.get("/restaurants/:restaurantId/reviews", handleListStoreReviews);
// 유저별 리뷰 목록 조회
app.get("/users/:userId/reviews", handleListUserReviews);
// 매장별 미션 목록 조회
app.get("/restaurants/:restaurantId/missions", handleListStoreMissions);
// 미션 진행 완료
app.patch("/users/:userId/missions/:missionId/complete", handleCompleteMission);
// 유저 정보 수정
app.patch("/users/:userId", handleUpdateUser);

/* 전역 오류를 처리하기 위한 미들웨어 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
