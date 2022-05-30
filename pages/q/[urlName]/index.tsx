import Layout from "components/layouts";
import { TextBlock, TextS } from "components/texts";
import connectDB from "database/connect";
import { Quiz } from "database/models";
import { GetServerSideProps } from "next";
import type { quiz } from "types/app";
import { NextPageWithLayout } from "types/next";
import styles from "styles/pages/Q.module.css";
import { postFetcher } from "utils/fetchers";
import { useEffect, useState } from "react";
import { ErrorMsg, StartButton } from "page_components/q";
import { useRouter } from "next/router";
import Head from "next/head";

//@ts-ignore
const QuizTakePage: NextPageWithLayout = ({ quiz }: { quiz: quiz }) => {
  const { title, introText, _id: id, urlName } = quiz;
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState({ value: false, msg: "" });
  const router = useRouter();

  async function startQuiz() {
    setStartLoading(true);
    const res = await postFetcher(`/api/quiz/start?id=${id}`, {});
    setStartLoading(false);

    if (!res)
      return setStartError({
        value: true,
        msg: "It seems there is no internet connection",
      });

    const { success, data, error } = res;
    if (!success) {
      if (error.name === "time") return router.push(`/q/${urlName}/result`);
      return setStartError({ value: true, msg: error.message });
    }

    setStartError({ value: false, msg: "" });
    sessionStorage.setItem(
      `quiz ${router.query.urlName}`,
      JSON.stringify(data)
    );
    router.push(`/q/${urlName}/take`);
  }

  useEffect(() => {
    router.prefetch(`/q/${urlName}/result`);
  }, [router, urlName]);

  return (
    <main className="content-width" style={{ padding: "1rem" }}>
      <h1 className={`${styles.QuizTitle} t-regular`}>
        <TextS>{title}</TextS>
      </h1>
      <div className={styles.QuizIntroText}>
        {modify(introText)}
        <p className={styles.TimeBox}>
          <TextS>Time: 10 minutes</TextS>
        </p>
      </div>
      {startError.value && <ErrorMsg msg={startError.msg} />}
      <div style={{ textAlign: "center" }}>
        <StartButton loading={startLoading} onClick={startQuiz} />
      </div>
      <Head>
        <title>{title}: Quizr</title>
      </Head>
    </main>
  );
};

QuizTakePage.Layout = Layout;
export default QuizTakePage;

function modify(string: string) {
  let arr: any[] = string.split("\n");
  arr = arr.map((string, idx) => <TextBlock key={idx}>{string}</TextBlock>);
  return arr;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await connectDB();

  const quiz: quiz = await Quiz.findOne({ urlName: params!?.urlName })
    .select("title introText urlName")
    .lean();
  if (!quiz) return { notFound: true };

  quiz._id = quiz._id.toString();

  return { props: { quiz } };
};
