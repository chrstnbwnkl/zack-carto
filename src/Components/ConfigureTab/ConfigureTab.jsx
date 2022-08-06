import React from "react"

import ConfigureItem from "../ConfigureItem/ConfigureItem"

import "./ConfigureTab.css"

const ConfigureTab = ({
  roadSliderVal,
  onRoadSliderChange,
  riverSliderVal,
  onRiverSliderChange,
  citiesSliderVal,
  onCitiesSliderChange,
  error,
}) => {
  const errorClsName = `error-message ${error ? "visible" : "hidden"}`
  return (
    <>
      <div className="configure-item-wrapper">
        <ConfigureItem
          type="Roads"
          sliderVal={roadSliderVal}
          onSliderChange={onRoadSliderChange}
        />
        <hr />
        <ConfigureItem
          type="Waterways"
          sliderVal={riverSliderVal}
          onSliderChange={onRiverSliderChange}
        />
        <hr />
        <ConfigureItem
          type="Places"
          sliderVal={citiesSliderVal}
          onSliderChange={onCitiesSliderChange}
        />
      </div>
      <div className={errorClsName}>
        <p>{error}</p>
      </div>
    </>
  )
}

export default ConfigureTab
