export const makeReadableEnumeration = (arr, i) => {
  if (i == 0 || i == 1 || i == arr.length - 1) {
    return arr[i]
  } else {
    return `${arr.slice(1, i).join(", ")} & ${arr[i]}`
  }
}
