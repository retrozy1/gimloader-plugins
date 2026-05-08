/**
 * @name Aimbot
 * @description aim bot
 * @author retrozy
 * @version 1.0.0
 * @downloadUrl https://raw.githubusercontent.com/retrozy1/gimloader-plugins/main/build/plugins/Aimbot.js
 * @gamemode 2d
 */

// plugins/Aimbot/src/index.ts
function getProjectedPosition(startX, startY, distance, angle) {
  return {
    x: startX + Math.cos(angle) * distance,
    y: startY + Math.sin(angle) * distance
  };
}
api.net.onLoad(() => {
  api.stores.phaser.scene.inputManager.aimCursor.update = () => {
  };
  const mouse = api.stores.phaser.scene.inputManager.mouse;
  mouse.pointerUpdate = () => {
  };
  let projectedPosition = null;
  api.patcher.before(api.stores.phaser.scene.worldManager.projectiles, "fire", (_, [pointer]) => {
    if (projectedPosition) {
      pointer.worldX = projectedPosition.x;
      pointer.worldY = projectedPosition.y;
    }
  });
  api.patcher.after(api.stores.phaser.mainCharacter.physics, "preUpdate", () => {
    const characters = api.stores.phaser.scene.characterManager.characters;
    if (characters.size === 1) return;
    const myPos = api.stores.phaser.mainCharacter.body;
    const distances = [...characters].filter(([charId]) => charId !== api.stores.network.authId).map(
      ([_, { body: otherPos }]) => ({
        distance: Math.hypot(otherPos.x - myPos.x, otherPos.y - myPos.y),
        body: otherPos
      })
    );
    const { body: closestPlayer } = distances.reduce((prev, curr) => {
      return curr.distance < prev.distance ? curr : prev;
    });
    const angle = Math.atan2(closestPlayer.y - myPos.y, closestPlayer.x - myPos.x);
    projectedPosition = getProjectedPosition(myPos.x, myPos.y, 500, angle);
    const d = api.stores.phaser.scene.inputManager.aimCursor.aimCursorWorldPos;
    d.x = projectedPosition.x;
    d.y = projectedPosition.y;
    mouse.worldX = projectedPosition.x;
    mouse.worldY = projectedPosition.y;
  });
});
