import React, { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";

const Footer = ({ className }: { className: string }): ReactElement => {
  return (
    <footer className={className}>
      <span className="self-end font-light text-blue">
        © <a href="https://github.com/chrstnbwnkl">Christian Beiwinkel</a>{" "}
        {new Date().getFullYear()}
      </span>
      <div className="absolute  left-full -translate-x-20 transform">
        <label
          htmlFor="settings-modal"
          className="relative m-1 h-8 w-12  rounded-md border-2 border-blue-90 bg-white drop-shadow-md transition-colors hover:bg-blue-90"
        >
          <FontAwesomeIcon icon={faGear} color="#1D3557" />
        </label>
      </div>
    </footer>
  );
};

export default Footer;
