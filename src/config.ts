import { OverpassFeatureLike } from "./utils/api";
import { TagConfig } from "./utils/osm";

export type OSMTags = "roads" | "waterways" | "places";

export type ZackConfig = {
  [k in OSMTags]: TagConfig;
};

export const zackConfig: ZackConfig = {
  roads: new TagConfig({
    title: "Roads",
    osmElement: "way",
    tag: "highway",
    values: [
      ["motorway", "trunk", "motorway_link"],
      ["primary", "primary_link"],
      ["secondary", "secondary_link"],
      ["tertiary", "tertiary_link"],
      ["residential", "service", "unclassified"],
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
  }),
  waterways: new TagConfig({
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
  }),
  places: new TagConfig({
    title: "Places",
    osmElement: "node",
    tag: "place",
    values: ["city", "town", "suburb", ["neighborhood", "village"]],
    displayNames: ["cities", "towns", "suburbs", "all places"],
    filter: (feat: OverpassFeatureLike) => feat.tags["place"] !== undefined,
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
  }),
};

export interface Settings {
  timeout: number;
}
export const defaultSettings: Settings = {
  timeout: 20,
};
