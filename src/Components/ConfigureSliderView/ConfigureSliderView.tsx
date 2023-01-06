import React, { ReactElement } from "react";
import { OSMTags, ZackConfig } from "../../config";
import { Layer } from "../../utils/osm";

import ConfigureSliderItem from "../ConfigureSliderItem/ConfigureSliderItem";

interface ConfigureSliderViewProps {
  config: ZackConfig;
  onConfigUpdate: (
    itemKey: OSMTags,
    configKey: keyof Layer,
    value: string | number | boolean
  ) => void;
}

const ConfigureSliderView = ({
  config,
  onConfigUpdate,
}: ConfigureSliderViewProps): ReactElement => {
  return (
    <>
      <div className="p-3">
        {(Object.keys(config) as (keyof ZackConfig)[])
          .filter((k) => config[k].active)
          .map((k) => {
            const c = config[k];
            return (
              <div key={k} className="py-2">
                <ConfigureSliderItem
                  key={k}
                  itemKey={k}
                  config={c}
                  sliderVal={config[k].detail}
                  onConfigUpdate={onConfigUpdate.bind(null, k)}
                />
                <hr key={`${k}--hr`} />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ConfigureSliderView;
