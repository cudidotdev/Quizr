import React from "react";
import styles from "styles/components/texts.module.css";

export const TextBlock: React.FC = ({ children }) => {
  return <p className={styles.TextBlock}>{children}</p>;
};
