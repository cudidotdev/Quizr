import React, { useEffect } from "react";
import useModal from "hooks/modal";
import useUser from "hooks/user";
import useNotePad from "hooks/notepad";
import { note } from "types/components/notepad";

export const ModalContext = React.createContext<[() => void, () => void]>([
  () => {},
  () => {},
]);
//@ts-ignore
export const UserContext = React.createContext<[any, React.Dispatch<any>]>([]);
export const NotePadContext = React.createContext<(note: note) => void>(
  () => {}
);

const App: React.FC = ({ children }) => {
  const [Modal, runModal, removeModal] = useModal();
  const [NotePad, addNote] = useNotePad();
  const [user, setUser] = useUser();

  return (
    <div id="body">
      <UserContext.Provider value={[user, setUser]}>
        <ModalContext.Provider value={[runModal, removeModal]}>
          <NotePadContext.Provider value={addNote}>
            <Modal />
            <NotePad />
            {children}
          </NotePadContext.Provider>
        </ModalContext.Provider>
      </UserContext.Provider>
    </div>
  );
};

export default App;
