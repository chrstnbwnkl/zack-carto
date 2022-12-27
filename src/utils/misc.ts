export const makeReadableEnumeration = (arr: string[], i: number): string => {
  if (i === 0 || i === arr.length - 1) {
    return arr[i];
  } else {
    return `${arr.slice(0, i).join(", ")} & ${arr[i]}`;
  }
};
