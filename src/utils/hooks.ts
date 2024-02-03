import { useState } from "react";
import { OSMTags, ZackConfig } from "../config";
import { Layer } from "./osm";

type JSONValue = number | string | boolean | JSONArray | JSONObject;
type JSONArray = JSONValue[];
type JSONObject = { [k: string]: JSONValue };

/**
 * Custom hook that uses the browser's local storage to
 * persist state across reloads and sessions.
 */
export function useJSONLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (newValue: T | ((v: T) => T)) => void] {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem(key) as string) || initialValue
  );
  const setStorage = (newValue: T | ((v: T) => T)) => {
    const valueToStore =
      newValue instanceof Function ? newValue(value) : newValue;
    localStorage.setItem(key, JSON.stringify(valueToStore));
    setValue(valueToStore);
  };

  return [value, setStorage];
}

type PersistableZackConfig = {
  [k in OSMTags]: Pick<Layer, "active" | "detail">;
};

/**
 * Custom hook for persisting part of the config in the browser's local storage.
 */
export const useZackConfigState = (
  key: string,
  initialConfig: ZackConfig
): [
  ZackConfig,
  (newValue: ZackConfig | ((v: ZackConfig) => ZackConfig)) => void
] => {
  const [persistedConfig, setPersistedConfig] = useState(
    JSON.parse(localStorage.getItem(key) as string) ||
      (Object.keys(initialConfig) as OSMTags[]).reduce((prev, k) => {
        const c: Layer = initialConfig[k];
        return { ...prev, [k]: { detail: c.detail, active: c.active } };
      }, {})
  );
  const [config, setConfig] = useState(initialConfig);

  const setStorage = (
    newValue: ZackConfig | ((c: ZackConfig) => ZackConfig)
  ) => {
    const mergedConfigState: ZackConfig = (
      Object.keys(persistedConfig) as OSMTags[]
    ).reduce((prev, k) => {
      return { ...prev, [k]: { ...config[k], ...persistedConfig[k] } };
    }, {}) as ZackConfig;
    const newConfig =
      newValue instanceof Function ? newValue(mergedConfigState) : newValue;

    setPersistedConfig((curr: PersistableZackConfig) => {
      const newPersistableConfig: PersistableZackConfig = (
        Object.keys(newConfig) as OSMTags[]
      ).reduce((prev, k) => {
        const c: Layer = newConfig[k];
        return { ...prev, [k]: { detail: c.detail, active: c.active } };
      }, {}) as PersistableZackConfig;
      localStorage.setItem(key, JSON.stringify(newPersistableConfig));
      return newPersistableConfig;
    });
    setConfig(newConfig);
  };
  const mergedConfigState: ZackConfig = (
    Object.keys(persistedConfig) as OSMTags[]
  ).reduce((prev, k) => {
    return { ...prev, [k]: { ...config[k], ...persistedConfig[k] } };
  }, {}) as ZackConfig;
  return [mergedConfigState, setStorage];
};
