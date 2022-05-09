import Layout from "components/layouts";
import { TextBlock, Text, TextS } from "components/texts";
import connectDB from "database/connect";
import { Quiz } from "database/models";
import { GetStaticPaths, GetStaticProps } from "next";
import type { quiz } from "types/app";
import { NextPageWithLayout } from "types/next";
import styles from "styles/pages/Q.module.css";
import { postFetcher } from "utils/fetchers";
import { useState } from "react";
import { ErrorMsg, StartButton } from "page_components/q";
import { useRouter } from "next/router";
import Head from "next/head";

//@ts-ignore
const QuizTakePage: NextPageWithLayout = ({ quiz }: { quiz: quiz }) => {
  const { title, introText, _id: id } = quiz;
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
    if (!success) return setStartError({ value: true, msg: error.message });

    setStartError({ value: false, msg: "" });
    sessionStorage.setItem(
      `quiz ${router.query.urlName}`,
      JSON.stringify(data)
    );
    router.push(`/q/${router.query.urlName}/take`);
  }

  return (
    <main className="content-width" style={{ padding: "1rem" }}>
      <h1 className={`${styles.QuizTitle} t-regular`}>
        <TextS>{title}</TextS>
      </h1>
      <TextBlock className={styles.QuizIntroText}>
        {modify(introText)}
        <p className={styles.TimeBox}>Time: 10 minutes</p>
      </TextBlock>
      {startError.value && <ErrorMsg msg={startError.msg} />}
      <div style={{ textAlign: "center" }}>
        <StartButton loading={startLoading} onClick={startQuiz} />
      </div>
      <Head>
        <title>Quiz: {title}</title>
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

export const getStaticPaths: GetStaticPaths = async () => {
  await connectDB();

  const paths = (await Quiz.find({}).select("urlName -_id")).map((quiz) => {
    return { params: quiz };
  });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await connectDB();

  const quiz: quiz = await Quiz.findOne({ urlName: params!.urlName })
    .select("title introText ")
    .lean();
  if (!quiz) return { notFound: true };

  quiz._id = quiz._id.toString();

  return { props: { quiz }, revalidate: 24 * 60 * 60 };
};
