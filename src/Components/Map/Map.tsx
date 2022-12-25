import React, { useState, useRef, useEffect, ReactElement } from "react";
import L from "leaflet";
import { FeatureCollection } from "geojson";

import "leaflet/dist/leaflet.css";
import { ZackConfig } from "../../config";

interface MapProps {
  view: { center: [number, number]; zoom: number };
  onMove: (
    bounds: L.LatLngBounds,
    center?: [number, number],
    zoom?: number
  ) => void;
  featureCollections: {
    [k: string]: FeatureCollection;
  };
  uploadedGeoJSON: FeatureCollection[];
  config: ZackConfig;
  configPanelClosed: boolean;
}
const Map = ({
  view,
  onMove,
  featureCollections,
  uploadedGeoJSON,
  config,
  configPanelClosed,
}: MapProps): ReactElement => {
  const [mapInstance, setMapInstance] = useState<null | L.Map>(null);
  const mapRef = useRef<null | L.Map>(null);

  const handleMove = (e: L.LeafletEvent) => {
    const center = e.target.getCenter();
    const zoom = e.target.getZoom();
    onMove(e.target.getBounds(), [center.lat, center.lng], zoom);
  };

  useEffect(() => {
    mapRef.current = L.map("map", {
      center: view.center,
      zoom: view.zoom,
      renderer: L.canvas(),
    });
    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }
    );
    osm.addTo(mapRef.current);
    setMapInstance(mapRef.current as L.Map);
    onMove(mapRef.current.getBounds());
    mapRef.current.on("move", (e) => {
      handleMove(e);
    });

    return () => {
      (mapRef.current as L.Map).remove();
    };
  }, []); // only render once

  useEffect(() => {
    const layers: L.Layer[] = [];
    if (Object.keys(featureCollections).length > 0) {
      let k: keyof ZackConfig;
      for (k in config) {
        const c = config[k];
        const fc = featureCollections[k];
        const opts: L.GeoJSONOptions = {};
        if (c.osmElement !== "node") {
          const styleFunc = c.leafletFunc();
          opts.style = styleFunc;
        } else {
          opts.pointToLayer = (feat, ll) => {
            return L.circleMarker(ll, c.leafletFunc()(feat));
          };
        }
        const geoJSON = L.geoJSON(fc, opts).addTo(mapInstance as L.Map);
        layers.push(geoJSON);
      }
    }

    return () => {
      layers.forEach((layer) => {
        if (typeof layer.remove === "function") {
          layer.remove();
        }
      });
    };
  }, [featureCollections, mapInstance]);

  useEffect(() => {
    const layers: L.GeoJSON[] = [];
    uploadedGeoJSON.forEach((geoJSON) => {
      let opts: L.GeoJSONOptions = {};
      if (geoJSON.features[0].geometry.type === "Point") {
        opts.pointToLayer = (feat, ll) => {
          return L.circleMarker(ll);
        };
      }
      const layer = L.geoJSON(geoJSON, opts).addTo(mapInstance as L.Map);
      layers.push(layer);
      console.log("layer added");
    });

    return () => {
      layers.forEach((layer) => {
        if (typeof layer.remove === "function") {
          layer.remove();
        }
      });
    };
  }, [uploadedGeoJSON]);

  useEffect(() => {
    if (configPanelClosed) {
      mapRef.current?.invalidateSize();
    }
  }, [configPanelClosed]);

  return (
    <>
      <div id="map" className="flex-grow md:h-2/6 md:w-screen"></div>
    </>
  );
};

export default Map;
