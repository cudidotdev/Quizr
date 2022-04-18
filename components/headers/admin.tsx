import { UserContext } from "components/app";
import React, { useContext, useEffect } from "react";
import Header from "components/headers";
import { AdminNav } from "page_components/admin";

const AdminHeader: React.FC = () => {
  const [user] = useContext(UserContext);

  useEffect(() => {}, []);

  if (!user?.isAdmin === true) return <Header />;
  return (
    <header>
      <AdminNav />
    </header>
  );
};

export default AdminHeader;
