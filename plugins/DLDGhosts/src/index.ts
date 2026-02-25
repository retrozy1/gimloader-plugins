import type { IRecording } from 'client-plugins/plugins/InputRecorder/types';
import { mount, unmount } from 'svelte';
import Ghosts from './Ghosts.svelte';
import type { Ghost } from './types';

type CreatePhysics = (char: Gimloader.Stores.Character) => string;
type ApplyTickInput = (options: {
	characterId: string;
	input: Gimloader.Stores.TickInput;
	reconciliation?: boolean;
}) => void;

let createPhysics: CreatePhysics | null = null;
let applyTickInput: ApplyTickInput | null = null;

const fileCheck =
	'this.projectileHitForcesHistory=new Map,this.projectileHitForcesQueue=new Set';

api.rewriter.exposeVar('App', {
	check: fileCheck,
	find: /.feetSensorPosition.topDown,(\w+)=/,
	callback(val: CreatePhysics) {
		createPhysics = val;
	}
});

api.rewriter.exposeVar('App', {
	check: fileCheck,
	find: /.me.classDesigner.lastActivatedClassDeviceId\)},(\w+)=/,
	callback(val: ApplyTickInput) {
		applyTickInput = val;
	}
});

const nops = {
	onChange: () => {},
	listen: () => {}
};

function createGhost(
	id: string,
	recording: IRecording,
	name: string,
	skinId: string
) {
	if (!createPhysics || !applyTickInput) return;

	const ghost: Record<string, any> = {
		x: recording.startPos.x * 100,
		y: recording.startPos.y * 100,
		id,
		listen: () => {},
		scale: 1,
		classDesigner: nops,
		appearance: nops,
		permissions: nops,
		inventory: {
			...nops,
			interactiveSlots: nops
		},
		xp: nops,
		health: nops,
		projectiles: nops,
		zoneAbilitiesOverrides: nops,
		physics: nops
	};

	const addGhost = api.net.room.state.characters.$callbacks['128'][0];

	addGhost(ghost, id);
	const ghostChar =
		api.stores.phaser.scene.characterManager.characters.get(id)!;

	ghostChar.scale.activeScale = 1;
	ghostChar.nametag.setName(name);
	ghostChar.skin.updateSkin({ id: skinId });
	const { physics, movement } = ghostChar;
	physics.physicsBodyId = createPhysics(ghostChar);
	const body = physics.getBody();
	const rb = body.rigidBody;
	physics.state = JSON.parse(recording.startState);
	rb.setTranslation(recording.startPos, true);

	const { mainCharacter } = api.stores.phaser;

	let frameIndex = 0;

	const destroy = () => {
		unsubPreUpdate();
		unsubPostUpdate();
		api.stores.phaser.scene.characterManager.removeCharacter(id);
		api.stores.characters.characters.delete(id);
		api.stores.session.customTeams.characterToTeamMap.delete(id);
	};

	api.onStop(destroy);

	const unsubPreUpdate = api.patcher.before(
		mainCharacter.physics,
		'preUpdate',
		() => {
			const input = recording.frames[frameIndex];
			if (!input) {
				destroy();
				return;
			}

			applyTickInput!({
				characterId: id,
				input
			});

			frameIndex++;
		}
	);

	const unsubPostUpdate = api.patcher.before(
		mainCharacter.movement,
		'postPhysicsUpdate',
		() => {
			const { x, y } = rb.translation();
			movement.setTargetX(x * 100);
			movement.setTargetY(y * 100);
			movement.setNonMainCharacterTargetGrounded(
				body.character.controller.computedGrounded()
			);
		}
	);

	return destroy;
}

const settings = api.settings.create([
	<Gimloader.CustomSection<'ghosts', Ghost[]>>{
		id: 'ghosts',
		type: 'customsection',
		default: [],
		render(container, currentValue, update) {
			mount(Ghosts, {
				target: container,
				props: {
					initialGhosts: currentValue,
					setGhosts: update
				}
			});

			return () => {
				unmount(Ghosts);
			};
		}
	}
]);

api.net.onLoad(() => {
	const savestates = api.plugin('Savestates');

	const onMovementCallbacks: (() => void)[] = [];
	const ghostDestroyCallbacks: (() => void)[] = [];

	const onStateLoaded = () => {
		// Clear everything when teleporting
		onMovementCallbacks.length = 0;
		ghostDestroyCallbacks.forEach((cb) => cb());
		const translation = api.stores.phaser.mainCharacter.physics
			.getBody()
			.rigidBody.translation();

		for (const ghost of settings.ghosts) {
			const { startPos } = ghost.recording;
			if (
				!ghost.enabled ||
				startPos.x !== translation.x ||
				startPos.y !== translation.y
			)
				continue;

			const startGhost = (recording: IRecording) => {
				const remove = createGhost(
					ghost.id,
					recording,
					ghost.name,
					ghost.skinId
				);
				if (remove) {
					ghostDestroyCallbacks.push(remove);
				}
			};

			if (ghost.mode === 'onTeleport') {
				startGhost(ghost.recording);
			} else {
				const recordingFrames = ghost.recording.frames;
				const snippedFrames = movedInInput(recordingFrames[0])
					? recordingFrames
					: recordingFrames.slice(recordingFrames.findIndex(movedInInput));

				const recording = {
					...ghost.recording,
					frames: snippedFrames
				};

				const onMovement = () => {
					startGhost(recording);
					const index = onMovementCallbacks.indexOf(onMovement);
					if (index !== -1) onMovementCallbacks.splice(index, 1);
				};

				onMovementCallbacks.push(onMovement);
			}
		}
	};

	api.patcher.after(
		api.stores.phaser.scene.inputManager,
		'getPhysicsInput',
		(_, __, input: Gimloader.Stores.TickInput) => {
			if (movedInInput(input)) {
				onMovementCallbacks.forEach((cb) => cb());
			}
		}
	);

	savestates.onStateLoaded(onStateLoaded);
	api.onStop(() => {
		savestates.offStateLoaded(onStateLoaded);
	});
});

const movedInInput = (input: Gimloader.Stores.TickInput) =>
	input.angle !== null || input.jump || input._jumpKeyPressed;
