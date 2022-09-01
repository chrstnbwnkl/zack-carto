const NONE_DISPLAY = "none"

export const CONFIG = {
  roads: {
    title: "Roads",
    values: [
      ["motorway", "trunk"],
      "primary",
      "secondary",
      "tertiary",
      ["residential", "service", "unclassified"],
    ],
    get query() {
      return [
        "",
        ...this.values.map((v) => {
          return `way[highway="${v}"]`
        }),
      ]
    },
    displayNames: [
      NONE_DISPLAY,
      "motorways",
      "trunk motorways",
      "primary roads",
      "secondary roads",
      "tertiary roads",
      "all roads",
    ],
    filter: (properties) => properties["highway"] !== undefined,
    defaultStyle: {},
    defaultDetail: 3,
  },
  waterways: {
    title: "Waterways",
    values: ["river", "stream", "canal", ["drain", "ditch"]],
    get query() {
      return [
        "",
        ...this.values.map((v) => {
          return `way[waterway="${v}"]`
        }),
      ]
    },
    displayNames: [
      NONE_DISPLAY,
      "rivers",
      "streams",
      "canals",
      "all waterways",
    ],
    filter: (properties) => properties["waterway"] !== undefined,
    defaultStyle: {},
    defaultDetail: 3,
  },
  places: {
    title: "Places",
    values: ["city", "town", "suburb", ["neighborhood", "village"]],
    get query() {
      return [
        "",
        ...this.values.map((v) => {
          return `node[place="${v}"]`
        }),
      ]
    },
    displayNames: [NONE_DISPLAY, "cities", "towns", "suburbs", "all places"],
    filter: (properties) => properties["place"] !== undefined,
    defaultStyle: {},
    defaultDetail: 3,
  },
}

export const makeReadableEnumeration = (arr, i) => {
  if (i == 0 || i == 1 || i == arr.length - 1) {
    return arr[i]
  } else {
    return `${arr.slice(1, i).join(", ")} & ${arr[i]}`
  }
}
