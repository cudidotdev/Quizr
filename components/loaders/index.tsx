import React from "react";
import styles from "styles/components/loaders.module.css";

export const TripleSquareLoader: React.FC<{
  colored?: boolean;
  t_colored?: boolean;
}> = ({ colored, t_colored }) => (
  <span
    className={`${styles.TripleSquareLoader} ${colored ? styles.Colored : ""} ${
      t_colored ? styles.TColored : ""
    }`}
  >
    <span></span>
    <span></span>
    <span></span>
  </span>
);
