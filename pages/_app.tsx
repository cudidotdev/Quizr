import "../styles/globals.css";
import type { AppPropsWithLayout } from "types/next";
import React from "react";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const CLayout = Component.Layout;
  const DefaultLayout: React.FC = ({ children }) => <>{children}</>;
  const Layout = CLayout || DefaultLayout;
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
