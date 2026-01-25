/**
 * @name InstantEnd
 * @description Instantly ends games you create when you close the tab
 * @author retrozy
 * @version 1.0.1
 * @downloadUrl https://raw.githubusercontent.com/retrozy1/gimloader-plugins/main/build/plugins/InstantEnd.js
 * @gamemode 2d
 * @changelog Allowed ending instantly when in lobby
 */

// plugins/InstantEnd/src/index.ts
api.net.onLoad(() => {
  if (!api.net.isHost) return;
  const beforeUnload = () => {
    api.net.send("KICK_PLAYER", {
      characterId: api.stores.network.authId
    });
  };
  window.addEventListener("beforeunload", beforeUnload);
  api.onStop(() => {
    window.removeEventListener("beforeunload", beforeUnload);
  });
});
