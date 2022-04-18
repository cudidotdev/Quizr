import "../styles/globals.css";
import type { AppPropsWithLayout } from "types/next";
import React from "react";
import Head from "next/head";
import App from "components/app";

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
      <App>
        <Layout {...Component.LayoutProps}>
          <Component {...pageProps} />
        </Layout>
      </App>
    </>
  );
}

export default MyApp;
