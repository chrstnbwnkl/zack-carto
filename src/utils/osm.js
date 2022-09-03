const NONE_DISPLAY = "none"

export class TagConfig {
  constructor({
    title,
    osmElement,
    tag,
    values,
    displayNames,
    filter,
    defaultStyle,
    defaultDetail,
  }) {
    this.title = title
    this.osmElement = osmElement
    this.tag = tag
    this.values = values
    this.displayNames = [NONE_DISPLAY, ...displayNames]
    this.filter = filter
    this.defaultStyle = defaultStyle
    this.defaultDetail = defaultDetail

    this.queryParams = [
      "",
      ...this.values.map((val) => {
        if (Array.isArray(val)) {
          val.map((nestedVal) => {
            return assembleQuery(this.osmElement, this.tag, nestedVal)
          })
        } else {
          return assembleQuery(this.osmElement, this.tag, val)
        }
      }),
    ]
  }
}

const assembleQuery = (osmEl, tag, value) => {
  return `${osmEl}[${tag}="${value}"]`
}
