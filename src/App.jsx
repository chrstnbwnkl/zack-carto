import React, { useState } from "react"
import Map from "./Components/Map/Map"
import TopBar from "./Components/TopBar/TopBar"
import Footer from "./Components/Footer/Footer"
import { to_valid_geojson, queryOverpass } from "./utils/api.js"

import "./App.scss"
import ConfigureTab from "./Components/ConfigureTab/ConfigureTab"
import { featuresToSvg } from "./utils/svg"

export const App = () => {
  const [bounds, setBounds] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [features, setFeatures] = useState(null)
  const [roadDetail, setRoadDetail] = useState(2)
  const [riverDetail, setRiverDetail] = useState(0)
  const [citiesDetail, setCitiesDetail] = useState(0)

  const reqObj = {
    Roads: roadDetail,
    Waterways: riverDetail,
    Places: citiesDetail,
  }

  const handleRun = () => {
    setIsLoading(true)
    if (Object.values(reqObj).every((v) => v === 0)) {
      setError("Query cannot be empty")
      setIsLoading(false)
      setTimeout(() => {
        setError("")
      }, 5000)
      return
    }
    setError("")
    queryOverpass(reqObj, bounds)
      .then((res) => {
        setFeatures(res.data.elements.map((el) => to_valid_geojson(el)))
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

    const svg = featuresToSvg(features)

    a.href = window.URL.createObjectURL(new Blob([svg], { type: "text/plain" }))
    a.setAttribute("download", "svg-zack.svg")

    a.click()

    window.URL.revokeObjectURL(a.href)
  }
  return (
    <div className="app">
      <TopBar
        onRun={handleRun}
        onDownload={handleDownload}
        isLoading={isLoading}
        isDownloadable={Boolean(features)}
      />
      <div className="mapContainer">
        <Map onMove={setBounds} features={features} />
      </div>
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
          roadSliderVal={roadDetail}
          onRoadSliderChange={setRoadDetail}
          riverSliderVal={riverDetail}
          onRiverSliderChange={setRiverDetail}
          citiesSliderVal={citiesDetail}
          onCitiesSliderChange={setCitiesDetail}
          error={error}
        />
      </div>
      <Footer />
    </div>
  )
}
