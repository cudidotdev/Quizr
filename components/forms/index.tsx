import { EyeOpenIcon, EyeClosedIcon, SearchIcon } from "components/icons";
import React, { useRef, useState } from "react";
import styles from "styles/components/forms.module.css";
import type { inputr, submitr, textarea } from "types/components/form";

export const Inputr: React.FC<inputr> = (props) => {
  const { label = "", name, onChange, type = "text", Icon, clickFn } = props;
  const cstm = useRef<HTMLDivElement>(null);

  return (
    <div className={`${styles.Cstm}`} ref={cstm}>
      <label htmlFor={name}>{label}</label>
      <div className={`${styles.InputBox}`}>
        <input
          {...props}
          autoComplete={props.autoComplete || "off"}
          type={type}
          id={name}
          name={name}
          onChange={(ev: any) => onChange && onChange(ev.target.value)}
          onFocus={() => cstm.current?.classList.add(styles.Color)}
          onBlur={() => cstm.current?.classList.remove(styles.Color)}
        />
        {!!Icon && (
          <button
            type="button"
            className={`${styles.IconBox}  disable-focus-outline `}
            onClick={() => clickFn && clickFn()}
          >
            <Icon />
          </button>
        )}
      </div>
    </div>
  );
};

export const Searchr: React.FC<inputr> = (props) => {
  const { label = "Search", clickFn } = props;
  return (
    <Inputr
      {...props}
      label={label}
      Icon={SearchIcon}
      clickFn={clickFn}
      onKeyDown={(ev: any) => ev.key === "Enter" && clickFn && clickFn()}
    />
  );
};

export const Passwordr: React.FC<inputr> = (props) => {
  const { label = "Password" } = props;
  const [visible, setVisible] = useState<boolean>(false);

  function clickFn() {
    setVisible((visibility) => !visibility);
  }

  return (
    <Inputr
      {...props}
      label={label}
      type={visible ? "text" : "password"}
      Icon={visible ? EyeClosedIcon : EyeOpenIcon}
      clickFn={clickFn}
    />
  );
};

export const Submitr: React.FC<submitr> = (props) => {
  return (
    <button
      {...props}
      type="submit"
      className={`${styles.Cstm} ${styles.Submit} ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export const TextArea: React.FC<textarea> = (props) => {
  const { label = "", name, onChange, height } = props;
  const cstm = useRef<HTMLDivElement>(null);

  return (
    <div className={`${styles.Cstm}`} ref={cstm}>
      <label htmlFor={name}>{label}</label>
      <div className={`${styles.InputBox}`}>
        <textarea
          {...props}
          id={name}
          name={name}
          onChange={(ev: any) => onChange && onChange(ev.target.value)}
          onFocus={() => cstm.current?.classList.add(styles.Color)}
          onBlur={() => cstm.current?.classList.remove(styles.Color)}
          style={{ height: `${height || "300px"}` }}
          className={`${props.className || ""} hide-scroll`}
        />
      </div>
    </div>
  );
};

export { default as Selectr } from "./selectr";
export { Option } from "./selectr";
