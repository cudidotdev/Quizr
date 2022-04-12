import React, { useState } from "react";
import styles from "styles/components/modal.module.css";

export default function useModal(): [React.FC, () => void, () => void] {
  const [disp, setDisp] = useState<boolean>(false);

  function runModal() {
    setDisp(true);
  }
  function removeModal() {
    setDisp(false);
  }

  const Modal: React.FC = () => {
    return (
      <div
        className={`${disp ? styles.ModalContainer : ""}`}
        onClick={removeModal}
      ></div>
    );
  };

  return [Modal, runModal, removeModal];
}
