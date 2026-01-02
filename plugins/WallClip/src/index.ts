const platformerMax = 0.0516700744628835167;
const topDownMax = 0.05166816711;
const tick = 1 / 12 * 1000;

let interval: ReturnType<typeof setInterval> | null = null;

function stopInterval() {
  if (!interval) return;
  clearInterval(interval);
  interval = null;
}

api.hotkeys.addConfigurableHotkey({
  category: 'Wall Clip',
  title: 'Clip on click +',
  default: {
    key: 'KeyC',
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
  const verticalDistance = Math.max(downDistance, upDistance)
  const rightDistance = translation.x - target.x;
  const leftDistance = -rightDistance;

  const isPlatformer = !!api.stores.phaser.mainCharacter.physics.state.gravity;
  const max = isPlatformer ? platformerMax : topDownMax;

  if (
    (rightDistance > leftDistance) && (rightDistance > verticalDistance)
  ) {
    interval = setInterval(() => {
      const translation = rb.translation();
      const distance = translation.x - target.x;
      if (max > distance) {
        stopInterval();
      }
      rb.setTranslation({ x: translation.x - Math.min(max, distance), y: translation.y }, true);
    }, tick)
  } else if (
    (leftDistance > rightDistance) && (leftDistance > verticalDistance)
  ) {
    interval = setInterval(() => {
      const translation = rb.translation();
      const distance = target.x - translation.x;
      if (max > distance) {
        stopInterval();
      }
      rb.setTranslation({ x: translation.x + Math.min(max, distance), y: translation.y }, true);
    }, tick)
  } else if (downDistance > upDistance) {
    interval = setInterval(() => {
      const translation = rb.translation();
      const distance = target.y - translation.y;
      if (max > distance) {
        stopInterval();
      }
      rb.setTranslation({ x: translation.x, y: translation.y + Math.min(max, distance) }, true);
    }, tick)
  } else if (!isPlatformer) {
    interval = setInterval(() => {
      const translation = rb.translation();
      const distance = translation.y - target.y;
      if (max > distance) {
        stopInterval();
      }
      rb.setTranslation({ x: translation.x, y: translation.y - Math.min(max, distance) }, true);
    }, tick)
  }
})

api.net.onLoad(() => {
  api.net.on("PHYSICS_STATE", () => {
    if (!interval) return;
    stopInterval();
    api.notification.error({
      message: 'Clip canceled due to lag back'
    });
  })

  const { inputManager } = api.stores.phaser.scene;
  api.patcher.before(inputManager, 'getPhysicsInput', () => {
    const { currentInput } = inputManager;
    if (currentInput.angle !== null || currentInput.jump || currentInput._jumpKeyPressed) {
      stopInterval();
    }
  })
})

api.onStop(stopInterval)