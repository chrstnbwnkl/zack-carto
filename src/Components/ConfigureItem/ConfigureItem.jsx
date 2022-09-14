import React from "react"
import { makeReadableEnumeration } from "../../utils/misc"

import "./ConfigureItem.css"

const ConfigureItem = ({ config, itemKey, sliderVal, onSliderChange }) => {
  const selectText = makeReadableEnumeration(config.displayNames, sliderVal)
  return (
    <div className="configure-item">
      <div className="header">
        <p>
          <b>{config.title}: </b>
        </p>
      </div>
      <div className="slider">
        <input
          type="range"
          min={0}
          max={config.values.length}
          value={sliderVal}
          onChange={(e) =>
            onSliderChange((current) => {
              return {
                ...current,
                [itemKey]: {
                  ...current[itemKey],
                  _detail: Number(e.target.value),
                },
              }
            })
          }
        ></input>
      </div>
      <p>{selectText}</p>
    </div>
  )
}

export default ConfigureItem
