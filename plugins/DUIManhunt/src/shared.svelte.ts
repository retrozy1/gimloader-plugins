import { defaultSettings, pluginName } from "./consts";
import { Types } from "./messages";
import type { Settings } from "./types";

type SettingsState = 'home' | 'lobby' | 'playing';

const Communications = api.lib('Communication').Communications;
const storedSettings: Settings = GL.storage.getValue(pluginName, 'settings', defaultSettings);

export default new class Shared extends Communications {
  settingsState = $state<SettingsState>('home');
  settings = $state<Settings>(storedSettings);
  players = $state(new Map<string, string>());

  constructor () {
    super(pluginName);
    $effect(() => {
      this.setSettings(this.settings);
    });
  }

  private updateLocalSettings(settings: Settings) {
    this.settings = settings;
    GL.storage.setValue(pluginName, 'settings', {
      ...settings,
      runnerIds: []
    });
  }

  setSettings(settings: Settings) {
    this.updateLocalSettings(settings);
    this.send([Types.Settings, settings]);
  }

  patchSettings(update: Partial<Settings>) {
    this.updateLocalSettings({
      ...this.settings,
      ...update
    });
    this.send([Types.SettingsPatch, update]);
  }

  get hunters() {
    const hunters = new Map<string, string>();
    this.players.forEach((id, name) => {
      if (this.settings.runnerIds.includes(id)) return;
      hunters.set(id, name);
    });
    return hunters;
  }

  get runners() {
    const runners = new Map<string, string>();
    this.players.forEach((id, name) => {
      if (!this.settings.runnerIds.includes(id)) return;
      runners.set(id, name);
    });
    return runners;
  }
}