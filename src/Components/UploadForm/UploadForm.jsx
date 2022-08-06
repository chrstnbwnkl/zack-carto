import React from "react"

import "./UploadForm.css"

const UploadForm = ({ onUpload }) => {
  const [dragActive, setDragActive] = React.useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
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
      disabled={true}
      title="Feature Coming Soon"
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
