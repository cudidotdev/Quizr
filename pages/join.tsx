import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import RegisterForm from "page_components/join/registerform";

const LoginPage: NextPageWithLayout = () => {
  return (
    <main className="site-width pad-one">
      <RegisterForm />
    </main>
  );
};

LoginPage.Layout = Layout;

export default LoginPage;
