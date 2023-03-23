import React, { FunctionComponent, PropsWithChildren } from "react";
import { Settings } from "../../config";

type ToggleAdvancedModeProps = {
  settings: Settings;
  onSettingsUpdate: (k: string, v: boolean) => void;
  className?: string;
};

const ToggleAdvancedMode: FunctionComponent<
  PropsWithChildren<ToggleAdvancedModeProps>
> = ({ settings, onSettingsUpdate, className, children }) => {
  return (
    <button
      onClick={() => {
        onSettingsUpdate("advanced", !settings.advanced);
      }}
      className={`${className || ""} normal-case`}
    >
      {children}
    </button>
  );
};

export default ToggleAdvancedMode;