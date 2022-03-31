import React from "react";
import Header from "components/headers";
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

export default Layout;
