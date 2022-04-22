import React, { ReactElement, useState } from "react";
import styles from "styles/components/modal.module.css";

export default function useModal(): [
  React.FC,
  (elem: ReactElement) => void,
  () => void
] {
  const [disp, setDisp] = useState<boolean>(false);
  const [child, setChild] = useState<ReactElement>();
  const [isNew, setNew] = useState<boolean>();

  function runModal(elem: ReactElement) {
    setDisp(true);
    setChild(elem);
  }
  function removeModal() {
    setDisp(false);
  }

  const Modal: React.FC = () => {
    return (
      <div
        className={`${disp ? styles.ModalContainer : ""}`}
        onClick={removeModal}
      >
        {disp && (
          <div
            onClick={(ev) => ev.stopPropagation()}
            className={styles.ModalChild}
          >
            {child}
          </div>
        )}
      </div>
    );
  };

  return [Modal, runModal, removeModal];
}
