import React, { ReactElement } from "react"

import "./UploadForm.css"

interface UploadFormProps {
  onUpload: (fileList: FileList) => void
}
const UploadForm = ({ onUpload }: UploadFormProps): ReactElement => {
  const [dragActive, setDragActive] = React.useState(false)

  const handleDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log(e.dataTransfer.files)
      onUpload(e.dataTransfer.files)
    }
  }
  return (
    <form
      id="form-geojson-upload"
      className={`btn-upload ${dragActive ? "drag-active" : ""}`}
      onDragEnter={(e) => handleDrag(e)}
      title="Drag and drop your own GeoJSON here"
    >
      <input type="file" id="input-geojson-upload" multiple={true} />
      <label id="label-geojson-upload" htmlFor="input-geojson-upload">
        <b>Upload GeoJSON</b>
      </label>
      {dragActive && (
        <div
          id="drag-pseudo-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  )
}

export default UploadForm
