import type { Settings } from "./types";

//Ops don't have payloads and types have payloads
//Damage[Amount] are ops and not type-payloads so they can be transmitted in one buffer
export enum Ops {
  IHaveManhunt,
  Damage1,
  Damage5,
  Damage25,
  Damage100
}

export enum Types {
  Settings,
  SettingsPatch
}

export type Payload =
  | [Types.Settings, Settings] //[Full settings for game]
  | [Types.SettingsPatch, Partial<Settings>]; //[The settings that updated. Clients will calculate the new settings based on the initial settings]