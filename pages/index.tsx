import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import styles from "styles/pages/Home.module.css";

const Home: NextPageWithLayout = () => {
  return (
    <main className="content-width pad-one">
      <div className={styles.Hero}>
        <div>
          Hi, welcome to Quizr. Take a quiz and test your knowledge on some
          mind-blowing facts.
        </div>
        <div>
          Choose one of the quizes below. You can search for quizes and sort
          based on category, difficulty or popularity.
        </div>
      </div>
    </main>
  );
};

Home.Layout = Layout;

export default Home;
