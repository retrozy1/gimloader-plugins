import { defaultSettings, pluginName } from "./consts";
import type { Settings } from "./types";

type State = 'home' | 'lobby' | 'playing';

const storedSettings: Settings = GL.storage.getValue(pluginName, 'settings', defaultSettings);

export default new class Global {
  state = $state<State>('home');
  settings = $state<Settings>(storedSettings);

  setSettings(settings: Settings) {
    this.settings = settings;
    GL.storage.setValue(pluginName, 'settings', {
      ...settings,
      runnerIds: []
    });
  }
}