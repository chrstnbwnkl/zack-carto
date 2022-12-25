import React, { ReactElement, useState } from "react";
import L, { LatLngBounds, map } from "leaflet";
import Map from "./Components/Map/Map";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import { toFeatureCollection, queryOverpass } from "./utils/api";
import { FeatureCollection } from "geojson";

import ConfigureTab from "./Components/ConfigureTab/ConfigureTab";
import { useLocalStorage } from "./utils/hooks";
import { OSMTags, ZackConfig } from "./config";
import MainContent from "./Components/MainContent/MainContent";

interface AppProps {
  config: ZackConfig;
}
export const App = ({ config }: AppProps): ReactElement => {
  const [mapDefaults, setMapDefaults] = useLocalStorage(
    "mapstate",
    JSON.stringify({ center: [50.93, 6.95], zoom: 13 })
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

    queryOverpass(updatedConfig, bounds)
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
        } else {
          setError("The query returned an empty result set.");
          setTimeout(() => {
            setError("");
          }, 5000);
        }

        setIsLoading(false);
      })
      .catch((reason) => {
        console.log(reason);
        setIsLoading(false);
        setError("Something went wrong while fetching the data.");
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
      <Footer className="flex h-8 w-full flex-row content-center justify-center space-x-1 border-t border-blue-90 bg-blue-50 py-1" />
    </div>
  );
};
