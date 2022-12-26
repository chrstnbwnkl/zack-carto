import React, { ReactElement } from "react";

interface ButtonProps {
  additionalClasses?: string;
  onClick?: () => void;
  title?: string;
  children?: JSX.Element | JSX.Element[];
  disabled?: boolean;
}

const Button = ({
  additionalClasses,
  onClick,
  title,
  disabled,
  ...props
}: ButtonProps): ReactElement => {
  return (
    <button
      //   className={`relative m-1 h-full w-20 rounded-md border-2  bg-white p-2 drop-shadow-md transition-colors hover:bg-green md:w-12 ${additionalClasses}`}
      className={`relative m-1 h-full rounded-md border-2  bg-white drop-shadow-md transition-colors ${
        additionalClasses ?? ""
      }`}
      onClick={onClick ? () => onClick() : () => {}}
      title={title}
      disabled={disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
