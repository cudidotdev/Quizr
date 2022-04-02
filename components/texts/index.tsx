import React from "react";
import styles from "styles/components/texts.module.css";

export const TextBlock: React.FC = ({ children }) => {
  return <div className={styles.TextBlock}>{children}</div>;
};
