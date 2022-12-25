import React, { ReactElement } from "react";

const Footer = ({ className }: { className: string }): ReactElement => {
  return (
    <footer className={className}>
      <p>
        © <a href="https://github.com/chrstnbwnkl">Christian Beiwinkel</a>{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
