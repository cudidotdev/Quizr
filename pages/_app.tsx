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
        <title>Quizr: A quiz portfoilo project by Augustine Madu</title>
        <link rel="icon" href="/logo.png" />
        <meta
          name="description"
          content="A portfolio project by Augustine Madu"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Quizr: A portfolio project by Augustine Madu"
        />
        <meta
          property="og:description"
          content="A portfolio project by Augustine Madu"
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/og-image.png`}
        />
        <meta property="og:site_name" content="Quizr" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}`} />
        <meta
          name="twitter:title"
          content="A portfolio project by Augustine Madu"
        />
        <meta
          name="twitter:description"
          content="A portfolio project by Augustine Madu."
        />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_URL}/og-image.png`}
        />
        <meta name="twitter:site" content="@CudiLala_" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta httpEquiv="refresh" content="300" />
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
