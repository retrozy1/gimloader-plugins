import type { Settings } from "./types";

export const defaultSettings: Settings = {
  allowGuestEdits: false,
  hitRange: 50,
  frozenUntilRunnerMoves: true,
  runnersCanHit: true,
  runnerIds: []
};

export const pluginName = 'DUIManhunt';