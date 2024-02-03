import React, { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const Footer = ({ className }: { className: string }): ReactElement => {
  return (
    <footer className={className}>
      <span className="self-end font-light text-blue">
        © <a href="https://github.com/chrstnbwnkl">Christian Beiwinkel</a>{" "}
        {new Date().getFullYear()}
      </span>
      <div className="absolute right-6">
        <label
          htmlFor="settings-modal"
          className="m-1 flex h-8 w-8 cursor-pointer justify-center rounded-md border-2 border-blue-90 bg-white drop-shadow-md transition-colors hover:bg-blue-90"
        >
          <FontAwesomeIcon
            icon={faGear}
            color="#1D3557"
            className="self-center"
          />
        </label>
      </div>
    </footer>
  );
};

export default Footer;
