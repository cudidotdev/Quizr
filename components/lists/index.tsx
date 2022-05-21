import { Linkr } from "components/links";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "styles/components/lists.module.css";
import { linkr } from "types/components/link";

interface list
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  start?: number;
  reverse?: boolean;
}

const ListContainer: React.FC<list> = (props) => {
  const { children, start = 1, reverse = false } = props;
  const [width, setWidth] = useState<number | undefined>();
  const listContainer = useRef<HTMLDivElement>(null);
  const n_children = useMemo(() => React.Children.count(children), [children]);

  function resetWidth() {
    setWidth(listContainer.current?.parentElement?.clientWidth);
  }

  useLayoutEffect(() => {
    resetWidth();
    window.addEventListener("resize", resetWidth);
    () => window.removeEventListener("resize", resetWidth);
  }, []);

  useEffect(() => {
    setTimeout(resetWidth, 1000);
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
        React.cloneElement(child, {
          index: reverse ? start - 1 - index : index + (start - 1),
        })
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
