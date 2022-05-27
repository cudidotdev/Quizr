import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { useEffect } from "react";
import { clone } from "utils";
import Head from "next/head";

const AboutPage: NextPageWithLayout = () => {
  return (
    <main className="pad-one">
      <Head>
        <title>About: Quizr</title>
      </Head>
    </main>
  );
};

AboutPage.Layout = Layout;

export default AboutPage;
