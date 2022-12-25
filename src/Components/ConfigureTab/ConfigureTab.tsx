import React, { ReactElement } from "react";
import { OSMTags, ZackConfig } from "../../config";

import ConfigureItem from "../ConfigureItem/ConfigureItem";

interface ConfigureTabProps {
  config: ZackConfig;
  handleSlidersChanged: (itemKey: OSMTags, newVal: string) => void;
}
const ConfigureTab = ({
  config,
  handleSlidersChanged,
}: ConfigureTabProps): ReactElement => {
  return (
    <>
      <div className="p-3">
        {(Object.keys(config) as (keyof ZackConfig)[]).map((k) => {
          const c = config[k];
          return (
            <div key={k} className="py-2">
              <ConfigureItem
                key={k}
                itemKey={k}
                config={c}
                sliderVal={config[k].detail}
                onSliderChange={handleSlidersChanged}
              />
              <hr key={`${k}--hr`} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ConfigureTab;
