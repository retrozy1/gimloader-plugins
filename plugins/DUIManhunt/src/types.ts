enum Team {
  Hunters,
  Runners
}

interface GlobalSettings {
  //range that the team with this setting can GET HIT on, not the other way around
  hitRange: number;
  health: number;
  canHit?: boolean;
  //Not making this customizable because it's cheating and anticheat will catch it if it's not small.
  knockback?: boolean;
  frozenUntilOtherTeamMoves?: boolean;
  friendlyFire?: boolean;
}

export interface Settings {
  allowGuestEdits: boolean;

  //Everyone else in the lobby would be the hunters so it only includes runner IDs
  //I might be able to just index players if they are in order
  runnerIds: string[];
  hunterSettings: GlobalSettings;
  runnerSettings: GlobalSettings;
}

export interface Position {
  x: number;
  y: number;
}