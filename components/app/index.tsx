import React from "react";
import useModal from "hooks/modal";
import useUser from "hooks/user";

export const ModalContext = React.createContext<[() => void, () => void]>([
  () => {},
  () => {},
]);
//@ts-ignore
export const UserContext = React.createContext<[any, React.Dispatch<any>]>([]);

const App: React.FC = ({ children }) => {
  const [Modal, runModal, removeModal] = useModal();
  const [user, setUser] = useUser();

  return (
    <UserContext.Provider value={[user, setUser]}>
      <ModalContext.Provider value={[runModal, removeModal]}>
        <Modal />
        {children}
      </ModalContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
