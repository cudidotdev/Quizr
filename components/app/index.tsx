import React, { ReactElement, useEffect, useState } from "react";
import useModal from "hooks/modal";
import useUser from "hooks/user";
import useNotePad from "hooks/notepad";
import { note } from "types/components/notepad";
import { useRouter } from "next/router";
import { Loader } from "components/loaders";

export const ModalContext = React.createContext<
  [(elem: ReactElement) => void, () => void]
>([(elem: ReactElement) => {}, () => {}]);
//@ts-ignore
export const UserContext = React.createContext<[any, React.Dispatch<any>]>([]);
export const NotePadContext = React.createContext<(note: note) => void>(
  () => {}
);

const App: React.FC = ({ children }) => {
  const [Modal, runModal, removeModal] = useModal();
  const [NotePad, addNote] = useNotePad();
  const [user, setUser] = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function runLoader() {
    setLoading(true);
  }

  function removeLoader() {
    setLoading(false);
  }

  useEffect(() => {
    router.events.on("routeChangeStart", runLoader);
    router.events.on("routeChangeError", removeLoader);
    router.events.on("routeChangeComplete", removeLoader);

    () => {
      router.events.off("routeChangeStart", runLoader);
      router.events.off("routeChangeError", removeLoader);
      router.events.off("routeChangeComplete", removeLoader);
    };
  }, [router]);

  return (
    <div id="body">
      <ModalContext.Provider value={[runModal, removeModal]}>
        <NotePadContext.Provider value={addNote}>
          <UserContext.Provider value={[user, setUser]}>
            <Modal />
            <NotePad />
            {loading && <Loader />}
            {children}
          </UserContext.Provider>
        </NotePadContext.Provider>
      </ModalContext.Provider>
    </div>
  );
};

export default App;
