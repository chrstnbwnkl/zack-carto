import React, { useState } from "react"
import L from "leaflet"
import Map from "./Components/Map/Map"
import TopBar from "./Components/TopBar/TopBar"
import Footer from "./Components/Footer/Footer"
import { toFeatureCollection, queryOverpass } from "./utils/api.js"

import "./App.scss"
import ConfigureTab from "./Components/ConfigureTab/ConfigureTab"
import { useLocalStorage } from "./utils/hooks"

export const App = ({ config }) => {
  const [mapDefaults, setMapDefaults] = useLocalStorage(
    "mapstate",
    JSON.stringify({ center: [50.93, 6.95], zoom: 13 })
  )
  const [bounds, setBounds] = useState(null)
  const [runBounds, setRunBounds] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [featureCollections, setFeatureCollections] = useState(null)
  const [uploadedGeoJSON, setUploadedGeoJSON] = useState([])
  const [updatedConfig, setUpdatedConfig] = useState(config)

  const handleRun = () => {
    setIsLoading(true)
    setRunBounds(bounds)
    if (Object.values(updatedConfig).every((v) => v._detail === 0)) {
      setError(
        "Query cannot be empty: please increase at least one of the sliders."
      )
      setIsLoading(false)
      setTimeout(() => {
        setError("")
      }, 5000)
      return
    }
    setError("")

    queryOverpass(updatedConfig, bounds)
      .then((res) => {
        setFeatureCollections(
          Object.keys(config).reduce((prev, k) => {
            const c = config[k]
            return {
              ...prev,
              [k]: toFeatureCollection(res.data.elements.filter(c.filter)),
            }
          }, {})
        )
        setIsLoading(false)
      })
      .catch((reason) => {
        console.log(reason)
        setIsLoading(false)
        setError("Something went wrong while fetching the data.")
      })
  }
  const handleDownload = () => {
    const a = document.createElement("a")
    a.style.display = "none"

    const w = new Worker(new URL("./workers/prepareSVG.jsx", import.meta.url))
    const data = {
      fc: featureCollections,
      uploadedGeoJSON,
      config: JSON.stringify(updatedConfig),
      bounds: L.rectangle(runBounds).toGeoJSON(),
    }
    console.log(data)
    w.postMessage(data)

    w.onmessage = (svg) => {
      a.href = window.URL.createObjectURL(
        new Blob([svg.data], { type: "text/plain" })
      )
      a.setAttribute("download", "zack-download.svg")

      a.click()

      window.URL.revokeObjectURL(a.href)
    }
  }

  const handleMove = (bounds, center, zoom) => {
    setBounds(bounds)

    // protect when called explicitly before map moved
    if (center && zoom) {
      setMapDefaults(JSON.stringify({ center: center, zoom: zoom }))
    }
  }

  const handleUpload = (fileArray) => {
    const promises = Array.prototype.map.call(fileArray, (file) => {
      return new Promise((resolve, reject) => {
        file
          .text()
          .then((geojsonStr) => {
            resolve(geojsonStr)
          })
          .catch((err) => reject(err))
      })
    })
    Promise.all(promises).then((geojsonStrs) => {
      setUploadedGeoJSON((current) => {
        return [
          ...current,
          ...geojsonStrs.reduce((prev, str) => {
            return [...prev, JSON.parse(str)]
          }, []),
        ]
      })
    })
  }
  return (
    <div className="app">
      <TopBar
        onRun={handleRun}
        onDownload={handleDownload}
        isLoading={isLoading}
        isDownloadable={Boolean(featureCollections)}
        onUpload={handleUpload}
      />
      <Map
        view={JSON.parse(mapDefaults)}
        onMove={handleMove}
        featureCollections={featureCollections}
        uploadedGeoJSON={uploadedGeoJSON}
        config={updatedConfig}
        error={error}
      />
      <div className="config-wrapper">
        <h3>Geodata to SVG within seconds</h3>
        <p>
          Pick a level of detail for each category, run the query, and download
          it as SVG. Read more about how it works{" "}
          <a href="https://github.com/chrstnbwnkl/zack-carto/blob/main/README.md">
            here
          </a>
          .
        </p>
        <ConfigureTab
          config={updatedConfig}
          handleSlidersChanged={setUpdatedConfig}
        />
      </div>
      <Footer />
    </div>
  )
}
