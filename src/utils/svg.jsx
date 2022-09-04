import React from "react"
import L from "leaflet"
import * as ReactDOMServer from "react-dom/server"
import * as d3Geo from "d3-geo"
import * as d3Selection from "d3-selection"

const d3 = { ...d3Geo, ...d3Selection }

export const featureCollectionsToSvg = (fc, config, bounds) => {
  // const mergedFC = {
  //   // need to merge to fit extent
  //   type: "FeatureCollection",
  //   features: Object.values().reduce((prev, v) => {
  //     return [...prev, ...v.features]
  //   }, []),
  // }
  const fitProj = d3.geoTransverseMercator()
  // swne
  const bbox = [
    ...fitProj([bounds.getSouthWest().lat, bounds.getSouthWest().lng]),
    ...fitProj([bounds.getNorthEast().lat, bounds.getNorthEast().lng]),
  ]
  const lonSpan = Math.abs(bbox[1] - bbox[3])
  const latSpan = Math.abs(bbox[0] - bbox[2])

  const divisor = lonSpan / latSpan
  console.log(bbox)
  const [width, height, buffer] = [1000, 1000, 0] // TODO: bounds to aspect ratio

  const projection = d3.geoMercator().fitExtent(
    [
      [buffer, buffer],
      [width - buffer, height - buffer],
    ],
    L.rectangle(bounds).toGeoJSON()
  )

  const path = d3.geoPath(projection)

  const svg = (
    <svg
      width={width}
      height={height}
      title={"zack-download"}
      version={"1.1"}
      xmlns={"http://www.w3.org/2000/svg"}
    >
      {Object.keys(fc).map((k) => {
        const c = config[k]
        return (
          <g key={k} id={k}>
            {c.values.map((val, i) => {
              return (
                <g key={`${k}-${val}`} id={c.displayNames[i + 1]}>
                  {fc[k].features
                    .filter((feat) => {
                      if (Array.isArray(val)) {
                        return val.includes(feat.properties[c.tag])
                      } else {
                        return feat.properties[c.tag] === val
                      }
                    })
                    .map((feat) => {
                      return (
                        <g
                          key={`${k}-${feat.properties.id}`}
                          id={feat.properties.id}
                        >
                          <path d={path(feat)}></path>
                        </g>
                      )
                    })}
                </g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )

  return ReactDOMServer.renderToStaticMarkup(svg)

  // const svg = d3
  //   .create("svg")
  //   .attr("width", width, height)
  //   .attr("height", height)
  //   .attr("title", "zack_download")
  //   .attr("version", 1.1)
  //   .attr("xmlns", "http://www.w3.org/2000/svg")

  // const roads = svg.append("g").attr("id", "roads")

  // roads
  //   .selectAll(".roads")
  //   .data(features.filter((f) => f.properties.highway !== undefined))
  //   .enter()
  //   .append("g") // TODO: further grouping by tag
  //   .attr("id", (d) => d.id)
  //   .attr("data-properties", (d) => JSON.stringify(filterProps(d.properties)))
  //   .append("path")
  //   .attr("d", path)
  //   .attr("stroke", "#000000")
  //   .attr("stroke-width", (d) => ATTR_MAP[d.properties.highway])
  //   .attr("fill", "none")

  // const waterways = svg.append("g").attr("id", "waterways")

  // waterways
  //   .selectAll(".waterways")
  //   .data(features.filter((f) => f.properties.waterway !== undefined))
  //   .enter()
  //   .append("g")
  //   .attr("id", (d) => d.id)
  //   .attr("data-properties", (d) => JSON.stringify(filterProps(d.properties)))
  //   .append("path")
  //   .attr("d", path)
  //   .attr("stroke", "#4287f5")
  //   .attr("stroke-width", (d) => ATTR_MAP[d.properties.waterway])
  //   .attr("fill", "none")

  // const places = svg.append("g").attr("id", "places")

  // places
  //   .selectAll(".places")
  //   .data(features.filter((f) => f.properties.place !== undefined))
  //   .enter()
  //   .append("g")
  //   .attr("id", (d) => d.id)
  //   .attr("data-properties", (d) => JSON.stringify(filterProps(d.properties)))
  //   .append("circle")
  //   .attr("cx", (d) => projection(d.geometry.coordinates)[0])
  //   .attr("cy", (d) => projection(d.geometry.coordinates)[1])
  //   .attr("r", (d) => ATTR_MAP[d.properties.place])
  //   .attr("fill", "#ffffff")
  //   .attr("stroke-width", "1px")
  //   .attr("stroke", "#000000")

  // const serializer = new window.XMLSerializer()
  // const string = serializer.serializeToString(svg.node())
  // return string
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
