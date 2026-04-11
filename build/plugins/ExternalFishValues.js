/**
 * @name ExternalFishValues
 * @description plugin for benji
 * @author retrozy
 * @version 1.0.0
 * @downloadUrl https://raw.githubusercontent.com/retrozy1/gimloader-plugins/main/build/plugins/ExternalFishValues.js
 * @gamemode fishtopia
 */

// plugins/ExternalFishValues/src/index.ts
var started = false;
var fishValues = {
  gray: 1,
  green: 2,
  red: 5,
  blue: 10,
  purple: 20,
  beach: 40,
  star: 65,
  galaxy: 100,
  berry: 150,
  gim: 5e3
};
function start(char) {
  const div = document.createElement("div");
  div.className = "bg-white absolute right-4 top-1/2 -translate-y-1/2";
  const interval = setInterval(() => {
    let total = 0;
    for (const [id, { amount }] of char.inventory.slots) {
      if (!id.endsWith("-fish")) continue;
      const fishName = id.split("-")[0];
      total += fishValues[fishName] * amount;
    }
    div.innerHTML = `without multiplier: $${total}_____________________with multiplier: $${Math.round(total * 1.3)}`;
  }, 500);
  api.onStop(() => {
    clearInterval(interval);
  });
  document.body.appendChild(div);
  api.onStop(() => {
    document.body.removeChild(div);
  });
}
if (api.net.isHost) {
  api.net.onLoad(() => {
    api.onStop(
      api.net.state.characters.onAdd((char) => {
        if (started || char.id === api.stores.network.authId) return;
        started = true;
        start(char);
      }, true)
    );
  });
}
