import React from "react"
import L from "leaflet"
import * as ReactDOMServer from "react-dom/server"
import * as d3Geo from "d3-geo"
import * as d3Selection from "d3-selection"
import * as d3Tile from "d3-tile"

const d3 = { ...d3Geo, ...d3Selection, ...d3Tile }

const tileUrl = (x, y, z) => {
  return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
}

export const featureCollectionsToSvg = (fc, config, bounds) => {
  const mergedFC = {
    // need to merge to fit extent
    type: "FeatureCollection",
    features: Object.values(fc).reduce((prev, v) => {
      return [...prev, ...v.features]
    }, []),
  }
  const [width, height, buffer] = [1000, 700, 40] // TODO: bounds to aspect ratio

  const projection = d3.geoMercator().fitExtent(
    [
      [buffer, buffer],
      [width - buffer, height - buffer],
    ],
    L.rectangle(bounds).toGeoJSON()
    //mergedFC
  )

  const path = d3.geoPath(projection)

  const tile = d3
    .tile()
    .size([width, height])
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))
    .tileSize(512)

  const svg = (
    <svg
      width={width}
      height={height}
      title={"zack-download"}
      version={"1.1"}
      xmlns={"http://www.w3.org/2000/svg"}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id={"tiles"}>
        {tile()
          .map(([x, y, z], i, { translate: [tx, ty], scale: k }) => [
            tileUrl(x, y, z),
            Math.round((x + tx) * k),
            Math.round((y + ty) * k),
            k,
          ])
          .map((t) => {
            return (
              <image
                key={`tile-${t[0]}`}
                xlinkHref={t[0]}
                x={t[1]}
                y={t[2]}
                width={t[3]}
                height={t[3]}
              ></image>
            )
          })}
      </g>
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
                          {c.osmElement !== "node" ? (
                            <path d={path(feat)} {...c._d3Styles[i]}></path>
                          ) : (
                            <circle
                              cx={projection(feat.geometry.coordinates)[0]}
                              cy={projection(feat.geometry.coordinates)[1]}
                              {...c._d3Styles[i]}
                            ></circle>
                          )}
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
}
