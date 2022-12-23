import React, { ReactElement } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlay,
  faSpinner,
  faDownload,
} from "@fortawesome/free-solid-svg-icons"

import { ReactComponent as Lightning } from "../../assets/img/twemoji-26a1.svg"

import "./Header.css"
import UploadForm from "../UploadForm/UploadForm"

interface HeaderProps {
  onRun: () => void
  onDownload: () => void
  isLoading: boolean
  onUpload: (fileList: FileList) => void
  isDownloadable: boolean
}

const Header = ({
  onRun,
  onDownload,
  isLoading,
  isDownloadable,
  onUpload,
}: HeaderProps): ReactElement => {
  const icon = isLoading ? faSpinner : faPlay
  const iconClassName = isLoading ? "spinner" : ""
  const dlBtnClassName = `btn-export ${isDownloadable ? "" : "greyed-out"}`
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
              <a
                href="https://github.com/chrstnbwnkl/zack-carto"
                target="blank"
              >
                Zack&nbsp;
                <span>
                  <Lightning
                    style={{
                      height: "1em",
                      position: "relative",
                      top: "0.2em",
                    }}
                  />
                </span>
                &nbsp;[<i>t͡sak</i>]
              </a>
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

export default Header
