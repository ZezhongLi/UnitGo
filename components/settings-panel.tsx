"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, RotateCcw, Download, Upload, Trash2 } from "lucide-react"
import { conversionEngine } from "@/lib/conversion-engine"
import { storageManager, type AppSettings } from "@/lib/storage"

export function SettingsPanel() {
  const [settings, setSettings] = useState<AppSettings>({
    precision: 6,
    dataSizeMode: "si",
    theme: "system",
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const currentSettings = storageManager.getSettings()
    setSettings(currentSettings)

    // Apply settings to conversion engine
    conversionEngine.setPrecision(currentSettings.precision)
    conversionEngine.setDataSizeMode(currentSettings.dataSizeMode)
  }

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    storageManager.updateSettings({ [key]: value })

    // Apply changes to conversion engine
    if (key === "precision") {
      conversionEngine.setPrecision(value as number)
    } else if (key === "dataSizeMode") {
      conversionEngine.setDataSizeMode(value as "si" | "binary")
    }
  }

  const resetSettings = () => {
    const defaultSettings: AppSettings = {
      precision: 6,
      dataSizeMode: "si",
      theme: "system",
    }
    setSettings(defaultSettings)
    storageManager.updateSettings(defaultSettings)
    conversionEngine.setPrecision(defaultSettings.precision)
    conversionEngine.setDataSizeMode(defaultSettings.dataSizeMode)
  }

  const exportData = () => {
    const data = {
      recents: storageManager.getRecents(),
      settings: storageManager.getSettings(),
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `unitgo-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)


        // Import settings
        if (data.settings) {
          storageManager.updateSettings(data.settings)
          loadSettings()
        }

        alert("Data imported successfully!")
      } catch (error) {
        alert("Failed to import data. Please check the file format.")
      }
    }
    reader.readAsText(file)

    // Reset the input
    event.target.value = ""
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      storageManager.clearRecents()

      resetSettings()
      alert("All data cleared successfully!")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <Settings className="size-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Settings & Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Conversion Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>

            <div className="space-y-4">
              {/* Precision Setting */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Decimal Precision</Label>
                  <Badge variant="outline">{settings.precision} digits</Badge>
                </div>
                <Slider
                  value={[settings.precision]}
                  onValueChange={(value) => updateSetting("precision", value[0])}
                  min={1}
                  max={15}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Controls how many decimal places are shown in conversion results
                </p>
              </div>

              {/* Data Size Mode */}
              <div className="space-y-2">
                <Label>Data Size Calculation</Label>
                <Select
                  value={settings.dataSizeMode}
                  onValueChange={(value: "si" | "binary") => updateSetting("dataSizeMode", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">
                      <div className="flex flex-col">
                        <span>SI (Decimal) - 1000 bytes = 1 KB</span>
                        <span className="text-xs text-muted-foreground">Standard for storage devices</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="binary">
                      <div className="flex flex-col">
                        <span>Binary - 1024 bytes = 1 KB</span>
                        <span className="text-xs text-muted-foreground">Traditional computer memory</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Appearance Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Appearance</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value: "light" | "dark" | "system") => updateSetting("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System Default</SelectItem>
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Data Management</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" onClick={exportData} className="flex items-center gap-2 bg-transparent">
                  <Download className="size-4" />
                  Export Data
                </Button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                    <Upload className="size-4" />
                    Import Data
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="flex items-center gap-2 mr-2 bg-transparent"
                >
                  <RotateCcw className="size-4" />
                  Reset Settings
                </Button>

                <Button variant="destructive" onClick={clearAllData} className="flex items-center gap-2">
                  <Trash2 className="size-4" />
                  Clear All Data
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Export your settings to backup or transfer to another device. Import previously exported
                data to restore your preferences.
              </p>
            </div>
          </Card>

          {/* App Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">About UnitGo</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Total Units:</span>
                <span>
                  {conversionEngine
                    .getAllCategories()
                    .reduce((total, cat) => total + conversionEngine.getUnitsByCategory(cat).length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Categories:</span>
                <span>{conversionEngine.getAllCategories().length}</span>
              </div>
              <div className="flex justify-between">
                <span>Recent Conversions:</span>
                <span>{storageManager.getRecents().length}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
              <p>
                UnitGo provides accurate conversions based on ISO definitions. All conversions work offline and
                your data is stored locally on your device.
              </p>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
