import { Linkr } from "components/links";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "styles/components/lists.module.css";
import { linkr } from "types/components/link";

const ListContainer: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  const { children } = props;
  const [width, setWidth] = useState<number | undefined>();
  const listContainer = useRef<HTMLDivElement>(null);

  function resetWidth() {
    setWidth(listContainer.current?.parentElement?.clientWidth);
  }

  useLayoutEffect(() => {
    resetWidth();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resetWidth);
    () => window.removeEventListener("resize", resetWidth);
  }, []);

  return (
    <div
      {...props}
      className={`${styles.ListContainer} ${props.className || ""} ${
        width! >= 768 ? styles.Large : ""
      }`}
      ref={listContainer}
    >
      {React.Children.map(children, (child: any, index) =>
        React.cloneElement(child, { index })
      )}
    </div>
  );
};

export const List: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  //@ts-ignore
  const { children, index } = props;

  return (
    <div {...props} className={`${styles.List} ${props.className || ""}`}>
      <div className={styles.Index}>{index + 1}</div>
      <div className={styles.Child}>{children}</div>
    </div>
  );
};

export const LinkList: React.FC<linkr> = (props) => {
  //@ts-ignore
  const { children, index, href = "#" } = props;

  return (
    <Linkr
      {...props}
      className={`${styles.List} ${props.className || ""} disable-focus-color`}
      href={href}
    >
      <div className={styles.Index}>{index + 1}</div>
      <div className={styles.Child}>{children}</div>
    </Linkr>
  );
};

export default ListContainer;
