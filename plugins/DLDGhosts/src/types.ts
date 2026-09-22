import type { Recording } from 'client-plugins/plugins/InputRecorder/src/types';

export interface Ghost {
	enabled: boolean;
	name: string;
	skinId: string;
	mode: 'onTeleport' | 'onMovementAfterTeleport';
	recording: Recording;
	id: string;
}
