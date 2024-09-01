import { ApolloClient, InMemoryCache } from "@apollo/client";

// Determine the base URI dynamically
const baseUri =
  typeof window !== "undefined"
    ? `${window.location.origin}/api`
    : process.env.NODE_ENV === "development"
    ? "http://localhost:3001/api"
    : "https://flip-mvp-stu.vercel.app/api";

const apolloClient = new ApolloClient({
  uri: baseUri,
  cache: new InMemoryCache(),
});

export default apolloClient;
