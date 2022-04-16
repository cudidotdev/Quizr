import React from "react";
import styles from "styles/components/loaders.module.css";

export const TripleSquareLoader: React.FC<{ colored?: boolean }> = ({
  colored,
}) => (
  <span
    className={`${styles.TripleSquareLoader} ${colored ? styles.Colored : ""}`}
  >
    <span></span>
    <span></span>
    <span></span>
  </span>
);
