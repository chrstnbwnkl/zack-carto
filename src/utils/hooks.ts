import { useState } from "react";

/**
 * Custom hook that uses the browser's local storage to
 * persist state across reloads and sessions.
 */
export const useLocalStorage = (
  key: string,
  initialValue: string
): [string, (newValue: string | ((v: string) => string)) => void] => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue);
  const setStorage = (newValue: string | ((v: string) => string)) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : value;
    localStorage.setItem(key, valueToStore);
    setValue(valueToStore);
  };

  return [value, setStorage];
};
