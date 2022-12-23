import React, { ReactElement } from "react"

import "./Footer.css"

const Footer = (): ReactElement => {
  return (
    <footer>
      <div className="copyright">
        <p>
          © <a href="https://github.com/chrstnbwnkl">Christian Beiwinkel</a>{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}

export default Footer
