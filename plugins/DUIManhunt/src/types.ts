//The booleans are true because they would be ommited if false (to reduce buffer)
export interface Settings {
  allowGuestEdits: boolean;
  //Everyone else in the lobby would be the hunters so it only includes runner IDs
  //I might be able to just index players if they are in order
  runnerIds: string[];
  hitRange: number;
  runnerHealth: number;
  hunterHealth: number;
  runnersCanHit?: true;
  frozenUntilRunnerMoves?: true;
  friendlyFire?: true;
}

export interface Position {
  x: number;
  y: number;
}