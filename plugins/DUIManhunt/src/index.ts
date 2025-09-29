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

interface Settings {
  allowGuestEdits: boolean;
  //Everyone else in the lobby would be the runners so it only includes hunter IDs
  //I might be able to just index players if they are in order
  hunterIds: number[];
  hitRange: number;
  runnersCanHit?: true;
  friendlyFire?: true;
}

type Payloads =
  | [Types.HitRequest, number, number] //Sequence number, player ID to hit
  | [Types.HitConfirm, number] //Sequence number
  | [Types.HitDeny, number] //Sequence number


api.net.onLoad(() => {
  const Communications = api.lib('Communications').Communications;
  const comms = new Communications('DUIManhunt');
  comms.send(Ops.IHaveManhunt);

  const playersWithManhunt = new Set<any>([/*ME*/]);
  const pendingHits

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
      const [type, payload]: [Types, any] = message;

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