import { Feature } from "geojson";
import { CircleMarkerOptions, StyleFunction } from "leaflet";
import { OverpassFeatureLike } from "./api";

interface SVGOpts
  extends Omit<CircleMarkerOptions, "color" | "fillColor" | "radius" | "fill"> {
  r?: number | undefined;
  strokeLinecap: "round";
  fill: "none";
  strokeWidth?: number | undefined;
}

type MappedLeafletStyleKeys =
  | "color"
  | "fillOpacity"
  | "weight"
  | "radius"
  | "fillColor"
  | "fill";
type MappedSVGStyleKeys =
  | "stroke"
  | "fillOpacity"
  | "strokeWidth"
  | "r"
  | "fill";

/** Most style attributes are the same for leaflet and SVG, but some differ, so we need to create a mapping */
const STYLEMAP: { [k in MappedLeafletStyleKeys]: MappedSVGStyleKeys } = {
  color: "stroke",
  fillOpacity: "fillOpacity",
  weight: "strokeWidth",
  radius: "r",
  fillColor: "fill",
  fill: "fill",
};

interface TagConfigOpts {
  /** The title of a layer. Displayed as a header on top of the pertaining slider.  */
  title: string;
  /** one of [node, way, relation] */
  osmElement: string | string[];
  /** The OSM tag associated with the layer. */
  tag: string;
  /**
   * The value associated with each level of detail.
   *
   * @remarks
   *
   * A value can be a string or an array of string, if various values should be grouped for a
   * certain level of detail
   *
   * @example
   * ```js
   *  <osmElement>[<tag>=<value>]
   * ```
   */
  values: (string | string[])[];
  /** The display name for each level of detail. Needs to be of same length as `values`. */
  displayNames: string[];
  /**
   * Since all layers are fetched in a single query, a filter function is needed to
   * group the returned features back into meaningful layers.
   */
  filter: (feat: OverpassFeatureLike) => boolean;
  /** Sometimes, linestrings need to be converted to polygon */
  map?: (feat: OverpassFeatureLike) => OverpassFeatureLike;
  /** Leaflet styles for each level of detail */
  leafletStyles: CircleMarkerOptions[];
  /** The default level of detail for the given layer. */
  defaultDetail: number;
  /** If true, the layer will be included in Overpass queries, otherwise, it will be omitted. */
  active: boolean;
}

/**
 * Main configuration class for a layer. Layers are categorized by theme (such as roads, waterways, etc.)
 *
 */
export class Layer {
  public title: string;
  public osmElement: string | string[];
  public tag: string;
  public values: (string | string[])[];
  public displayNames: string[];
  public filter: (feat: OverpassFeatureLike) => boolean;
  public map: (feat: OverpassFeatureLike) => OverpassFeatureLike;
  public leafletStyles: CircleMarkerOptions[];
  public defaultDetail: number;
  public detail: number;
  /** List of query params derived from the values array. */
  public queryParams: (string | string[])[];
  /** Styles for rendering the SVG. */
  public d3Styles: SVGOpts[];
  public leafletFunc: () => StyleFunction;
  public active: boolean;

  constructor(opts: TagConfigOpts) {
    const {
      title,
      osmElement,
      tag,
      values,
      displayNames,
      filter,
      map,
      leafletStyles,
      defaultDetail,
      active,
    } = opts;

    if (values.length !== displayNames.length) {
      throw new Error("values and displayNames arrays must be of same length");
    }

    this.detail = defaultDetail;
    this.title = title;
    this.osmElement = osmElement;
    this.tag = tag;
    this.values = values;
    this.displayNames = displayNames;
    this.filter = filter;
    this.map = map || ((feat: OverpassFeatureLike) => feat);
    this.leafletStyles = leafletStyles;
    this.defaultDetail = defaultDetail;
    this.active = active;

    this.queryParams = this.values.map((val) => {
      if (Array.isArray(val)) {
        return val
          .map((nestedVal) => {
            return assembleQuery(this.osmElement, this.tag, nestedVal);
          })
          .flat();
      } else {
        return assembleQuery(this.osmElement, this.tag, val);
      }
    });

    /** Mapping leaflet styles to SVG path styles */
    this.d3Styles = this.leafletStyles.map((style, i) => {
      return (Object.keys(style) as Array<MappedLeafletStyleKeys>).reduce(
        (prev, k) => {
          // In leaflet, fill is a boolean value
          const opt =
            k === "fill" && (style[k] === true || style[k] === false)
              ? "none"
              : style[k];
          const key: MappedSVGStyleKeys = STYLEMAP[k];
          return { ...prev, [key]: opt };
        },
        // default is no fill, stroke line caps are rounded to avoid chopped lines
        { strokeLinecap: "round", fill: "none" }
      );
    });

    this.leafletFunc = (): StyleFunction => {
      return (feat?: Feature) => {
        let style: CircleMarkerOptions = {};
        for (let i = 0; i < this.values.length; i++) {
          const val = this.values[i];
          if (
            !Array.isArray(val) &&
            feat?.properties![this.tag] === this.values[i]
          ) {
            style = this.leafletStyles[i];
          } else {
            for (const nested of val) {
              if (feat?.properties![this.tag] === nested) {
                style = this.leafletStyles[i];
              }
            }
          }
        }
        return style;
      };
    };
  }
}

/**
 * Assembles a query part for a given combination of OSM Element, OSM tag and value.
 */
const assembleQuery = (
  osmEl: string | string[],
  tag: string,
  value: string
): string[] => {
  return Array.isArray(osmEl)
    ? osmEl.map((e) => `${e}[${tag}="${value}"]`)
    : [`${osmEl}[${tag}="${value}"]`];
};
