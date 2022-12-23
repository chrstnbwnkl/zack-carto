import React, { ReactElement } from "react"
import { OSMTags, ZackConfig } from "../../config"

import ConfigureItem from "../ConfigureItem/ConfigureItem"

import "./ConfigureTab.css"

interface ConfigureTabProps {
  config: ZackConfig
  handleSlidersChanged: (itemKey: OSMTags, newVal: string) => void
}
const ConfigureTab = ({
  config,
  handleSlidersChanged,
}: ConfigureTabProps): ReactElement => {
  return (
    <>
      <div className="configure-item-wrapper">
        {(Object.keys(config) as (keyof ZackConfig)[]).map((k) => {
          const c = config[k]
          return (
            <div key={k}>
              <ConfigureItem
                key={k}
                itemKey={k}
                config={c}
                sliderVal={config[k].detail}
                onSliderChange={handleSlidersChanged}
              />
              <hr key={`${k}--hr`} />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default ConfigureTab
