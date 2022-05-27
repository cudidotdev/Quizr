import React from "react";
import styles from "styles/pages/404.module.css";
import { Linkr } from "components/links";
import Head from "next/head";

const NotFoundComponent: React.FC = () => {
  return (
    <main className="content-width pad-one">
      <p>Page not found</p>
      <Linkr className={styles.Link} href="/">
        Back to homepage
      </Linkr>
      <Head>
        <title>Not Found: Quizr</title>
      </Head>
    </main>
  );
};

export default NotFoundComponent;
