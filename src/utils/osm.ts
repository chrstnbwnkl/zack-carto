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

const STYLEMAP: { [k in MappedLeafletStyleKeys]: MappedSVGStyleKeys } = {
  color: "stroke",
  fillOpacity: "fillOpacity",
  weight: "strokeWidth",
  radius: "r",
  fillColor: "fill",
  fill: "fill",
};

interface TagConfigOpts {
  title: string;
  osmElement: string;
  tag: string;
  values: (string | string[])[];
  displayNames: string[];
  filter: (feat: OverpassFeatureLike) => boolean;
  leafletStyles: CircleMarkerOptions[];
  defaultDetail: number;
  active: boolean;
}

export class TagConfig {
  public title: string;
  public osmElement: string;
  public tag: string;
  public values: (string | string[])[];
  public displayNames: string[];
  public filter: (feat: OverpassFeatureLike) => boolean;
  public leafletStyles: CircleMarkerOptions[];
  public defaultDetail: number;
  public detail: number;
  public queryParams: (string | string[])[];
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
    this.leafletStyles = leafletStyles;
    this.defaultDetail = defaultDetail;
    this.active = active;

    this.queryParams = this.values.map((val) => {
      if (Array.isArray(val)) {
        return val.map((nestedVal) => {
          return assembleQuery(this.osmElement, this.tag, nestedVal);
        });
      } else {
        return assembleQuery(this.osmElement, this.tag, val);
      }
    });

    this.d3Styles = this.leafletStyles.map((style, i) => {
      return (Object.keys(style) as Array<MappedLeafletStyleKeys>).reduce(
        (prev, k) => {
          const opt =
            k === "fill" && (style[k] === true || style[k] === false)
              ? "none"
              : style[k];
          const key: MappedSVGStyleKeys = STYLEMAP[k];
          return { ...prev, [key]: opt };
        },
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

const assembleQuery = (osmEl: string, tag: string, value: string) => {
  return `${osmEl}[${tag}="${value}"]`;
};
