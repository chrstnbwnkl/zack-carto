import React, { ReactElement } from "react";
import { OSMTags } from "../../config";
import { makeReadableEnumeration } from "../../utils/misc";
import { TagConfig } from "../../utils/osm";

interface ConfirgureItemProps {
  config: TagConfig;
  itemKey: OSMTags;
  sliderVal: number;
  onSliderChange: (itemKey: OSMTags, newVal: string) => void;
}
const ConfigureItem = ({
  config,
  itemKey,
  sliderVal,
  onSliderChange,
}: ConfirgureItemProps): ReactElement => {
  const selectText = makeReadableEnumeration(config.displayNames, sliderVal);
  return (
    <div className="pb-3">
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
          className="range range-primary range-sm"
        ></input>
      </div>
      <p className="rounded-lg border-2 border-transparent bg-blue-10 p-1 text-blue-90 md:hidden">
        {selectText}
      </p>
    </div>
  );
};

export default ConfigureItem;
