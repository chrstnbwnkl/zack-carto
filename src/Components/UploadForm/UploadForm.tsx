import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";

// import "./UploadForm.css"

interface UploadFormProps {
  onUpload: (fileList: FileList) => void;
}
const UploadForm = ({ onUpload }: UploadFormProps): ReactElement => {
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
      console.log(e.dataTransfer.files);
      onUpload(e.dataTransfer.files);
    }
  };
  return (
    <button className="border-1 flex flex-1 cursor-default justify-center self-center first:mr-auto last:ml-auto lg:p-2">
      <form
        id="form-geojson-upload"
        onDragEnter={(e) => handleDrag(e)}
        title="Drag and drop your own GeoJSON here"
        className={`border-1 relative m-1 h-full cursor-help rounded-md border-white p-2 align-middle text-white shadow-white drop-shadow-md  ${
          dragActive ? "bg-orange" : "bg-orange"
        }`}
      >
        <input
          type="file"
          className="hidden"
          id="input-geojson-upload"
          multiple={true}
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
            id="drag-pseudo-element"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
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
