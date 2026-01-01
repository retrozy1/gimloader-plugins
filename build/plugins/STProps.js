/**
 * @name STProps
 * @description Allows you to use Season Ticket items in creative
 * @author retrozy
 * @version 1.0.0
 * @downloadUrl https://raw.githubusercontent.com/retrozy1/gimloader-plugins/main/build/plugins/STProps.js
 * @gamemode creative
 */

// plugins/STProps/src/index.ts
api.net.onLoad(() => {
  function removeSeasonTicket(items, destination = items) {
    const seasonTicketsRequired = /* @__PURE__ */ new Set();
    for (const item of items) {
      if (!item.seasonTicketRequired) continue;
      seasonTicketsRequired.add(item.id);
      item.seasonTicketRequired = false;
    }
    api.onStop(() => {
      for (const itemId of seasonTicketsRequired) {
        destination.find((p) => p.id === itemId).seasonTicketRequired = true;
      }
    });
  }
  const { worldOptions } = api.stores;
  if (worldOptions.hasAllProps) {
    removeSeasonTicket(worldOptions.propsOptions);
  } else {
    api.net.on("ALL_PROPS", (props) => removeSeasonTicket(props, worldOptions.propsOptions));
  }
  removeSeasonTicket(worldOptions.terrainOptions);
  removeSeasonTicket(worldOptions.deviceOptions);
});
api.net.modifyFetchResponse("/api/created-map/basics", (options) => {
  options.mapLimit = 25;
});
