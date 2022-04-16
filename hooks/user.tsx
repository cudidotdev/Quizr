import React, { useEffect, useState } from "react";
import { getFetcher } from "utils/fetchers";

export default function useUser(): [any, React.Dispatch<any>] {
  const [user, setUser] = useState<any>(null);
  const [reload, setReload] = useState<any>();
  const rCol: number[] = [];

  function r(): number {
    const a = Math.random();
    if (rCol.includes(a)) return r();

    rCol.pop();
    rCol.push(a);
    console.log(rCol);
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
    setUser(JSON.parse(localStorage.getItem("user") || ""));
    fetchUser();
  }, []);

  useEffect(() => {
    console.log(user);
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    let x: any;
    console.log("run");

    if (reload) {
      x = setTimeout(fetchUser, 10000);
    }
  }, [reload]);
  /* eslint-enable */

  return [user, setUser];
}

//const [user] = useUser
