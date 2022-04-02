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
}) => {
  const cstm = useRef<HTMLDivElement>(null);
  return (
    <div className={`${styles.Cstm}`} ref={cstm}>
      <label htmlFor={name}>{label}:</label>
      <div className={`${styles.InputBox}`}>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={(ev: any) => setValue && setValue(ev.target.value)}
          onFocus={() =>
            //@ts-ignore
            (cstm.current?.style.color = "var(--color-primary-one)")
          }
          onBlur={() =>
            //@ts-ignore
            (cstm.current?.style.color = "var(--color-grey-one)")
          }
        />
        {!!Icon && (
          <button
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
}) => (
  <Inputr
    label={label}
    name={name}
    value={value}
    setValue={setValue}
    Icon={SearchIcon}
    clickFn={clickFn}
  />
);

export const Passwordr: React.FC<searchr> = ({
  label = "Password",
  name,
  value,
  setValue,
  clickFn = () => {},
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  function _clickFn() {
    clickFn();
    setVisible((visibility) => !visibility);
  }

  return (
    <Inputr
      label={label}
      name={name}
      value={value}
      setValue={setValue}
      Icon={visible ? EyeClosedIcon : EyeOpenIcon}
      clickFn={_clickFn}
    />
  );
};
