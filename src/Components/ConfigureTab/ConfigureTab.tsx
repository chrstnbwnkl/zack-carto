import React, { ReactElement } from "react";
import { OSMTags, ZackConfig } from "../../config";
import { Layer } from "../../utils/osm";

import ConfigureItem from "../ConfigureItem/ConfigureItem";

interface ConfigureTabProps {
  config: ZackConfig;
  onConfigUpdate: (
    itemKey: OSMTags,
    configKey: keyof Layer,
    value: string | number | boolean
  ) => void;
}
const ConfigureTab = ({
  config,
  onConfigUpdate,
}: ConfigureTabProps): ReactElement => {
  return (
    <>
      <div className="p-3">
        {(Object.keys(config) as (keyof ZackConfig)[])
          .filter((k) => config[k].active)
          .map((k) => {
            const c = config[k];
            return (
              <div key={k} className="py-2">
                <ConfigureItem
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

export default ConfigureTab;
