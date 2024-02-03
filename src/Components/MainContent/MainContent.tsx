import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FeatureCollection } from "geojson";
import { LatLngBounds } from "leaflet";
import React, { useState } from "react";
import { OSMTags, Settings, ZackConfig } from "../../config";
import ConfigureSliderView from "../ConfigureSliderView/ConfigureSliderView";
import Error from "../Error/Error";
import Map from "../Map/Map";
import { Layer } from "../../utils/osm";
import AddLayerSelect from "../AddLayerSelect/AddLayerSelect";
import ToggleAdvancedMode from "../ToggleAdvancedMode/ToggleAdvancedMode";
import { MapView } from "../../App";

interface MainContentProps {
  mapDefaults: MapView;
  handleMove: (
    bounds: LatLngBounds,
    center?: [number, number] | undefined,
    zoom?: number | undefined
  ) => void;
  featureCollections: { [k: string]: FeatureCollection };
  uploadedGeoJSON: FeatureCollection[];
  config: ZackConfig;
  settings: Settings;
  error: string;
  onConfigUpdate: (
    itemKey: OSMTags,
    configKey: keyof Layer,
    value: string | number | boolean
  ) => void;
  onSettingsUpdate: (key: string, value: number | string | boolean) => void;
}

const MainContent = ({
  mapDefaults,
  handleMove,
  featureCollections,
  uploadedGeoJSON,
  config,
  settings,
  error,
  onConfigUpdate,
  onSettingsUpdate,
}: MainContentProps) => {
  const [configPanelClosed, setConfigPanelClosed] = useState(false);

  const handleConfigPanelClose = () => {
    setConfigPanelClosed((curr) => !curr);
  };
  return (
    <div className="flex min-h-0 w-screen flex-1 md:flex-col">
      <div
        className={`relative transition-[height] flex w-4/12 flex-col justify-between overflow-y-auto md:order-2 md:w-full ${
          configPanelClosed ? "md:h-10 md:overflow-y-hidden" : "md:h-4/6"
        }`}
      >
        <button
          className={`absolute hover:animate-ping ${
            configPanelClosed
              ? "top-2 left-1/2 -translate-x-1/2 transform"
              : "top-4 right-4"
          } z-10 hidden cursor-pointer md:block`}
          title="Hide config panel"
          onClick={handleConfigPanelClose}
        >
          <FontAwesomeIcon
            icon={configPanelClosed ? faChevronUp : faChevronDown}
            className="hover:scale-[1.2] transition-all"
          />
        </button>
        <div
          className={`${
            configPanelClosed ? "md:h-0 overflow-hidden" : ""
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
          <ConfigureSliderView
            config={config}
            onConfigUpdate={onConfigUpdate}
          />
          <div className="flex justify-center self-end p-4 ">
            <AddLayerSelect config={config} onConfigUpdate={onConfigUpdate} />
            <ToggleAdvancedMode
              settings={settings}
              onSettingsUpdate={onSettingsUpdate}
              className={`btn ml-4 flex justify-center self-end border-2 border-white p-4 text-blue drop-shadow-lg hover:border-green hover:bg-white ${
                settings.advanced ? "bg-green" : "bg-gray"
              }`}
            >
              Advanced Mode
            </ToggleAdvancedMode>
          </div>
        </div>
      </div>
      <Map
        view={mapDefaults}
        onMove={handleMove}
        featureCollections={featureCollections}
        uploadedGeoJSON={uploadedGeoJSON}
        config={config}
        configPanelClosed={configPanelClosed}
      />
      <Error errorMessage={error} />
    </div>
  );
};

export default MainContent;
