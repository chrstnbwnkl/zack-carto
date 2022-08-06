import axios from "axios"
import { QUERY_MAP } from "./queryMap"

const OVERPASS_URL = "https://lz4.overpass-api.de/api/interpreter"

export const EXAMPLE_QUERY =
  '[out:json][timeout:25];(way[highway="secondary"](51.79046174732954,8.175888061523436,51.8145314763899,8.2177734375);); convert item ::=::,::geom=geom(),_osm_type=type();out geom;>;out skel qt;'

// example request:
// https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(way[highway="secondary"](51.09877899230192,6.684837341308594,51.2939145823131,7.019920349121094);); convert item ::=::,::geom=geom(),_osm_type=type();out body;>;out skel qt;
export const query_overpass = (req) => {
  return axios.get(`${OVERPASS_URL}?data=${req}`)
}

export const queryOverpass = (reqObj, bounds) => {
  const boundsParam = boundsToParam(bounds)
  const reqStr = makeReqParams(reqObj, boundsParam)
  const url = `${OVERPASS_URL}?data=[out:json][timeout:25];(${reqStr}); convert item ::=::,::geom=geom(),_osm_type=type();out geom;>;out skel qt;`
  console.log(url)
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

// {Roads: 1, Waterways: 0, Cities: 4}
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
