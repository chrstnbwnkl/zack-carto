/**
 * Turns a list of strings into nice, human readable enumerations :—)
 */
export const makeReadableEnumeration = (arr: string[], i: number): string => {
  if (i === 0 || i === arr.length - 1) {
    // if the index points to the last element in the array, we assume there is
    // a meaningful string indicating all possible values for a tag are taken into
    // account, such as "all roads".
    return arr[i];
  } else {
    return `${arr.slice(0, i).join(", ")} & ${arr[i]}`;
  }
};
