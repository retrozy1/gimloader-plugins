//Ops don't have payloads and types have payloads
enum Ops {
  IHaveManhunt
}

enum Types {
  HitRequest,
  HitConfirm,
  HitDeny,
  Settings,
  SettingsPatch
}

//The booleans are true because they would be ommited if false (to reduce buffer)
interface Settings {
  allowGuestEdits: boolean;
  //Everyone else in the lobby would be the runners so it only includes hunter IDs
  //I might be able to just index players if they are in order
  hunterIds: number[];
  hitRange: number;
  runnersCanHit?: true;
  frozenUntilRunnerMoves?: true;
  friendlyFire?: true;
}

type Payload =
  | [Types.HitRequest, number, number] //[Hit request ID, player ID to hit]
  | [Types.HitConfirm, number] //[Hit request ID]
  | [Types.HitDeny, number] //[Hit request ID]
  | [Types.Settings, Settings] //[Full settings for game]
  | [Types.SettingsPatch, Partial<Settings>] //[The settings that updated. Clients will calculate the new settings based on the initial settings]


api.net.onLoad(() => {
  const Communications = api.lib('Communications').Communications;
  const comms = new Communications('DUIManhunt');
  comms.send(Ops.IHaveManhunt);

  const playersWithManhunt = new Set<any>([/*ME*/]);
  const pendingHits = new Set<number>;

  comms.onMessage((message, player) => {
    if (typeof message === 'number') {
      switch (message) {
        case Ops.IHaveManhunt: {
          playersWithManhunt.add(player);
          //Broadcast back to them that you have manhunt
          comms.send(Ops.IHaveManhunt);
          break;
        }
      }
    } else {
      const [type, payload]: [Types, Payload] = message;

      switch (type) {
        case Types.HitRequest: {
          break;
        }
      }
    }
  });
});

function start() {

}