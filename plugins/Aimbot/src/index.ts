import type { Vector } from '@dimforge/rapier2d-compat'


interface BodyAndDistance {
  body: Vector,
  distance: number;
}

// const Fe = () => api.stores.session.mapStyle === "platformer";

// const BC = {
//   center: (id: string) => {
//     const t = api.stores.phaser.scene.characterManager.characters.get(id),
//       e = (t == null ? void 0 : t.scale.baseScale) ?? 1;
//     return Fe() ? {
//       x: 0,
//       y: -3 * e
//     } : {
//       x: 0,
//       y: -20 * e
//     }
//   }
// }

// const ns = () => {
//     if (api.stores.me.inventory.activeInteractiveSlot === 0) return;
//     const g = `${api.stores.me.inventory.activeInteractiveSlot}`;
//     return api.stores.me.inventory.interactiveSlots.get(g);
// }

// const v6 = (g: boolean) => {
//     const t = ns()!;
//     if (!Mo(t.itemId)) return !1;
//     const e = api.stores.me.inventory.lastShotsTimestamps.get(t.itemId);
//     if (!e) return !0;
//     const I = Date.now(),
//         o = zt(t.itemId)!;
//     return g && !o.weapon!.shared.allowAutoFire ? !1 : o.weapon!.shared.cooldownBetweenShots ? I - e > o.weapon!.shared.cooldownBetweenShots : !0
// };

// const vf = (g: string) => api.stores.worldOptions.itemOptions.find(e => e.id === g);
// const Mo = (g: string) => {
//     var t;
//     return ((t = vf(g)) == null ? void 0 : t.type) === "weapon"
// };

// const zt = (g: string) => api.stores.worldOptions.itemOptions.find(t => t.id === g);

// const _i = (g: string) => api.stores.phaser.scene.worldManager.devices.getDeviceById(g);

// const TJ = () => {
//     if (!api.stores.me.classDesigner.activeClassDeviceId) return !0;
//     const g = _i(api.stores.me.classDesigner.activeClassDeviceId);
//     if (!g) return !1;
//     const t = g.options;
//     return !(t != null && t.allowedToUseGadget) || t.allowedToUseGadget === "doNotOverride" || t.allowedToUseGadget === "yes" ? !0 : t.allowedToUseGadget !== "no"
// };

// const JJ = () => {
//     const g = api.stores.characters.characters.get(api.stores.network.authId);
//     return g ? !g.allowWeaponFire : !1;
// }


// const jA = (id: string) => api.stores.phaser.scene.characterManager.characters.get(id);

// const Si = (g: number) => g * 100;
// const Zg = (g: number ) => g / 100;

// const XJ = (g: { characterId: string, angle?: number }) => {
//     var B, E, n, Q;
//     const {
//         characterId: t,
//         angle: e
//     } = g, I = jA(t);
//     if (!I) return null;
//     t === api.stores.network.authId && I.aimingAndLookingAround.update();
//     const o = e ?? I.aimingAndLookingAround.currentAngle ?? 0,
//         s = Si(((Q = (n = (E = zt((B = I.aimingAndLookingAround.currentWeaponId!))) == null ? void 0 : E.weapon) == null ? void 0 : n.shared) == null ? void 0 : Q.startingProjectileDistanceFromCharacter) ?? 0) * I.scale.baseScale,
//         r = BC.center(t);
//     return {
//         x: Math.cos(o) * s + (I.body.x + r.x),
//         y: Math.sin(o) * s + (I.body.y + r.y)
//     }
// };

// const q6 = (g: null | { angle: number }) => {
//     var B, E, n;
//     const e = api.stores.phaser.mainCharacter;
//     const t = api.stores.network.authId;
//     if (!e) return !1;
//     const I = BC.center(e.id),
//         o = {
//             x: (e.body.x + I.x) / 100,
//             y: (e.body.y + I.y) / 100
//         };
//     let s = XJ({
//         characterId: t,
//         angle: g == null ? undefined : g.angle
//     });
//     if (!s) return !1;
//     if (s = {
//             x: Zg(s.x),
//             y: Zg(s.y)
//         }, o.x === s.x && o.y === s.y) return !0;
//     const r = e.aimingAndLookingAround?.currentWeaponId ? zt(e.aimingAndLookingAround.currentWeaponId) : null;
//     return ((E = r == null ? void 0 : r.weapon) == null ? void 0 : E.type) !== "bullet" ? !0 : !((n = ra({
//         start: o,
//         end: s,
//         skipCharacters: !0
//     })) != null && n.hit)
// }

// const ra = g => {
//     const {
//         start: t,
//         end: e
//     } = g, I = g.skipCharacters ?? !1, {
//         world: o,
//         bodies: s
//     } = api.stores.phaser.scene.worldManager.physics;
//     api.stores.phaser.scene.worldManager.physics.bodies.activeBodies.enableBodiesAlongLine({
//         start: t,
//         end: e
//     });
//     o.updateSceneQueries();
//     const B = {
//             x: e.x - t.x,
//             y: e.y - t.y
//         },
//         E = new tt.Ray(t, B);
//     let n;
//     return o.intersectionsWithRay(E, 1, !0, Q => {
//         var u, d, f, F, M;
//         const c = (u = Q.collider.parent().userData) == null ? void 0 : u.id,
//             h = s.find(c);
//         return I && (h != null && h.character) || h != null && h.sensor || h != null && h.device && ((f = g.ignoredDevicesIds) != null && f.includes((d = h == null ? void 0 : h.device) == null ? void 0 : d.id)) || h != null && h.device && !_i((F = h == null ? void 0 : h.device) == null ? void 0 : F.id).checkIfCollidersEnabled() || g.ignoredBodyIds && g.ignoredBodyIds.includes(c) || (M = h == null ? void 0 : h.terrain) != null && M.removed ? !0 : n ? (Q.toi < n.toi && (n = Q), !0) : (n = Q, !0)
//     }, g.skipCharacters ? UB.EXCLUDE_DYNAMIC : void 0), {
//         ray: E,
//         hit: n
//     }
// }

// function fire(angle: number) {
//   const char = api.stores.phaser.mainCharacter;
//   const worldPos = api.stores.phaser.scene.inputManager.getMouseWorldXY();
//   const s = BC.center(char.id),
//       r = new Phaser.Math.Vector2(worldPos.x - char.body.x + s.x, worldPos.y - (char.body.y + s.y)).normalize(),
//       B = Phaser.Math.Angle.Between(0, 0, r.x, r.y),
//       E = api.stores.me.inventory.activeInteractiveSlot;
//   if (!E) return;
//   const n = api.stores.me.inventory.interactiveSlots.get(`${E}`);
//   if (!n || !Mo(n.itemId)) return;
//   const Q = zt(n.itemId)!;
//   if (char.aimingAndLookingAround.setTargetAngle(B, true), !!v6(true)) {
//       if (!TJ() || JJ() || Q.weapon!.type === "bullet" && !(n != null && n.currentClip) || !q6({
//               angle: B
//           })) {
//           return
//       }
//       Y6(), api.net.send("FIRE", {
//           angle: B,
//           x: char.body.x,
//           y: char.body.y
//       })
//   }
// }

function getProjectedPosition(startX: number, startY: number, distance: number, angle: number): Vector {
    return {
        x: startX + (Math.cos(angle) * distance),
        y: startY + (Math.sin(angle) * distance)
    };
}

api.net.onLoad(() => {
    api.stores.phaser.scene.inputManager.aimCursor.update = () => {};
        const mouse = api.stores.phaser.scene.inputManager.mouse;

    mouse.pointerUpdate = () => {}

    let projectedPosition: Vector | null = null;

    api.patcher.before(api.stores.phaser.scene.worldManager.projectiles, "fire", (_, [pointer]) => {
        if (projectedPosition) {
            pointer.worldX = projectedPosition.x;
            pointer.worldY = projectedPosition.y;
        }
    })
    
  api.patcher.after(api.stores.phaser.mainCharacter.physics, "preUpdate", () => {
    const characters = api.stores.phaser.scene.characterManager.characters;
    if (characters.size === 1) return;

    const myPos = api.stores.phaser.mainCharacter.body;

    const distances = [...characters]
        .filter(([charId]) => charId !== api.stores.network.authId)
        .map(
      ([_, { body: otherPos }]): BodyAndDistance => ({
        distance: Math.hypot(otherPos.x - myPos.x, otherPos.y - myPos.y),
        body: otherPos
      })
    );

    const { body: closestPlayer } = distances.reduce((prev, curr) => {
      return (curr.distance < prev.distance) ? curr : prev;
    });
    // console.log(closestPlayer)

    const angle = Math.atan2(closestPlayer.y - myPos.y, closestPlayer.x - myPos.x);
    projectedPosition = getProjectedPosition(myPos.x, myPos.y, 500, angle);
    // console.log(projectedPosition);
    

    // const aimCursor = api.stores.phaser.scene.inputManager.aimCursor;
    // // aimCursor.x = projectedPosition.x
    // // aimCursor.y = projectedPosition.y
    // aimCursor.aimCursor.x = projectedPosition.x;
    // aimCursor.aimCursor.y = projectedPosition.y;
    // const mousePointer = api.stores.phaser.scene.input.mousePointer;
    // // mousePointer.x = projectedPosition.x;
    // // mousePointer.y = projectedPosition.y;

    const d = api.stores.phaser.scene.inputManager.aimCursor.aimCursorWorldPos;
    d.x = projectedPosition.x;
    d.y = projectedPosition.y;
    mouse.worldX = projectedPosition.x;
    mouse.worldY = projectedPosition.y;
    
  });
})