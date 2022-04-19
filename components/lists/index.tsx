import { Linkr } from "components/links";
import React from "react";
import styles from "styles/components/lists.module.css";

const List: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  const { children } = props;
  return (
    <div {...props} className={`${styles.ListContainer} ${props.className}`}>
      {React.Children.map(children, (child, index) => (
        <div className={styles.List} key={index}>
          <div className={styles.Index}>{index + 1}</div>
          <div className={styles.Child}>{child}</div>
        </div>
      ))}
    </div>
  );
};

export const LinkList: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  const { children } = props;
  return (
    <div {...props} className={`${styles.ListContainer} ${props.className}`}>
      {React.Children.map(children, (child: any, index) => (
        <Linkr
          className={`${styles.List} disable-focus-color`}
          key={index}
          href={`${child.props.id}`}
        >
          <div className={styles.Index}>{index + 1}</div>
          <div className={styles.Child}>{child}</div>
        </Linkr>
      ))}
    </div>
  );
};

export default List;
