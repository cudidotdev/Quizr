import React, { useEffect, useState } from "react";
import { getFetcher } from "utils/fetchers";

const prev = { val: 0 };

export default function useUser(): [any, React.Dispatch<any>] {
  const [user, setUser] = useState<any>(null);
  const [reload, setReload] = useState<any>();

  function r(): number {
    const a = Math.random();
    if (a === prev.val) return r();

    prev.val = a;
    return a;
  }

  async function fetchUser() {
    const res = await getFetcher("/api/user");
    if (!res) return setReload(r());

    const { success, data, error } = res;
    if (!success) return setReload(r());

    setUser(data);
    setReload(false);
  }

  /* eslint-disable */
  useEffect(() => {
    //@ts-ignore
    setUser(JSON.parse(localStorage.getItem("user")));
    fetchUser();
    window.addEventListener("focus", fetchUser);

    return () => window.removeEventListener("focus", fetchUser);
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    reload && setTimeout(fetchUser, 10000);
  }, [reload]);
  /* eslint-enable */

  return [user, setUser];
}

//const [user] = useUser
