/**
 * @name Aimbot
 * @description Automatically aims your weapon at the closest target
 * @author retrozy
 * @version 1.0.1
 * @downloadUrl https://raw.githubusercontent.com/Gimloader/builds/main/plugins/Aimbot.js
 * @webpage https://gimloader.github.io/plugins/Aimbot
 * @hasSettings true
 * @gamemode 2d
 * @changelog Made the pointer work normally when the plugin is disabled
 * @changelog Added settings for which characters should be targets
 */

// plugins/Aimbot/src/index.ts
function getProjectedPosition(startX, startY, distance, angle) {
  return {
    x: startX + Math.cos(angle) * distance,
    y: startY + Math.sin(angle) * distance
  };
}
var settings = api.settings.create([
  {
    type: "dropdown",
    id: "target",
    title: "Target",
    description: "The characters that the bot should target",
    options: [
      {
        label: "All",
        value: "all"
      },
      {
        label: "Only Players",
        value: "players"
      },
      {
        label: "Only Sentries",
        value: "sentries"
      }
    ],
    default: "all"
  },
  {
    type: "toggle",
    id: "skipTeamPlayers",
    title: "Ignore Team Players",
    description: "Makes the bot ignore players on your team",
    default: true
  }
]);
function getTargets() {
  let characters = [
    ...api.stores.phaser.scene.characterManager.characters.values()
  ].filter((char) => char.id !== api.stores.network.authId);
  if (settings.target === "players") {
    characters = characters.filter((char) => char.type === "player");
  } else if (settings.target === "sentries") {
    characters = characters.filter((char) => char.type === "sentry");
  }
  if (settings.skipTeamPlayers) {
    const myTeam = api.stores.me.myTeam;
    if (myTeam !== "__NO_TEAM_ID") {
      for (const charId of api.stores.teams.teams.get(api.stores.me.myTeam).characters.values()) {
        characters = characters.filter((char) => char.id !== charId);
      }
    }
  }
  return characters;
}
api.net.onLoad(() => {
  api.patcher.instead(
    api.stores.phaser.scene.inputManager.aimCursor,
    "update",
    () => {
    }
  );
  const mouse = api.stores.phaser.scene.inputManager.mouse;
  api.patcher.instead(mouse, "pointerUpdate", () => {
  });
  let projectedPosition = null;
  api.patcher.before(
    api.stores.phaser.scene.worldManager.projectiles,
    "fire",
    (_, [pointer]) => {
      if (projectedPosition) {
        pointer.worldX = projectedPosition.x;
        pointer.worldY = projectedPosition.y;
      }
    }
  );
  api.patcher.after(
    api.stores.phaser.mainCharacter.physics,
    "preUpdate",
    () => {
      const characters = api.stores.phaser.scene.characterManager.characters;
      if (characters.size === 1) return;
      const myPos = api.stores.phaser.mainCharacter.body;
      const targets = getTargets();
      if (targets.length === 0) return;
      const distances = targets.map(
        ({ body: otherPos }) => ({
          distance: Math.hypot(otherPos.x - myPos.x, otherPos.y - myPos.y),
          body: otherPos
        })
      );
      const { body: closestPlayer } = distances.reduce((prev, curr) => {
        return curr.distance < prev.distance ? curr : prev;
      });
      const angle = Math.atan2(
        closestPlayer.y - myPos.y,
        closestPlayer.x - myPos.x
      );
      projectedPosition = getProjectedPosition(myPos.x, myPos.y, 500, angle);
      const aimCursorWorldPos = api.stores.phaser.scene.inputManager.aimCursor.aimCursorWorldPos;
      aimCursorWorldPos.x = projectedPosition.x;
      aimCursorWorldPos.y = projectedPosition.y;
      mouse.worldX = projectedPosition.x;
      mouse.worldY = projectedPosition.y;
    }
  );
});
