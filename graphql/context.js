import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prismaClient";

export async function createContext(req, res) {
  console.log("here", res.cookie);
  return {
    prisma,
    res,
    req,
  };
}
