import type { Settings } from "./types";

//The ops are 101+ so I can send a normal number for "I took damage" for 1/5/25/100 damages
export enum Ops {
  IHaveManhunt = 101,
  TurningOffManhunt
}

export enum Types {
  Settings,
  SettingsPatch
}

export type Payload =
  | [Types.Settings, Settings] //[Full settings for game]
  | [Types.SettingsPatch, Partial<Settings>]; //[The settings that updated. Clients will calculate the new settings based on the initial settings]