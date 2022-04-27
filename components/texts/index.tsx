import React from "react";
import styles from "styles/components/texts.module.css";

export const TextBlock: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
> = (props) => {
  return (
    <p {...props} className={`${styles.TextBlock} ${props.className || ""}`}>
      {props.children}
    </p>
  );
};
