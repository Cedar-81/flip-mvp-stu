import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://flip-mvp-stu.herokuapp.com/api",
  cache: new InMemoryCache(),
});

export default apolloClient;
// http://localhost:3000/api
