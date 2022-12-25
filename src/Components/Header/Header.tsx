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
import Button from "../Button/Button";

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
    <header className="flex h-24 w-full flex-row content-center justify-between space-x-1 border-b border-blue-90 bg-blue-50">
      <div className="flex flex-1 flex-row justify-evenly self-center first:mr-auto last:ml-auto lg:p-2">
        <Button
          additionalClasses={`relative m-1 h-full w-20 border-green p-2 drop-shadow-md hover:bg-green md:w-12`}
          onClick={onRun}
          title="Run overpass query"
        >
          <b className="text-blue lg:hidden">Run &nbsp;</b>
          <FontAwesomeIcon
            icon={icon}
            className={iconClassName}
            color="#1D3557"
          />
        </Button>
        <Button
          additionalClasses={`relative m-1 h-full w-40 p-2 lg:w-20  md:w-12 ${
            isDownloadable
              ? "border-red bg-white hover:bg-red"
              : "cursor-help border-gray bg-gray"
          }`}
          disabled={!isDownloadable}
          onClick={() => onDownload()}
          title={
            isDownloadable ? "Download as SVG" : "You need to run a query first"
          }
        >
          <b className="text-blue lg:hidden">Download SVG &nbsp;</b>
          <FontAwesomeIcon icon={faDownload} color="#1D3557" />
        </Button>
      </div>
      <div className="headline-wrapper self-center text-center">
        <h1 className="text-3xl font-bold text-blue drop-shadow hover:underline">
          <a href="https://github.com/chrstnbwnkl/zack-carto" target="blank">
            Zack
            <span className="sm:hidden">
              &nbsp;
              <Lightning
                style={{
                  height: "1em",
                  display: "inline",
                }}
              />
              &nbsp;[<i>t͡sak</i>]
            </span>
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
