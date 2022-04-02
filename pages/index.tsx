import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { Intro, QuizListApp } from "page_components/index";

const Home: NextPageWithLayout = () => {
  return (
    <main className="content-width pad-one">
      <Intro />
      <QuizListApp />
    </main>
  );
};

Home.Layout = Layout;

export default Home;
