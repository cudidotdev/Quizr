import React, { useEffect, useState } from "react";
import Header, { AdminHeader } from "components/headers";
import Footer from "components/footers";

const Layout: React.FC = ({ children }) => {
  return (
    <div id="body">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export const AdminLayout: React.FC = ({ children }) => {
  const [page, setPage] = useState<string | undefined>();
  useEffect(() => {
    console.log(children);
  });
  return (
    <div id="body">
      <AdminHeader />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
