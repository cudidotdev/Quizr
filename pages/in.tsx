import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import LoginForm from "page_components/in/loginform";
import Head from "next/head";

const LoginPage: NextPageWithLayout = () => {
  return (
    <main className="site-width pad-one">
      <LoginForm />
      <Head>
        <title>Quiz: User Login</title>
      </Head>
    </main>
  );
};

LoginPage.Layout = Layout;

export default LoginPage;
