import { Searchr } from "components/forms";
import { AdminLayout } from "components/layouts";
import React, { useEffect, useState } from "react";
import { NextPageWithLayout } from "types/next";
import { getFetcher } from "utils/fetchers";
import styles from "styles/pages/Admin.module.css";
import { LinkList } from "components/lists";
import { TripleSquareLoader } from "components/loaders";
import { RefreshIcon, ReloadIcon } from "components/icons";

const AdminDraftsPage: NextPageWithLayout = () => {
  const [drafts, setDrafts] = useState([]);
  const [draftLoadError, setDraftLoadError] = useState({ val: false, msg: "" });
  const [loading, setLoading] = useState(false);

  async function fetchDrafts() {
    setLoading(true);
    const res = await getFetcher("/api/quiz/draft");
    setLoading(false);

    if (!res)
      return setDraftLoadError({
        val: true,
        msg: "It seems there is a connection error",
      });

    const { success, data, error } = res;
    if (!success) return setDraftLoadError({ val: true, msg: error.message });

    setDraftLoadError({ val: false, msg: "" });
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
      {loading ? (
        <div className={styles.MsgContainer}>
          <p className={styles.LoaderBox}>
            Fetching drafts
            <TripleSquareLoader colored />
          </p>
        </div>
      ) : draftLoadError.val ? (
        <div className={styles.MsgContainer}>
          <p className={styles.ErrorBox}>
            Couldn&apos;t fetch drafts: {draftLoadError.msg}
          </p>
          <button className={styles.ReloadButton} onClick={fetchDrafts}>
            Reload
            <span className={styles.Icon}>
              <ReloadIcon />
            </span>
          </button>
        </div>
      ) : drafts.length ? (
        <LinkList style={{ padding: "0.5rem 0" }}>
          {drafts.map((draft: any) => (
            <div key={draft._id} id={`/admin/drafts/editor?id=${draft._id}`}>
              {draft.title}
            </div>
          ))}
        </LinkList>
      ) : (
        <div className={styles.MsgContainer}>
          <p className={styles.MsgBox}>You have no drafts</p>
        </div>
      )}
    </main>
  );
};

AdminDraftsPage.Layout = AdminLayout;
AdminDraftsPage.LayoutProps = { page: "drafts" };

export default AdminDraftsPage;
