import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "../../graphql/schema";
import { resolvers } from "../../graphql/resolvers";
import Cors from "micro-cors";
import { createContext } from "../../graphql/context";
import prisma from "../../lib/prismaClient";
import isAuth from "../../graphql/isAuth";

const cors = Cors({
  origin:
    process.env.NODE_ENV == "development"
      ? "https://studio.apollographql.com"
      : "https://flip-mvp-stu.vercel.app",
  credentials: true,
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return {
      req,
      res,
      prisma,
    };
  },
  csrfPrevention: true,
  cache: "bounded",
});

const startServer = apolloServer.start();

export default cors(async function handler(req, res) {
  if (req.method == "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;

  await apolloServer.createHandler({
    path: "/api",
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
