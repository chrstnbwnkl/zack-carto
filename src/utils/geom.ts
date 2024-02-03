import { LineString } from "geojson";

export const isClosed = (ls: LineString) =>
  ls.coordinates.length > 2 &&
  ls.coordinates[0][0] === ls.coordinates[ls.coordinates.length - 1][0] &&
  ls.coordinates[0][1] === ls.coordinates[ls.coordinates.length - 1][1];
