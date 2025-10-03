import type { Settings } from "./types";

export const defaultSettings: Settings = {
  allowGuestEdits: false,
  runnerIds: [],
  hunterSettings: {
    health: 200,
    //todo find a good one
    hitRange: 5,
    frozenUntilOtherTeamMoves: true,
    
    canHit: true
  },
  runnerSettings: {
    health: 500,
    //todo find a good one
    hitRange: 5,
    canHit: true
  }
};

export const pluginName = 'DUIManhunt';