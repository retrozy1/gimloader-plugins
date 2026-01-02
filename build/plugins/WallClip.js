/**
 * @name WallClip
 * @description Allows you to clip through walls and the ground
 * @author retrozy
 * @version 0.1.0
 * @downloadUrl https://raw.githubusercontent.com/retrozy1/gimloader-plugins/main/build/plugins/WallClip.js
 * @gamemode 2d
 */

// plugins/WallClip/src/index.ts
var platformerMax = 0.05167007446288352;
var topDownMax = 0.05166816711;
var tick = 1 / 12 * 1e3;
var interval = null;
function stopInterval() {
  if (!interval) return;
  clearInterval(interval);
  interval = null;
}
api.hotkeys.addConfigurableHotkey({
  category: "Wall Clip",
  title: "Clip on click +",
  default: {
    key: "KeyC"
  }
}, () => {
  if (!api.stores?.phaser.scene.game.input.mousePointer?.isDown) return;
  stopInterval();
  const mouseWorldVector = api.stores.phaser.scene.inputManager.getMouseWorldXY();
  const target = { x: mouseWorldVector.x / 100, y: mouseWorldVector.y / 100 };
  const rb = api.stores.phaser.mainCharacter.physics.getBody().rigidBody;
  const translation = rb.translation();
  const downDistance = target.y - translation.y;
  const upDistance = -downDistance;
  const verticalDistance = Math.max(downDistance, upDistance);
  const rightDistance = translation.x - target.x;
  const leftDistance = -rightDistance;
  const isPlatformer = !!api.stores.phaser.mainCharacter.physics.state.gravity;
  const max = isPlatformer ? platformerMax : topDownMax;
  if (rightDistance > leftDistance && rightDistance > verticalDistance) {
    interval = setInterval(() => {
      const translation2 = rb.translation();
      const distance = translation2.x - target.x;
      if (max > distance) {
        stopInterval();
      }
      rb.setTranslation({ x: translation2.x - Math.min(max, distance), y: translation2.y }, true);
    }, tick);
  } else if (leftDistance > rightDistance && leftDistance > verticalDistance) {
    interval = setInterval(() => {
      const translation2 = rb.translation();
      const distance = target.x - translation2.x;
      if (max > distance) {
        stopInterval();
      }
      rb.setTranslation({ x: translation2.x + Math.min(max, distance), y: translation2.y }, true);
    }, tick);
  } else if (downDistance > upDistance) {
    interval = setInterval(() => {
      const translation2 = rb.translation();
      const distance = target.y - translation2.y;
      if (max > distance) {
        stopInterval();
      }
      rb.setTranslation({ x: translation2.x, y: translation2.y + Math.min(max, distance) }, true);
    }, tick);
  } else if (!isPlatformer) {
    interval = setInterval(() => {
      const translation2 = rb.translation();
      const distance = translation2.y - target.y;
      if (max > distance) {
        stopInterval();
      }
      rb.setTranslation({ x: translation2.x, y: translation2.y - Math.min(max, distance) }, true);
    }, tick);
  }
});
api.net.onLoad(() => {
  api.net.on("PHYSICS_STATE", () => {
    if (!interval) return;
    stopInterval();
    api.notification.error({
      message: "Clip canceled due to lag back"
    });
  });
  const { inputManager } = api.stores.phaser.scene;
  api.patcher.before(inputManager, "getPhysicsInput", () => {
    const { currentInput } = inputManager;
    if (currentInput.angle !== null || currentInput.jump || currentInput._jumpKeyPressed) {
      stopInterval();
    }
  });
});
api.onStop(stopInterval);
