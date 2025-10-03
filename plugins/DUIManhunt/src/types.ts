export interface Settings {
  allowGuestEdits: boolean;
  //Everyone else in the lobby would be the hunters so it only includes runner IDs
  //I might be able to just index players if they are in order
  runnerIds: string[];
  hitRange: number;
  runnerHealth: number;
  hunterHealth: number;
  runnersCanHit: boolean;
  frozenUntilRunnerMoves: boolean;
  friendlyFire: boolean;
}

export interface Position {
  x: number;
  y: number;
}