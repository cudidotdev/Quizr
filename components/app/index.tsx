import React from "react";
import useModal from "hooks/modal";

export const ModalContext = React.createContext<[() => void, () => void]>([
  () => {},
  () => {},
]);

const App: React.FC = ({ children }) => {
  const [Modal, runModal, removeModal] = useModal();
  return (
    <ModalContext.Provider value={[runModal, removeModal]}>
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};

export default App;
