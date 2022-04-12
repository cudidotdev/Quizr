import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import LoginForm from "page_components/in/loginform";

const LoginPage: NextPageWithLayout = () => {
  return (
    <main className="site-width pad-one">
      <LoginForm />
    </main>
  );
};

LoginPage.Layout = Layout;

export default LoginPage;
