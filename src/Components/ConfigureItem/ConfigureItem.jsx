import React from "react"
import { makeReadableEnumeration, QUERY_MAP } from "../../utils/queryMap"

import "./ConfigureItem.css"

const ConfigureItem = ({ type, sliderVal, onSliderChange }) => {
  const selectText = makeReadableEnumeration(
    QUERY_MAP[type].text_repr,
    sliderVal
  )
  return (
    <div className="configure-item">
      <div className="header">
        <p>
          <b>{type}: </b>
        </p>
      </div>
      <div className="slider">
        <input
          type="range"
          min={0}
          max={QUERY_MAP[type].text_repr.length - 1}
          value={sliderVal}
          onChange={(e) => onSliderChange(Number(e.target.value))}
        ></input>
      </div>
      <p>{selectText}</p>
    </div>
  )
}

export default ConfigureItem
