import React from "react";
import * as ReactDOMServer from "react-dom/server";
import * as d3Geo from "d3-geo";
import * as d3Tile from "d3-tile";

const d3 = { ...d3Geo, ...d3Tile };

const tileUrl = (x, y, z) => {
  return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
};

const cleanProperties = (s) => {
  return s
    .replaceAll(":", "-")
    .replaceAll("_", "-")
    .replaceAll("@", "")
    .replaceAll("~", "")
    .toLocaleLowerCase();
};

export const featureCollectionsToSvg = ({
  fc,
  uploadedGeoJSON,
  config,
  bounds,
}) => {
  const [width, height, buffer] = [1000, 700, 40]; // TODO: bounds to aspect ratio

  const projection = d3.geoMercator().fitExtent(
    [
      [buffer, buffer],
      [width - buffer, height - buffer],
    ],
    bounds
  );

  const path = d3.geoPath(projection);

  const tile = d3
    .tile()
    .size([width, height])
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))
    .tileSize(256);

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
            );
          })}
      </g>
      <g id="uploaded-geojson">
        {uploadedGeoJSON.map((uploadedFC, ix) => {
          return (
            <g key={ix}>
              {uploadedFC.features.map((uploadedFeat, fix) => {
                const dataAttrs = Object.keys(uploadedFeat.properties).reduce(
                  (prev, propKey) => {
                    return {
                      ...prev,
                      [`data-${cleanProperties(propKey)}`]: cleanProperties(
                        uploadedFeat.properties[propKey]
                      ),
                    };
                  },
                  {}
                );
                return (
                  <g key={`${fix}`} {...dataAttrs}>
                    {uploadedFeat.geometry.type !== "Point" ? (
                      <path
                        d={path(uploadedFeat)}
                        {...{
                          stroke: "#87784e",
                          strokeWidth: 2,
                          fill: "red",
                          strokeLinecap: "round",
                        }}
                      ></path>
                    ) : (
                      <circle
                        cx={projection(uploadedFeat.geometry.coordinates)[0]}
                        cy={projection(uploadedFeat.geometry.coordinates)[1]}
                        r={3}
                        fill={"#000"}
                        stroke={"#87784e"}
                        fillOpacity={0.4}
                        strokeWidth={2}
                      ></circle>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>
      {Object.keys(fc).map((k) => {
        const c = config[k];
        return (
          <g key={k} id={k}>
            {c.values.map((val, i) => {
              return (
                <g key={`${k}-${val}`} id={c.displayNames[i + 1]}>
                  {fc[k].features
                    .filter((feat) => {
                      if (Array.isArray(val)) {
                        return val.includes(feat.properties[c.tag]);
                      } else {
                        return feat.properties[c.tag] === val;
                      }
                    })
                    .map((feat) => {
                      const dataAttrs = Object.keys(feat.properties).reduce(
                        (prev, propKey) => {
                          return {
                            ...prev,
                            [`data-${cleanProperties(propKey)}`]:
                              cleanProperties(feat.properties[propKey]),
                          };
                        },
                        {}
                      );
                      return (
                        <g
                          key={`${k}-${feat.properties.id}`}
                          id={feat.properties.id}
                          {...dataAttrs}
                        >
                          {c.osmElement !== "node" ? (
                            <path d={path(feat)} {...c.d3Styles[i]}></path>
                          ) : (
                            <circle
                              cx={projection(feat.geometry.coordinates)[0]}
                              cy={projection(feat.geometry.coordinates)[1]}
                              {...c.d3Styles[i]}
                            ></circle>
                          )}
                        </g>
                      );
                    })}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );

  return ReactDOMServer.renderToStaticMarkup(svg);
};

onmessage = (e) => {
  const svg = featureCollectionsToSvg({
    fc: e.data.fc,
    uploadedGeoJSON: e.data.uploadedGeoJSON,
    config: JSON.parse(e.data.config),
    bounds: e.data.bounds,
  });
  postMessage(svg);
};
