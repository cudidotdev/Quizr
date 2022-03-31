import "../styles/globals.css";
import type { AppPropsWithLayout } from "types/next";
import React from "react";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const CLayout = Component.Layout;
  const DefaultLayout: React.FC = ({ children }) => <>{children}</>;
  const Layout = CLayout || DefaultLayout;
  return (
    <>
      <Head>
        <title>Quizr: A quiz portfoilo project by CudiLala</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
