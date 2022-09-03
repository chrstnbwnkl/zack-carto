import { TagConfig } from "./utils/osm"

export const CONFIG = {
  roads: new TagConfig({
    title: "Roads",
    osmElement: "way",
    tag: "highway",
    values: [
      ["motorway", "trunk"],
      "primary",
      "secondary",
      "tertiary",
      ["residential", "service", "unclassified"],
    ],
    displayNames: [
      "motorways",
      "primary roads",
      "secondary roads",
      "tertiary roads",
      "all roads",
    ],
    filter: (properties) => properties["highway"] !== undefined,
    defaultStyle: {},
    defaultDetail: 3,
  }),
  waterways: new TagConfig({
    title: "Waterways",
    osmElement: "way",
    tag: "waterway",
    values: ["river", "stream", "canal", ["drain", "ditch"]],
    displayNames: ["rivers", "streams", "canals", "all waterways"],
    filter: (properties) => properties["waterway"] !== undefined,
    defaultStyle: {},
    defaultDetail: 3,
  }),
  places: new TagConfig({
    title: "Places",
    osmElement: "node",
    tag: "place",
    values: ["city", "town", "suburb", ["neighborhood", "village"]],
    displayNames: ["cities", "towns", "suburbs", "all places"],
    filter: (properties) => properties["place"] !== undefined,
    defaultStyle: {},
    defaultDetail: 3,
  }),
}
