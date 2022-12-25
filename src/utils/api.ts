import axios from "axios";
import * as L from "leaflet";
import { ZackConfig } from "../config";

type PointCoordinate = [number, number];
type LineStringCoordinates = Point[];
type PolygonCoordinates = LineString[];

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

export interface OverpassFeatureLike {
  geometry: {
    coordinates: Point | LineString | Polygon;
  };
  tags: { [k: string]: string };
  id: string;
}

const OVERPASS_URL = "https://lz4.overpass-api.de/api/interpreter";

export const queryOverpass = (reqObj: ZackConfig, bounds: L.LatLngBounds) => {
  const boundsParam = boundsToParam(bounds);
  const reqStr = makeReqParams(reqObj, boundsParam);
  const url = `${OVERPASS_URL}?data=[out:json][timeout:2];(${reqStr}); convert item ::=::,::geom=geom(),_osm_type=type();out geom;>;out skel qt;`;
  return axios.get(url);
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
    const config = obj[key];
    const queries =
      config.detail < config.values.length
        ? config.queryParams.slice(1, config.detail + 1).flat()
        : config.queryParams.slice(1).flat();
    paramArr.push(
      ...queries.map((q) => {
        return `${q}${boundParam}`;
      })
    );
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
