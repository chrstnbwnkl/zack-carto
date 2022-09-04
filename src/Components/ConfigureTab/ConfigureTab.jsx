import React from "react"

import ConfigureItem from "../ConfigureItem/ConfigureItem"

import "./ConfigureTab.css"

const ConfigureTab = ({ config, handleSlidersChanged, error }) => {
  const errorClsName = `error-message ${error ? "visible" : "hidden"}`
  return (
    <>
      <div className="configure-item-wrapper">
        {Object.keys(config).map((k) => {
          const c = config[k]
          return (
            <div key={k}>
              <ConfigureItem
                key={k}
                itemKey={k}
                config={c}
                sliderVal={config[k]._detail}
                onSliderChange={handleSlidersChanged}
              />
              <hr key={`${k}--hr`} />
            </div>
          )
        })}
      </div>
      <div className={errorClsName}>
        <p>{error}</p>
      </div>
    </>
  )
}

export default ConfigureTab
