import type { IRecording } from 'client-plugins/plugins/InputRecorder/types';

export interface Ghost {
	enabled: boolean;
	name: string;
	skinId: string;
	mode: 'onTeleport' | 'onMovementAfterTeleport';
	recording: IRecording;
	id: string;
}
