import React, { useContext, useEffect, useState } from "react";
import Header from "components/headers";
import Footer from "components/footers";
import type { page } from "types/pages/admin";
import { UserContext } from "components/app";
import NotFoundComponent from "page_components/404";
import { AdminHeader } from "components/headers";
import { AdminNav } from "page_components/admin";

const Layout: React.FC = ({ children }) => {
  return (
    <div id="body">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export const AdminLayout: React.FC<{ page?: page }> = ({ children, page }) => {
  const [user] = useContext(UserContext);
  if (!user?.isAdmin)
    return (
      <Layout>
        <NotFoundComponent />
      </Layout>
    );
  return (
    <div id="body">
      <AdminHeader />
      <AdminNav page={page || "overview"} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
