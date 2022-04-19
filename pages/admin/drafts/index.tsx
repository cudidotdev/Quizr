import { Searchr } from "components/forms";
import { AdminLayout } from "components/layouts";
import React, { useEffect, useState } from "react";
import { NextPageWithLayout } from "types/next";
import { getFetcher } from "utils/fetchers";
import styles from "styles/pages/Admin.module.css";
import { LinkList } from "components/lists";

const AdminDraftsPage: NextPageWithLayout = () => {
  const [drafts, setDrafts] = useState([]);

  async function fetchDrafts() {
    const res = await getFetcher("/api/quiz/draft");
    if (!res) return;

    const { success, data, error } = res;
    if (!success) return;
    setDrafts(data);
  }

  useEffect(() => {
    fetchDrafts();
  }, []);

  return (
    <main className="site-width" style={{ padding: "0.5rem 1rem" }}>
      <div>
        <Searchr name="searchDrafts" placeholder="Search..." label="" />
      </div>
      <LinkList style={{ padding: "0.5rem 0" }}>
        {drafts.map((draft: any) => (
          <div key={draft._id} id={`/admin/drafts/editor?id=${draft._id}`}>
            {draft.title}
          </div>
        ))}
      </LinkList>
    </main>
  );
};

AdminDraftsPage.Layout = AdminLayout;
AdminDraftsPage.LayoutProps = { page: "drafts" };

export default AdminDraftsPage;
