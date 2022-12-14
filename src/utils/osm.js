const NONE_DISPLAY = "none"

const STYLEMAP = {
  color: "stroke",
  fillOpacity: "fillOpacity",
  weight: "strokeWidth",
  radius: "r",
  fillColor: "fill",
  fill: "fill",
}

export class TagConfig {
  constructor({
    title,
    osmElement,
    tag,
    values,
    displayNames,
    filter,
    leafletStyles,
    defaultDetail,
  }) {
    if (values.length !== displayNames.length) {
      throw new Error("values and displayNames arrays must be of same length")
    }

    this._detail = defaultDetail
    this.title = title
    this.osmElement = osmElement
    this.tag = tag
    this.values = values
    this.displayNames = [NONE_DISPLAY, ...displayNames]
    this.filter = filter
    this.leafletStyles = leafletStyles
    this.defaultDetail = defaultDetail

    this.queryParams = [
      "",
      ...this.values.map((val) => {
        if (Array.isArray(val)) {
          return val.map((nestedVal) => {
            return assembleQuery(this.osmElement, this.tag, nestedVal)
          })
        } else {
          return assembleQuery(this.osmElement, this.tag, val)
        }
      }),
    ]

    this._leafletFunc = (feat) => {
      for (let i = 0; i < this.values.length; i++) {
        const val = this.values[i]
        if (!Array.isArray(val)) {
          if (feat.properties[this.tag] === this.values[i]) {
            return this.leafletStyles[i]
          }
        } else {
          for (const nested of val) {
            if (feat.properties[this.tag] === nested) {
              return this.leafletStyles[i]
            }
          }
        }
      }
    }

    this._d3Styles = this.leafletStyles.map((style, i) => {
      return Object.keys(style).reduce(
        (prev, k) => {
          const opt = style[k]
          return { ...prev, [STYLEMAP[k]]: opt }
        },
        { strokeLinecap: "round", fill: "none" }
      )
    })
  }
}

const assembleQuery = (osmEl, tag, value) => {
  return `${osmEl}[${tag}="${value}"]`
}
