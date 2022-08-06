import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlay,
  faSpinner,
  faDownload,
} from "@fortawesome/free-solid-svg-icons"

import "./TopBar.css"

const TopBar = ({ onRun, onDownload, isLoading, isDownloadable }) => {
  const icon = isLoading ? faSpinner : faPlay
  const iconClassName = isLoading ? "spinner" : ""
  const dlBtnClassName = `btn-export ${isDownloadable ? "" : "greyed-out"}`
  return (
    <>
      <div className="control-wrapper">
        <button className="btn-run" onClick={() => onRun()}>
          <b>Run &nbsp;</b>
          <FontAwesomeIcon icon={icon} className={iconClassName} />
        </button>
        <button className={dlBtnClassName} onClick={() => onDownload()}>
          <b>Download SVG &nbsp;</b>
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>
      <div className="headline">
        <h1>
          Zack ⚡ [<i>t͡sak</i>]
        </h1>
      </div>
    </>
  )
}

export default TopBar
