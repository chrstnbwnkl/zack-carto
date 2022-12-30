import {
  LineStringCoordinates,
  OverpassFeatureLike,
  PointCoordinate,
  PolygonCoordinates,
} from "./utils/api";
import { Layer } from "./utils/osm";

export type OSMTags = "urbanLanduse" | "roads" | "waterways" | "places";

export type ZackConfig = {
  [k in OSMTags]: Layer;
};

/**
 * The default configuration for the Zack application. New layers should be added here.
 */
export const zackConfig: ZackConfig = {
  urbanLanduse: new Layer({
    title: "Land Use (developed)",
    osmElement: ["relation", "way"],
    tag: "landuse",
    values: [
      ["retail", "commercial"],
      ["residential", "religious", "education"],
      "industrial",
      ["insitutional", "construction"],
    ],
    displayNames: [
      "commercial/retail",
      "residential",
      "industrial",
      "all developed land uses",
    ],
    filter: (feat: OverpassFeatureLike) => {
      if (feat.geometry.type === "GeometryCollection") {
        return (
          feat.tags["landuse"] !== undefined &&
          feat.geometry.geometries &&
          feat.geometry.geometries[0].type !== "Point"
        );
      } else {
        return feat.tags["landuse"] !== undefined;
      }
    },
    map: (feat: OverpassFeatureLike) => {
      if (feat.geometry.type !== "GeometryCollection") {
        let type = feat.geometry.type;
        let coords:
          | LineStringCoordinates
          | PointCoordinate
          | PolygonCoordinates = feat.geometry.coordinates;
        if (feat.geometry.type === "LineString") {
          console.log(feat.tags);
          type = "Polygon";
          coords = [feat.geometry.coordinates];
        }

        feat.geometry.type = type;
        feat.geometry.coordinates = coords;

        return feat;
      } else {
        feat.geometry.geometries.forEach((geom) => {
          let type = geom.type;
          let coords:
            | LineStringCoordinates
            | PointCoordinate
            | PolygonCoordinates = geom.coordinates;
          if (geom.type === "LineString") {
            console.log(feat.tags);
            type = "Polygon";
            coords = [geom.coordinates];
          }

          geom.type = type;
          geom.coordinates = coords;
        });
      }

      return feat;
    },
    leafletStyles: [
      {
        color: "#000",
        weight: 1,
        fill: true,
        fillColor: "black",
        fillOpacity: 0.5,
      },
      { color: "#000", weight: 1, fill: true, fillColor: "green" },
      { color: "#000", weight: 1, fill: true, fillColor: "green" },
      { color: "#000", weight: 1, fill: true, fillColor: "green" },
    ],
    defaultDetail: 2,
    active: false,
  }),
  roads: new Layer({
    title: "Roads",
    osmElement: "way",
    tag: "highway",
    values: [
      ["motorway", "trunk", "motorway_link"],
      ["primary", "primary_link"],
      ["secondary", "secondary_link"],
      ["tertiary", "tertiary_link"],
      [
        "residential",
        "service",
        "unclassified",
        "living_street",
        "footway",
        "cycleway",
        "path",
      ],
    ],
    displayNames: [
      "motorways",
      "primary roads",
      "secondary roads",
      "tertiary roads",
      "all roads",
    ],
    filter: (feat: OverpassFeatureLike) => feat.tags["highway"] !== undefined,
    leafletStyles: [
      { color: "#000", weight: 4, fill: false },
      { color: "#000", weight: 3, fill: false },
      { color: "#555", weight: 3, fill: false },
      { color: "#555", weight: 2, fill: false },
      { color: "#555", weight: 1, fill: false },
    ],
    defaultDetail: 3,
    active: true,
  }),
  waterways: new Layer({
    title: "Waterways",
    osmElement: "way",
    tag: "waterway",
    values: ["river", "stream", "canal", ["drain", "ditch"]],
    displayNames: ["rivers", "streams", "canals", "all waterways"],
    filter: (feat: OverpassFeatureLike) => feat.tags["waterway"] !== undefined,
    leafletStyles: [
      { color: "#4287f5", weight: 5 },
      { color: "#4287f5", weight: 3 },
      { color: "#4287f5", weight: 2 },
      { color: "#4287f5", weight: 1 },
    ],
    defaultDetail: 2,
    active: true,
  }),
  places: new Layer({
    title: "Places",
    osmElement: "node",
    tag: "place",
    values: ["city", "town", "suburb", ["neighborhood", "village"]],
    displayNames: ["cities", "towns", "suburbs", "all places"],
    filter: (feat: OverpassFeatureLike) =>
      feat.tags["place"] !== undefined && feat.tags["landuse"] === undefined,
    leafletStyles: [
      {
        radius: 8,
        fillColor: "#fff",
        color: "#000",
        weight: 4,
        fillOpacity: 0.7,
      },
      {
        radius: 6,
        fillColor: "#fff",
        color: "#000",
        weight: 3,
        fillOpacity: 0.7,
      },
      {
        radius: 5,
        fillColor: "#fff",
        color: "#000",
        weight: 3,
        fillOpacity: 0.7,
      },
      {
        radius: 4,
        fillColor: "#fff",
        color: "#000",
        weight: 2,
        fillOpacity: 0.7,
      },
    ],
    defaultDetail: 3,
    active: true,
  }),
};

export interface Settings {
  timeout: number;
}
export const defaultSettings: Settings = {
  timeout: 20,
};
