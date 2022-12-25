import React, { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faSpinner,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

import { ReactComponent as Lightning } from "../../assets/img/twemoji-26a1.svg";

// import "./Header.css"
import UploadForm from "../UploadForm/UploadForm";

interface HeaderProps {
  onRun: () => void;
  onDownload: () => void;
  isLoading: boolean;
  onUpload: (fileList: FileList) => void;
  isDownloadable: boolean;
}

const Header = ({
  onRun,
  onDownload,
  isLoading,
  isDownloadable,
  onUpload,
}: HeaderProps): ReactElement => {
  const icon = isLoading ? faSpinner : faPlay;
  const iconClassName = isLoading ? "animate-spin" : "";

  return (
    <header className="flex h-24 flex-row content-center justify-between space-x-1 bg-blue-50">
      <div className="flex flex-1 flex-row justify-evenly self-center first:mr-auto last:ml-auto lg:p-2">
        <button
          className={`relative m-1 h-full w-20 rounded-md border-2 border-green bg-white p-2 shadow-white drop-shadow-md transition-colors hover:bg-green md:w-12`}
          onClick={() => onRun()}
          title="Run overpass query"
        >
          <b className="text-blue lg:hidden">Run &nbsp;</b>
          <FontAwesomeIcon
            icon={icon}
            className={iconClassName}
            color="#1D3557"
          />
        </button>
        <button
          className={`relative m-1 h-full rounded-md border-2 bg-white p-2 text-white shadow-white drop-shadow-md transition-colors hover:bg-red md:w-12 ${
            isDownloadable ? "border-red" : "cursor-help bg-gray"
          }`}
          disabled={!isDownloadable}
          onClick={() => onDownload()}
          title={
            isDownloadable ? "Download as SVG" : "You need to run a query first"
          }
        >
          <b className="text-blue lg:hidden">Download SVG &nbsp;</b>
          <FontAwesomeIcon icon={faDownload} color="#1D3557" />
        </button>
      </div>
      <div className="headline-wrapper self-center text-center">
        <h1 className="text-3xl font-bold text-blue drop-shadow hover:underline">
          <a href="https://github.com/chrstnbwnkl/zack-carto" target="blank">
            Zack&nbsp;
            <Lightning
              style={{
                height: "1em",
                display: "inline",
              }}
            />
            &nbsp;[<i>t͡sak</i>]
          </a>
        </h1>
        <p className="m-1 text-xs text-blue lg:hidden">
          (from German, exclaimed when something needs to happen instantly)
        </p>
      </div>
      <UploadForm onUpload={onUpload} />
    </header>
  );
};

export default Header;
