import React, { ReactElement, useState } from "react";
import L, { LatLngBounds } from "leaflet";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import {
  toFeatureCollection,
  queryOverpass,
  OverpassFeatureLike,
} from "./utils/api";
import { FeatureCollection } from "geojson";

import { useJSONLocalStorage, useZackConfigState } from "./utils/hooks";
import { OSMTags, Settings, ZackConfig } from "./config";
import MainContent from "./Components/MainContent/MainContent";
import { AxiosError } from "axios";
import SettingsModal from "./Components/Settings/Settings";
import { Layer } from "./utils/osm";

interface AppProps {
  config: ZackConfig;
  defaultSettings: Settings;
}

export interface MapView {
  center: [number, number];
  zoom: number;
}
/**
 * Main application.
 *
 * @param config: Default configuration for the different layers, such as style, active state, level of detail
 * @param defaultSettings: Default settings
 * @returns
 */
export const App = ({ config, defaultSettings }: AppProps): ReactElement => {
  const [mapView, setMapView] = useJSONLocalStorage<MapView>("mapstate", {
    center: [50.93, 6.95],
    zoom: 13,
  });

  const [settings, setSettings] = useJSONLocalStorage(
    "zackSettings",
    defaultSettings
  );
  const [bounds, setBounds] = useState(new LatLngBounds([0, 0], [0, 0]));
  // bounds when run is pressed = bounds used for svg generation
  const [runBounds, setRunBounds] = useState(new LatLngBounds([0, 0], [0, 0]));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [featureCollections, setFeatureCollections] = useState({});
  const [uploadedGeoJSON, setUploadedGeoJSON] = useState<FeatureCollection[]>(
    []
  );
  const [updatedConfig, setUpdatedConfig] = useZackConfigState(
    "zackConfig",
    config
  );

  const handleConfigUpdate = (
    itemKey: OSMTags,
    configKey: keyof Layer,
    value: string | number | boolean
  ): void => {
    setUpdatedConfig((current: ZackConfig) => {
      return {
        ...current,
        [itemKey]: {
          ...current[itemKey],
          [configKey]: value,
        },
      };
    });
  };

  const handleRun = () => {
    setIsLoading(true);
    setRunBounds(bounds);
    if (Object.values(updatedConfig).every((v) => !v.active)) {
      setError(
        "Query cannot be empty: please increase at least one of the sliders."
      );
      setIsLoading(false);
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }
    setError("");

    queryOverpass(settings.url, updatedConfig, bounds, {
      timeout: Number(settings?.timeout ?? 0), // leave a buffer for Overpass to respond
    })
      .then((res) => {
        if (res.data.elements.length > 0) {
          setFeatureCollections((current) => {
            return (Object.keys(config) as OSMTags[]).reduce((prev, k) => {
              const c = config[k];
              return {
                ...prev,
                [k]: toFeatureCollection(
                  // TODO: explode these
                  res.data.elements
                    .filter(c.filter)
                    .reduce(
                      (acc: OverpassFeatureLike[], el: OverpassFeatureLike) => [
                        ...acc,
                        ...c.explodeCollection(el),
                      ],
                      []
                    )
                ),
              };
            }, {});
          });
          setIsLoading(false);
        } else {
          setError("The query returned an empty result set.");
          setTimeout(() => {
            setError("");
          }, 5000);
          setIsLoading(false);
        }
      })
      .catch((reason: AxiosError) => {
        setError(reason.message);
        setTimeout(() => {
          setError("");
        }, 5000);
        setIsLoading(false);
      });
  };
  const handleDownload = () => {
    const a = document.createElement("a");
    a.style.display = "none";

    const w = new Worker(new URL("./workers/prepareSVG.jsx", import.meta.url));
    const data = {
      fc: featureCollections,
      uploadedGeoJSON,
      config: JSON.stringify(updatedConfig),
      bounds: L.rectangle(runBounds).toGeoJSON(),
    };
    console.log(featureCollections);
    console.log(data.bounds);
    w.postMessage(data);

    w.onmessage = (svg) => {
      a.href = window.URL.createObjectURL(
        new Blob([svg.data], { type: "text/plain" })
      );
      a.setAttribute(
        "download",
        `zack-${new Date()
          .toISOString()
          .slice(0, 16)
          .replace("T", "-")
          .replace(":", "-")}.svg`
      );

      a.click();

      window.URL.revokeObjectURL(a.href);
    };
  };

  const handleMove = (
    bounds: LatLngBounds,
    center?: [number, number],
    zoom?: number
  ) => {
    setBounds(bounds);

    // protect when called explicitly before map moved
    if (center && zoom) {
      setMapView({ center: center, zoom: zoom });
    }
  };

  const handleUpload = (fileArray: FileList) => {
    const promises = Array.prototype.map.call(fileArray, (file) => {
      return new Promise((resolve, reject) => {
        file
          .text()
          .then((geojsonStr: string) => {
            resolve(geojsonStr);
          })
          .catch(() => reject());
      });
    });

    Promise.all(promises).then((geojsonStrs) => {
      setUploadedGeoJSON((current: FeatureCollection[]) => {
        const featureCollections = (geojsonStrs as string[]).reduce(
          (prev: FeatureCollection[], str: string) => {
            return [...prev, JSON.parse(str)];
          },
          []
        );
        return [...current, ...featureCollections];
      });
    });
  };

  const handleSettingsChange = (
    key: string,
    value: number | string | boolean
  ): void => {
    setSettings((curr: Settings): Settings => {
      return {
        ...curr,
        [key]: value,
      };
    });
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <Header
          onRun={handleRun}
          onDownload={handleDownload}
          isLoading={isLoading}
          isDownloadable={Object.keys(featureCollections).length > 0}
          onUpload={handleUpload}
        />
        <MainContent
          mapDefaults={mapView}
          handleMove={handleMove}
          featureCollections={featureCollections}
          uploadedGeoJSON={uploadedGeoJSON}
          config={updatedConfig}
          settings={settings}
          error={error}
          onConfigUpdate={handleConfigUpdate}
          onSettingsUpdate={handleSettingsChange}
        />
        <Footer className="flex h-12 w-full flex-row content-end justify-center border-t border-blue-90 bg-blue-50 py-1" />
      </div>
      <SettingsModal settings={settings} onChange={handleSettingsChange} />
    </>
  );
};
