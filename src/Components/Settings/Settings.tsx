import React from "react";
import { Settings } from "../../config";

interface SettingsProps {
  onChange: (key: string, value: number | string) => void;
  settings: Settings;
}

const SettingsModal = ({ onChange, settings }: SettingsProps) => {
  return (
    <>
      <input type="checkbox" id="settings-modal" className="modal-toggle" />
      <label htmlFor="settings-modal" className="modal cursor-pointer">
        <label className="modal-box relative w-3/4 max-w-xl" htmlFor="">
          <h2 className="pb-6 text-center text-2xl font-bold text-blue drop-shadow-md">
            Settings
          </h2>
          <div className=" text-blue">
            <form>
              <div className="flex justify-between pb-2">
                <label
                  htmlFor="timeout-input"
                  title="The number of seconds Overpass will take to return a result. 
                If the query hasn't finished by the end of the timeout, an empty result set 
                is returned."
                >
                  Overpass timeout (seconds):{" "}
                </label>
                <input
                  id="timeout-input"
                  type="number"
                  className="input-bordered input h-8 w-24"
                  min="1"
                  max="360"
                  value={settings?.timeout}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChange("timeout", Number(e.target.value));
                  }}
                />
              </div>
              <div className="flex justify-between">
                <label
                  htmlFor="url-input"
                  title="The URL that points to the Overpass instance that will be queried. A full list of available public instances can be found at https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances"
                >
                  Overpass URL:{" "}
                </label>
                <input
                  id="url-input"
                  type="text"
                  className="input-bordered input h-8 w-96"
                  value={settings.url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChange("url", e.target.value);
                  }}
                />
              </div>
            </form>
          </div>
        </label>
      </label>
    </>
  );
};

export default SettingsModal;
