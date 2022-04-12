import { EyeOpenIcon, EyeClosedIcon, SearchIcon } from "components/icons";
import React, { useRef, useState } from "react";
import styles from "styles/components/forms.module.css";
import type { inputr, searchr } from "types/components/form";

export const Inputr: React.FC<inputr> = ({
  label,
  name,
  value,
  setValue,
  type = "text",
  Icon,
  clickFn,
  passProps = {},
  required,
}) => {
  const cstm = useRef<HTMLDivElement>(null);

  return (
    <div className={`${styles.Cstm}`} ref={cstm}>
      <label htmlFor={name}>{label}</label>
      <div className={`${styles.InputBox}`}>
        <input
          autoComplete="off"
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={(ev: any) => setValue && setValue(ev.target.value)}
          onFocus={() => cstm.current?.classList.add(styles.Color)}
          onBlur={() => cstm.current?.classList.remove(styles.Color)}
          {...passProps}
          required={required}
        />
        {!!Icon && (
          <button
            type="button"
            className={`${styles.IconBox} disable-focus-outline`}
            onClick={() => clickFn && clickFn()}
          >
            <Icon />
          </button>
        )}
      </div>
    </div>
  );
};

export const Searchr: React.FC<searchr> = ({
  label = "Search",
  name,
  value,
  setValue,
  clickFn,
  passProps = {},
  required,
}) => (
  <Inputr
    label={label}
    name={name}
    value={value}
    setValue={setValue}
    Icon={SearchIcon}
    clickFn={clickFn}
    passProps={{
      ...passProps,
      onKeyDown: (ev: any) => ev.key === "Enter" && clickFn && clickFn(),
    }}
    required
  />
);

export const Passwordr: React.FC<searchr> = ({
  label = "Password",
  name,
  value,
  setValue,
  passProps = {},
  clickFn = () => {},
  required,
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  function _clickFn() {
    clickFn();
    setVisible((visibility) => !visibility);
  }

  return (
    <Inputr
      label={label}
      type={visible ? "text" : "password"}
      name={name}
      value={value}
      setValue={setValue}
      Icon={visible ? EyeClosedIcon : EyeOpenIcon}
      clickFn={_clickFn}
      passProps={passProps}
      required
    />
  );
};

export const Sumbitr: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, form = "" }) => {
  return (
    <button
      type="submit"
      form={form}
      className={`${styles.Cstm} ${styles.Submit}`}
    >
      {children}
    </button>
  );
};

export { default as Selectr } from "./selectr";
export { Option } from "./selectr";
