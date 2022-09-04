import axios from "axios"

const OVERPASS_URL = "https://lz4.overpass-api.de/api/interpreter"

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

const makeReqParams = (obj, boundParam) => {
  const paramArr = []
  for (const key in obj) {
    const config = obj[key]
    const queries =
      config._detail < config.values.length
        ? config.queryParams.slice(1, config._detail + 1).flat()
        : config.queryParams.slice(1).flat()
    paramArr.push(
      ...queries.map((q) => {
        return `${q}${boundParam}`
      })
    )
  }
  return paramArr.join("")
}

export const toFeatureCollection = (json) => {
  console.log(json)
  return {
    type: "FeatureCollection",
    features: json.map((el) => {
      return {
        type: "Feature",
        geometry: { ...el.geometry },
        id: json.id,
        properties: { ...el.tags },
      }
    }),
  }
}
