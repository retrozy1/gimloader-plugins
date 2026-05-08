import type { Vector } from '@dimforge/rapier2d-compat';

interface BodyAndDistance {
	body: Vector;
	distance: number;
}

function getProjectedPosition(
	startX: number,
	startY: number,
	distance: number,
	angle: number
): Vector {
	return {
		x: startX + Math.cos(angle) * distance,
		y: startY + Math.sin(angle) * distance
	};
}

const settings = api.settings.create([
	{
		type: 'dropdown',
		id: 'target',
		title: 'Target',
		description: 'The characters that the bot should target',
		options: [
			{
				label: 'All',
				value: 'all'
			},
			{
				label: 'Only Players',
				value: 'players'
			},
			{
				label: 'Only Sentries',
				value: 'sentries'
			}
		],
		default: 'all'
	},
	{
		type: 'toggle',
		id: 'skipTeamPlayers',
		title: 'Ignore Team Players',
		description: 'Makes the bot ignore players on your team',
		default: true
	}
]);

function getTargets() {
	let characters = [
		...api.stores.phaser.scene.characterManager.characters.values()
	].filter((char) => char.id !== api.stores.network.authId);

	if (settings.target === 'players') {
		characters = characters.filter((char) => char.type === 'player');
	} else if (settings.target === 'sentries') {
		characters = characters.filter((char) => char.type === 'sentry');
	}

	if (settings.skipTeamPlayers) {
		const myTeam = api.stores.me.myTeam;
		if (myTeam !== '__NO_TEAM_ID') {
			for (const charId of api.stores.teams.teams
				.get(api.stores.me.myTeam)!
				.characters.values()) {
				characters = characters.filter((char) => char.id !== charId);
			}
		}
	}

	return characters;
}

api.net.onLoad(() => {
	api.patcher.instead(
		api.stores.phaser.scene.inputManager.aimCursor,
		'update',
		() => {}
	);

	const mouse = api.stores.phaser.scene.inputManager.mouse;

	api.patcher.instead(mouse, 'pointerUpdate', () => {});

	let projectedPosition: Vector | null = null;

	api.patcher.before(
		api.stores.phaser.scene.worldManager.projectiles,
		'fire',
		(_, [pointer]) => {
			if (projectedPosition) {
				pointer.worldX = projectedPosition.x;
				pointer.worldY = projectedPosition.y;
			}
		}
	);

	api.patcher.after(
		api.stores.phaser.mainCharacter.physics,
		'preUpdate',
		() => {
			const characters = api.stores.phaser.scene.characterManager.characters;
			if (characters.size === 1) return;

			const myPos = api.stores.phaser.mainCharacter.body;

			const targets = getTargets();
			if (targets.length === 0) return;
			const distances = targets.map(
				({ body: otherPos }): BodyAndDistance => ({
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

			const aimCursorWorldPos =
				api.stores.phaser.scene.inputManager.aimCursor.aimCursorWorldPos;
			aimCursorWorldPos.x = projectedPosition.x;
			aimCursorWorldPos.y = projectedPosition.y;
			mouse.worldX = projectedPosition.x;
			mouse.worldY = projectedPosition.y;
		}
	);
});
