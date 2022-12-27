import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { OSMTags } from "../../config";
import { makeReadableEnumeration } from "../../utils/misc";
import { TagConfig } from "../../utils/osm";

interface ConfirgureItemProps {
  config: TagConfig;
  itemKey: OSMTags;
  sliderVal: number;
  onConfigUpdate: (
    configKey: keyof TagConfig,
    value: string | number | boolean
  ) => void;
}
const ConfigureItem = ({
  config,
  itemKey,
  sliderVal,
  onConfigUpdate,
}: ConfirgureItemProps): ReactElement => {
  console.log(config.values);
  console.log(config.displayNames);
  const selectText = makeReadableEnumeration(config.displayNames, sliderVal);
  return (
    <div className="flex justify-between">
      <div className="w-5/6 pb-3">
        <div className="header">
          <p>
            <b>{config.title}: </b>
          </p>
        </div>
        <div>
          <input
            type="range"
            min={0}
            max={config.values.length - 1}
            value={sliderVal}
            onChange={(e) => onConfigUpdate("detail", Number(e.target.value))}
            className="range range-primary range-sm"
          ></input>
        </div>
        <p className="rounded-lg border-2 border-transparent bg-blue-10 p-1 text-blue-90 md:hidden">
          {selectText}
        </p>
      </div>
      <div className="flex pr-6">
        <FontAwesomeIcon
          size="xl"
          color="#C2C2C2"
          icon={faTrash}
          className="cursor-pointer self-center"
          onClick={() => onConfigUpdate("active", false)}
        />
      </div>
    </div>
  );
};

export default ConfigureItem;
