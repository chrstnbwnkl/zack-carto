import React, { ReactElement, useState } from "react";
import L, { LatLngBounds } from "leaflet";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import { toFeatureCollection, queryOverpass } from "./utils/api";
import { FeatureCollection } from "geojson";

import { useLocalStorage } from "./utils/hooks";
import { OSMTags, Settings, ZackConfig } from "./config";
import MainContent from "./Components/MainContent/MainContent";
import { AxiosError } from "axios";

interface AppProps {
  config: ZackConfig;
  defaultSettings: Settings;
}
export const App = ({ config, defaultSettings }: AppProps): ReactElement => {
  const [mapDefaults, setMapDefaults] = useLocalStorage(
    "mapstate",
    JSON.stringify({ center: [50.93, 6.95], zoom: 13 })
  );

  const [settings, setSettings] = useLocalStorage(
    "zackSettings",
    JSON.stringify(defaultSettings)
  );
  const [bounds, setBounds] = useState(new LatLngBounds([0, 0], [0, 0]));
  const [runBounds, setRunBounds] = useState(new LatLngBounds([0, 0], [0, 0]));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [featureCollections, setFeatureCollections] = useState({});
  const [uploadedGeoJSON, setUploadedGeoJSON] = useState<FeatureCollection[]>(
    []
  );
  const [updatedConfig, setUpdatedConfig] = useState(config);

  const onDetailUpdate = (itemKey: OSMTags, detail: string): void => {
    setUpdatedConfig((current: ZackConfig) => {
      return {
        ...current,
        [itemKey]: {
          ...current[itemKey],
          detail: Number(detail),
        },
      };
    });
  };

  const handleRun = () => {
    setIsLoading(true);
    setRunBounds(bounds);
    if (Object.values(updatedConfig).every((v) => v.detail === 0)) {
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
    const settingsObj: Settings = JSON.parse(settings);
    console.log(settingsObj);
    queryOverpass(updatedConfig, bounds, {
      timeout: Number(settingsObj?.timeout ?? 0), // leave a buffer for Overpass to respond
    })
      .then((res) => {
        if (res.data.elements.length > 0) {
          setFeatureCollections((current) => {
            return (Object.keys(config) as OSMTags[]).reduce((prev, k) => {
              const c = config[k];
              return {
                ...prev,
                [k]: toFeatureCollection(res.data.elements.filter(c.filter)),
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
    w.postMessage(data);

    w.onmessage = (svg) => {
      a.href = window.URL.createObjectURL(
        new Blob([svg.data], { type: "text/plain" })
      );
      a.setAttribute("download", "zack-download.svg");

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
      setMapDefaults(JSON.stringify({ center: center, zoom: zoom }));
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
          mapDefaults={mapDefaults}
          handleMove={handleMove}
          featureCollections={featureCollections}
          uploadedGeoJSON={uploadedGeoJSON}
          updatedConfig={updatedConfig}
          error={error}
          onDetailUpdate={onDetailUpdate}
        />
        <Footer className="flex h-12 w-full flex-row content-end justify-center border-t border-blue-90 bg-blue-50 py-1" />
      </div>
      <input type="checkbox" id="settings-modal" className="modal-toggle" />
      <label htmlFor="settings-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h2 className="pb-6 text-center text-2xl font-bold text-blue drop-shadow-md">
            Settings
          </h2>
          <div className=" text-blue">
            <form>
              <label
                htmlFor="timeout-input"
                title="The number of seconds Overpass will take to return a result. If the query hasn't finished by the end of the timeout, an empty result set is returned. "
              >
                Overpass timeout (seconds):{" "}
              </label>
              <input
                id="timeout-input"
                type="number"
                className="input-bordered input h-8 w-20"
                min="1"
                max="360"
                value={JSON.parse(settings)?.timeout}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSettings((curr: string) => {
                    const obj = JSON.parse(curr);
                    return JSON.stringify({ ...obj, timeout: e.target.value });
                  });
                }}
              />
            </form>
          </div>
        </label>
      </label>
    </>
  );
};
