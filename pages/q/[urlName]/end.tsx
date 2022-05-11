import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";

const QuizEndPage: NextPageWithLayout = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.1rem",
      }}
    >
      Ended
    </div>
  );
};

QuizEndPage.Layout = Layout;

export default QuizEndPage;
