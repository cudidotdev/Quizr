import { TripleSquareLoader } from "components/loaders";
import React from "react";
import styles from "styles/components/buttons.module.css";

export const LoadButton = () => (
  <div className={styles.LoadButton}>
    <span className={styles.Text}>Loading</span>
    <TripleSquareLoader />
  </div>
);
