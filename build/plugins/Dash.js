/**
 * @name Dash
 * @description Allows you to dash and 'boost' your character in the direction you are facing
 * @author retrozy
 * @version 0.1.0
 * @downloadUrl https://raw.githubusercontent.com/retrozy1/gimloader-plugins/main/build/plugins/Dash.js
 * @needsPlugin Desynchronize | https://raw.githubusercontent.com/Gimloader/client-plugins/refs/heads/main/build/plugins/Desynchronize.js
 */

// plugins/Dash/src/index.ts
var lastDash = 0;
api.hotkeys.addConfigurableHotkey(
	{
		title: 'Dash',
		category: 'Dash',
		default: {
			key: 'KeyM'
		}
	},
	() => {
		if (api.net.type === 'None' || Date.now() - lastDash < 500) return;
		lastDash = Date.now();
		const mainCharacter = api.stores.phaser.mainCharacter;
		const body = mainCharacter.physics.getBody();
		const rb = body.rigidBody;
		const translation = rb.translation();
		const controller = mainCharacter.physics.getBody().character.controller;
		controller.computeColliderMovement(body.collider, {
			x: mainCharacter.flip.isFlipped ? -3 : 3,
			y: 0
		});
		const computedMovement = controller.computedMovement();
		rb.setTranslation(
			{
				x: translation.x + computedMovement.x,
				y: translation.y + computedMovement.y
			},
			true
		);
	}
);
