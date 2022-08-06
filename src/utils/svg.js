import * as d3Geo from "d3-geo"
import * as d3Selection from "d3-selection"

const d3 = { ...d3Geo, ...d3Selection }

export const featuresToSvg = (features) => {
  const fc = {
    type: "FeatureCollection",
    features: features,
  }
  const [width, height, buffer] = [1000, 1000, 100]

  const projection = d3.geoTransverseMercator().fitExtent(
    [
      [buffer, buffer],
      [width - buffer, height - buffer],
    ],
    fc
  )

  const path = d3.geoPath(projection)

  const svg = d3
    .create("svg")
    .attr("width", width, height)
    .attr("height", height)
    .attr("title", "zack_download")
    .attr("version", 1.1)
    .attr("xmlns", "http://www.w3.org/2000/svg")

  const roads = svg.append("g").attr("id", "roads")

  roads
    .selectAll(".roads")
    .data(features.filter((f) => f.properties.highway !== undefined))
    .enter()
    .append("g")
    .attr("id", (d) => d.id)
    .attr("data-properties", (d) => JSON.stringify(filterProps(d.properties)))
    .append("path")
    .attr("d", path)
    .attr("stroke", "#000000")
    .attr("stroke-width", (d) => ATTR_MAP[d.properties.highway])
    .attr("fill", "none")

  const waterways = svg.append("g").attr("id", "waterways")

  waterways
    .selectAll(".waterways")
    .data(features.filter((f) => f.properties.waterway !== undefined))
    .enter()
    .append("g")
    .attr("id", (d) => d.id)
    .attr("data-properties", (d) => JSON.stringify(filterProps(d.properties)))
    .append("path")
    .attr("d", path)
    .attr("stroke", "#4287f5")
    .attr("stroke-width", (d) => ATTR_MAP[d.properties.waterway])
    .attr("fill", "none")

  const places = svg.append("g").attr("id", "places")

  places
    .selectAll(".places")
    .data(features.filter((f) => f.properties.place !== undefined))
    .enter()
    .append("g")
    .attr("id", (d) => d.id)
    .attr("data-properties", (d) => JSON.stringify(filterProps(d.properties)))
    .append("circle")
    .attr("cx", (d) => projection(d.geometry.coordinates)[0])
    .attr("cy", (d) => projection(d.geometry.coordinates)[1])
    .attr("r", (d) => ATTR_MAP[d.properties.place])
    .attr("fill", "#ffffff")
    .attr("stroke-width", "1px")
    .attr("stroke", "#000000")

  const serializer = new window.XMLSerializer()
  const string = serializer.serializeToString(svg.node())
  return string
}

const ATTR_MAP = {
  city: 6,
  town: 4,
  suburb: 3,
  neighborhood: 2,
  village: 2,
  river: 5,
  stream: 3,
  canal: 2,
  drain: 1,
  ditch: 1,
  motorway: 6,
  primary: 4,
  secondary: 3,
  tertiary: 2,
  residential: 1,
  service: 1,
  unclassified: 1,
}

const filterProps = (props) => {
  const allowed = ["name", "highway", "place", "waterway"]

  const filtered = Object.keys(props)
    .filter((k) => allowed.includes(k))
    .reduce((obj, key) => {
      obj[key] = props[key]
      return obj
    }, {})
  return filtered
}
