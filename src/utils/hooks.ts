import { useState } from "react";
import { OSMTags, ZackConfig } from "../config";
import { Layer } from "./osm";

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
    const valueToStore =
      newValue instanceof Function ? newValue(value) : newValue;
    localStorage.setItem(key, valueToStore);
    setValue(valueToStore);
  };

  return [value, setStorage];
};

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
        console.log("shouldnt run");
        return { ...prev, [k]: { detail: c.detail, active: c.active } };
      }, {})
  );
  console.log(persistedConfig);

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
