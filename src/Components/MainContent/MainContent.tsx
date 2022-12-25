import { FeatureCollection } from "geojson";
import { LatLngBounds } from "leaflet";
import React from "react";
import { OSMTags, ZackConfig } from "../../config";
import ConfigureTab from "../ConfigureTab/ConfigureTab";
import Map from "../Map/Map";

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
  onDetailUpdate: (itemKey: OSMTags, newVal: string) => void;
}

const MainContent = ({
  mapDefaults,
  handleMove,
  featureCollections,
  uploadedGeoJSON,
  updatedConfig,
  error,
  onDetailUpdate,
}: MainContentProps) => {
  return (
    <div className="flex flex-grow md:flex-col">
      <div className="w-4/12 md:order-2 md:h-4/6 md:w-full md:overflow-y-scroll">
        <h3 className="p-3 text-xl font-bold">Geodata to SVG within seconds</h3>
        <p className="p-3">
          Pick a level of detail for each category, run the query, and download
          it as SVG. Read more about how it works{" "}
          <a href="https://github.com/chrstnbwnkl/zack-carto/blob/main/README.md">
            here
          </a>
          .
        </p>
        <ConfigureTab
          config={updatedConfig}
          handleSlidersChanged={onDetailUpdate}
        />
      </div>
      <Map
        view={JSON.parse(mapDefaults)}
        onMove={handleMove}
        featureCollections={featureCollections}
        uploadedGeoJSON={uploadedGeoJSON}
        config={updatedConfig}
        error={error}
      />
    </div>
  );
};

export default MainContent;
