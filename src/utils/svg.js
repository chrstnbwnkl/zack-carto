import * as d3 from "d3"

export const TEST_FEATURES = [
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [8.133689, 51.8075208],
        [8.1344837, 51.8077909],
      ],
    },
    id: 19,
    properties: {
      highway: "motorway",
      int_ref: "E 34",
      lanes: "4",
      lit: "no",
      maxspeed: "none",
      "note:name":
        "Der reg_name, sowie ggf. der loc_name sind dem zugehörigen Wikipediaartikel entnommen.",
      oneway: "yes",
      ref: "A 2",
      reg_name: "Warschauer Allee",
      "source:lit": "http://www.autobahn-bilder.de",
      "source:maxspeed": "DE:motorway",
      surface: "asphalt",
      "turn:lanes": "none|none|none|merge_to_left",
      _osm_type: "way",
    },
  },
]

export const featuresToSvg = (features) => {
  const fc = {
    type: "FeatureCollection",
    features: features,
  }
  const [width, height] = [1000, 1000]

  const projection = d3.geoTransverseMercator().fitExtent(
    [
      [0, 0],
      [width, height],
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

  const roads = svg
    .selectAll(".roads")
    .data(features.filter((f) => f.properties.highway !== undefined))
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "#000000")
    .attr("stroke-width", 2)
    .attr("fill", "none")

  const waterways = svg
    .selectAll(".waterways")
    .data(features.filter((f) => f.properties.waterway !== undefined))
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "#4287f5")
    .attr("stroke-width", 3)
    .attr("fill", "none")

  const places = svg
    .selectAll(".places")
    .data(features.filter((f) => f.properties.place !== undefined))
    .enter()
    .append("path")
    .append("circle")
    .attr("cx", function (d) {
      return projection(d.geometry.coordinates)[0]
    })
    .attr("cy", function (d) {
      return projection(d.geometry.coordinates)[1]
    })
    .attr("r", `${7}px`)
    .attr("fill", "rgba(255,255,0, 1)")
    .attr("stroke-width", "1px")
    .attr("stroke", "rgba(255,255,0, 1)")

  const serializer = new window.XMLSerializer()
  const string = serializer.serializeToString(svg.node())
  return string
}
