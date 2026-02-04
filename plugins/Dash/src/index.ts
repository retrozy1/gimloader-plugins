import type { KinematicCharacterController } from '@dimforge/rapier2d-compat';

let lastDash = 0;

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

		const controller = (
			mainCharacter.physics.getBody().character as unknown as {
				controller: KinematicCharacterController;
			}
		).controller;

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
