import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlay,
  faSpinner,
  faDownload,
} from "@fortawesome/free-solid-svg-icons"

import "./TopBar.css"
import UploadForm from "../UploadForm/UploadForm"

const TopBar = ({ onRun, onDownload, isLoading, isDownloadable, onUpload }) => {
  const icon = isLoading ? faSpinner : faPlay
  const iconClassName = isLoading ? "spinner" : ""
  const dlBtnClassName = `btn-export ${isDownloadable ? "" : "greyed-out"}`
  console.log(isDownloadable)
  return (
    <>
      <div className="control-wrapper">
        <button
          className="btn-run"
          onClick={() => onRun()}
          title="Run overpass query"
        >
          <b>Run &nbsp;</b>
          <FontAwesomeIcon icon={icon} className={iconClassName} />
        </button>
        <button
          className={dlBtnClassName}
          onClick={() => onDownload()}
          title={
            isDownloadable ? "Download as SVG" : "You need to run a query first"
          }
        >
          <b>Download SVG &nbsp;</b>
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>
      <div className="headline-wrapper">
        <div className="headline">
          <div className="title-wrapper">
            <h1>
              Zack&nbsp;⚡&nbsp;[<i>t͡sak</i>]
            </h1>
            <p>
              (from German, exclaimed when something needs to happen instantly)
            </p>
          </div>
        </div>
        <UploadForm onUpload={onUpload} />
      </div>
    </>
  )
}

export default TopBar
