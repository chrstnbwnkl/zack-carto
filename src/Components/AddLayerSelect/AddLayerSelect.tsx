import React from "react";
import { OSMTags, ZackConfig } from "../../config";
import { Layer } from "../../utils/osm";

interface AddLayerSelectProps {
  onConfigUpdate: (
    itemKey: OSMTags,
    configKey: keyof Layer,
    value: string | number | boolean
  ) => void;
  config: ZackConfig;
}

const AddLayerSelect = ({ onConfigUpdate, config }: AddLayerSelectProps) => {
  return (
    <>
      <label className="label"></label>
      <select
        className="select-bordered select border-2 border-blue-90 text-blue drop-shadow-lg animate-daisyPop"
        defaultValue="default"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          e.preventDefault();
          e.target.value = "default"; // set placeholder as selected value
        }}
      >
        <option key="default" value="default" disabled>
          Add layer
        </option>
        {(Object.keys(config) as OSMTags[])
          .filter((k) => !config[k].active)
          .map((k) => {
            const c: Layer = config[k];
            return (
              <option
                key={k}
                onClick={(e: React.MouseEvent<HTMLOptionElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onConfigUpdate(k, "active", true);
                }}
              >
                {c.title}
              </option>
            );
          })}
      </select>
    </>
  );
};

export default AddLayerSelect;
