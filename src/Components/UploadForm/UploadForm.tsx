import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";

interface UploadFormProps {
  onUpload: (fileList: FileList) => void;
  className?: string;
}

const UploadForm: React.FC<UploadFormProps> = ({
  onUpload,
  className,
}): ReactElement => {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files) {
      onUpload(e.target.files);
    }
  };
  return (
    <button
      className={`${
        className || ""
      } border-1 flex flex-1 cursor-default justify-center self-center first:mr-auto last:ml-auto lg:p-2`}
    >
      <form
        onDragEnter={(e) => handleDrag(e)}
        title="Drag and drop your own GeoJSON here"
        className={`relative m-1 h-full animate-daisyPop cursor-help rounded-md border-2 border-orange p-2 align-middle text-blue shadow-white drop-shadow-md transition-colors lg:w-20 md:w-12  ${
          dragActive ? "bg-orange" : "bg-white"
        }`}
      >
        <input
          type="file"
          className="hidden"
          id="input-geojson-upload"
          multiple={true}
          accept=".geojson,.json"
          onChange={(e) => {
            handleFileSelect(e);
          }}
        />
        <label
          id="label-geojson-upload"
          className="cursor-help"
          htmlFor="input-geojson-upload"
        >
          <b className="lg:hidden">Upload GeoJSON &nbsp;</b>
          <FontAwesomeIcon icon={faUpload} />
        </label>
        {dragActive && (
          <div
            className="absolute top-0 left-0 h-full w-full"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
    </button>
  );
};

export default UploadForm;
