import type { Settings } from "./types";

export const defaultSettings: Settings = {
  allowGuestEdits: false,
  hitRange: 50,
  frozenUntilRunnerMoves: true,
  runnersCanHit: true,
  runnerIds: [],
  hunterHealth: 200,
  runnerHealth: 500
};

export const pluginName = 'DUIManhunt';