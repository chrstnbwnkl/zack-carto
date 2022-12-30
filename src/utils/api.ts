import axios, { AxiosRequestConfig } from "axios";
import * as L from "leaflet";
import { ZackConfig } from "../config";

export type PointCoordinate = [number, number];
export type LineStringCoordinates = PointCoordinate[];
export type PolygonCoordinates = LineStringCoordinates[];

export interface Point {
  type: "Point";
  coordinates: PointCoordinate;
}

export interface LineString {
  type: "LineString";
  coordinates: LineStringCoordinates;
}

export interface Polygon {
  type: "Polygon";
  coordinates: PolygonCoordinates;
}

export interface GeometryCollection {
  type: "GeometryCollection";
  geometries: (Point | LineString | Polygon)[];
}

/**
 * Overpass does not return features comforming to the GeoJSON specification.
 */
export interface OverpassFeatureLike {
  geometry: GeometryCollection | Point | LineString | Polygon;
  tags: { [k: string]: string };
  id: string;
}

const OVERPASS_URL = "https://lz4.overpass-api.de/api/interpreter";

export const queryOverpass = (
  reqObj: ZackConfig,
  bounds: L.LatLngBounds,
  axiosOpts?: AxiosRequestConfig
) => {
  const boundsParam = boundsToParam(bounds);
  const reqStr = makeReqParams(reqObj, boundsParam);
  const url = `${OVERPASS_URL}?data=[out:json][timeout:${
    axiosOpts?.timeout ?? 20
  }];(${reqStr}); convert item ::=::,::geom=geom(),_osm_type=type();out geom;>;out skel qt;`;
  console.log(url);
  return axios.get(url, {
    ...axiosOpts,
    timeout: ((axiosOpts?.timeout ?? 20) + 3) * 1000,
  });
};

const COORD_PRECISION = 5;
const boundsToParam = (bounds: L.LatLngBounds): string => {
  return `(${round(bounds.getSouth())},${round(bounds.getWest())},${round(
    bounds.getNorth()
  )},${round(bounds.getEast())});`;
};

const round = (f: number, d = COORD_PRECISION) => {
  return Math.round(f * 10 ** d) / 10 ** d;
};

const makeReqParams = (obj: ZackConfig, boundParam: string) => {
  const paramArr = [];
  let key: keyof ZackConfig;
  for (key in obj) {
    if (obj[key].active) {
      const config = obj[key];
      const queries = config.queryParams.slice(0, config.detail + 1).flat();
      paramArr.push(
        ...queries.map((q) => {
          return `${q}${boundParam}`;
        })
      );
    }
  }
  return paramArr.join("");
};

export const toFeatureCollection = (json: OverpassFeatureLike[]) => {
  return {
    type: "FeatureCollection",
    features: json.map((el) => {
      return {
        type: "Feature",
        geometry: { ...el.geometry },
        id: el.id,
        properties: { ...el.tags },
      };
    }),
  };
};
