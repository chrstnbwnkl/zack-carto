const NoneRepr = "none"

export const QUERY_MAP = {
  Roads: {
    query: [
      "",
      'way[highway="motorway"]',
      'way[highway="primary"]',
      'way[highway="secondary"]',
      'way[highway="tertiary"]',
      'way[highway="residential"]',
      'way[highway="service"]',
      'way[highway="unclassified"]',
    ],
    text_repr: [
      NoneRepr,
      "motorways",
      "primary roads",
      "secondary roads",
      "tertiary roads",
      "all roads",
    ],
  },
  Waterways: {
    query: [
      "",
      'way[waterway="river"]',
      'way[waterway="stream"]',
      'way[waterway="canal"]',
      'way[waterway="drain"]',
      'way[waterway="ditch"]',
    ],
    text_repr: [NoneRepr, "rivers", "streams", "canals", "all waterways"],
  },
  Places: {
    query: [
      "",
      'node[place="city"]',
      'node[place="town"]',
      'node[place="suburb"]',
      'node[place="neighborhood"]',
      'node[place="village"]',
    ],
    text_repr: [NoneRepr, "cities", "towns", "suburbs", "all places"],
  },
}

export const makeReadableEnumeration = (arr, i) => {
  if (i == 0 || i == 1 || i == arr.length - 1) {
    return arr[i]
  } else {
    return `${arr.slice(1, i).join(", ")} & ${arr[i]}`
  }
}
