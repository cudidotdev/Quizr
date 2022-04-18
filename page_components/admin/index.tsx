import { AdminLayout } from "components/layouts";
import React, { ReactElement, useContext } from "react";
import { NextPageWithLayout } from "types/next";
import { UserContext } from "components/app";
import NotFoundComponent from "page_components/404";

export default function AdminPage(Page: ReactElement): NextPageWithLayout {
  const PageWrapper: NextPageWithLayout = () => {
    const [user] = useContext(UserContext);
    if (user?.isAdmin !== true) return <NotFoundComponent />;
    return Page;
  };

  PageWrapper.Layout = AdminLayout;
  PageWrapper.page = "users";

  return PageWrapper;
}

export { default as AdminNav } from "./nav";
