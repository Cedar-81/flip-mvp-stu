import Head from "next/head";
import Layout from "../components/layout";
import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../lib/apolloClient";
import { Studentcontextprovider } from "../components/contexts/studentcontext";
import { Authcontextprovider } from "../components/contexts/authcontext";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <ApolloProvider client={apolloClient}>
        <Authcontextprovider>
          <Studentcontextprovider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Studentcontextprovider>
        </Authcontextprovider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
