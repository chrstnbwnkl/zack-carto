import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FeatureCollection } from "geojson";
import { LatLngBounds } from "leaflet";
import React, { useState } from "react";
import { OSMTags, ZackConfig } from "../../config";
import ConfigureTab from "../ConfigureTab/ConfigureTab";
import Error from "../Error/Error";
import Map from "../Map/Map";
import { TagConfig } from "../../utils/osm";
import Button from "../Button/Button";

interface MainContentProps {
  mapDefaults: string;
  handleMove: (
    bounds: LatLngBounds,
    center?: [number, number] | undefined,
    zoom?: number | undefined
  ) => void;
  featureCollections: { [k: string]: FeatureCollection };
  uploadedGeoJSON: FeatureCollection[];
  updatedConfig: ZackConfig;
  error: string;
  onConfigUpdate: (
    itemKey: OSMTags,
    configKey: keyof TagConfig,
    value: string | number | boolean
  ) => void;
}

const MainContent = ({
  mapDefaults,
  handleMove,
  featureCollections,
  uploadedGeoJSON,
  updatedConfig,
  error,
  onConfigUpdate,
}: MainContentProps) => {
  const [configPanelClosed, setConfigPanelClosed] = useState(false);

  const handleConfigPanelClose = () => {
    setConfigPanelClosed((curr) => !curr);
  };
  return (
    <div className="flex min-h-0 w-screen flex-1 md:flex-col">
      <div
        className={`relative flex w-4/12 flex-col justify-between overflow-y-auto md:order-2 md:w-full ${
          configPanelClosed ? "md:h-10 md:overflow-y-hidden" : "md:h-4/6"
        }`}
      >
        <button
          className={`absolute ${
            configPanelClosed
              ? "top-2 left-1/2 -translate-x-1/2 transform"
              : "top-4 right-4"
          } z-10 hidden cursor-pointer hover:animate-bounce md:block`}
          title="Hide config panel"
          onClick={handleConfigPanelClose}
        >
          <FontAwesomeIcon
            icon={configPanelClosed ? faChevronUp : faChevronDown}
          />
        </button>
        <div
          className={`transition-all ${
            configPanelClosed ? "md:h-0 md:opacity-0" : ""
          }`}
        >
          <h3 className="p-3 text-center text-xl font-bold">
            Geodata to SVG within seconds
          </h3>
          <p className="p-3">
            Pick a level of detail for each category, run the query, and
            download it as SVG. Read more about how it works{" "}
            <a
              className="underline"
              href="https://github.com/chrstnbwnkl/zack-carto/blob/main/README.md"
            >
              here
            </a>
            .
          </p>
          <ConfigureTab
            config={updatedConfig}
            onConfigUpdate={onConfigUpdate}
          />
          <div className="flex justify-center self-end p-4 ">
            <label className="label"></label>
            <select
              className="select-bordered select border-2 border-blue-90 text-blue drop-shadow-lg"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();
                e.target.value = "default"; // set placeholder as selected value
              }}
            >
              <option value="default" disabled selected>
                Add layer
              </option>
              {(Object.keys(updatedConfig) as OSMTags[])
                .filter((k) => !updatedConfig[k].active)
                .map((k) => {
                  const c: TagConfig = updatedConfig[k];
                  return (
                    <option
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
          </div>
        </div>
      </div>
      <Map
        view={JSON.parse(mapDefaults)}
        onMove={handleMove}
        featureCollections={featureCollections}
        uploadedGeoJSON={uploadedGeoJSON}
        config={updatedConfig}
        configPanelClosed={configPanelClosed}
      />
      <Error errorMessage={error} />
    </div>
  );
};

export default MainContent;
