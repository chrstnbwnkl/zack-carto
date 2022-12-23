import React, { ReactElement } from "react"
import { OSMTags } from "../../config"
import { makeReadableEnumeration } from "../../utils/misc"
import { TagConfig } from "../../utils/osm"

import "./ConfigureItem.css"

interface ConfirgureItemProps {
  config: TagConfig
  itemKey: OSMTags
  sliderVal: number
  onSliderChange: (itemKey: OSMTags, newVal: string) => void
}
const ConfigureItem = ({
  config,
  itemKey,
  sliderVal,
  onSliderChange,
}: ConfirgureItemProps): ReactElement => {
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
          onChange={(e) => onSliderChange(itemKey, e.target.value)}
        ></input>
      </div>
      <p>{selectText}</p>
    </div>
  )
}

export default ConfigureItem
