import React, { ReactElement } from "react";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  title?: string;
  children?: JSX.Element | JSX.Element[];
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  onClick,
  title,
  disabled,
  ...props
}): ReactElement => {
  return (
    <button
      className={`btn normal-case relative m-1 rounded-md border-2  bg-white drop-shadow-md transition-colors ${
        className || ""
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
