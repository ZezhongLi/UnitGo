// Local storage utilities for recents

export interface RecentConversion {
  fromUnitId: string
  toUnitId: string
  value: number
  result: number
  timestamp: number
}

export interface AppSettings {
  precision: number
  dataSizeMode: "si" | "binary"
  theme: "light" | "dark" | "system"
}

class StorageManager {
  private readonly RECENTS_KEY = "unitsmaster_recents"
  private readonly SETTINGS_KEY = "unitsmaster_settings"
  private readonly MAX_RECENTS = 10


  // Recents management
  getRecents(): RecentConversion[] {
    try {
      const stored = localStorage.getItem(this.RECENTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  addRecent(conversion: Omit<RecentConversion, "timestamp">): void {
    const recents = this.getRecents()

    // Remove duplicate if exists
    const filtered = recents.filter(
      (recent) => !(recent.fromUnitId === conversion.fromUnitId && recent.toUnitId === conversion.toUnitId),
    )

    // Add new conversion at the beginning
    filtered.unshift({
      ...conversion,
      timestamp: Date.now(),
    })

    // Keep only the most recent conversions
    const trimmed = filtered.slice(0, this.MAX_RECENTS)
    localStorage.setItem(this.RECENTS_KEY, JSON.stringify(trimmed))
  }

  clearRecents(): void {
    localStorage.removeItem(this.RECENTS_KEY)
  }

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
