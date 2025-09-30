import { defaultSettings, pluginName } from "./consts";
import type { Settings } from "./types";

type SettingsState = 'home' | 'lobby' | 'playing';

const storedSettings: Settings = GL.storage.getValue(pluginName, 'settings', defaultSettings);

export default new class Global {
  settingsState = $state<SettingsState>('home');
  settings = $state<Settings>(storedSettings);

  constructor () {
    $effect(() => {
      this.setSettings(this.settings);
    });
  }

  setSettings(settings: Settings) {
    this.settings = settings;
    GL.storage.setValue(pluginName, 'settings', {
      ...settings,
      runnerIds: []
    });
  }
}