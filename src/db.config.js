import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();  // Prisma의 Client 인스턴스 생성

dotenv.config();
