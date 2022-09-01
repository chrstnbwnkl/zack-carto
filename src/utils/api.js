import axios from "axios"

const OVERPASS_URL = "https://lz4.overpass-api.de/api/interpreter"

export const queryOverpass = (reqObj, bounds) => {
  const boundsParam = boundsToParam(bounds)
  const reqStr = makeReqParams(reqObj, boundsParam)
  const url = `${OVERPASS_URL}?data=[out:json][timeout:25];(${reqStr}); convert item ::=::,::geom=geom(),_osm_type=type();out geom;>;out skel qt;`
  return axios.get(url)
}

const COORD_PRECISION = 5
const boundsToParam = (bounds) => {
  return `(${round(bounds.getSouth())},${round(bounds.getWest())},${round(
    bounds.getNorth()
  )},${round(bounds.getEast())});`
}

const round = (f, d = COORD_PRECISION) => {
  return Math.round(f * 10 ** d) / 10 ** d
}

const makeReqParams = (obj, boundParam) => {
  const paramArr = []
  for (const key in obj) {
    const i = obj[key]
    const queries =
      i < QUERY_MAP[key].text_repr.length - 1
        ? QUERY_MAP[key].query.slice(1, i + 1)
        : QUERY_MAP[key].query.slice(1)
    paramArr.push(
      ...queries.map((q) => {
        return `${q}${boundParam}`
      })
    )
  }
  return paramArr.join("")
}

export const to_valid_geojson = (json) => {
  return {
    type: "Feature",
    geometry: { ...json.geometry },
    id: json.id,
    properties: { ...json.tags },
  }
}
