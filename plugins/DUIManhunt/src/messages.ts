import type { Settings } from "./types";

//Ops don't have payloads and types have payloads
export enum Ops {
  IHaveManhunt
}

export enum Types {
  HitRequest,
  HitConfirm,
  HitDeny,
  Settings,
  SettingsPatch
}

export type Payload =
  | [Types.HitRequest, number, number] //[Hit request ID, player ID to hit]
  | [Types.HitConfirm, number] //[Hit request ID]
  | [Types.HitDeny, number] //[Hit request ID]
  | [Types.Settings, Settings] //[Full settings for game]
  | [Types.SettingsPatch, Partial<Settings>] //[The settings that updated. Clients will calculate the new settings based on the initial settings]