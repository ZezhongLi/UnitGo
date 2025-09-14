// Local storage utilities for app settings

export interface AppSettings {
  precision: number
  dataSizeMode: "si" | "binary"
  theme: "light" | "dark" | "system"
}

class StorageManager {
  private readonly SETTINGS_KEY = "unitgo_settings"

  // Settings management
  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY)
      const defaultSettings: AppSettings = {
        precision: 6,
        dataSizeMode: "si",
        theme: "system",
      }
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
    } catch {
      return {
        precision: 6,
        dataSizeMode: "si",
        theme: "system",
      }
    }
  }

  updateSettings(settings: Partial<AppSettings>): void {
    const current = this.getSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated))
  }
}

export const storageManager = new StorageManager()
