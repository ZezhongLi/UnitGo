"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, RotateCcw } from "lucide-react"
import { conversionEngine } from "@/lib/conversion-engine"
import { storageManager, type AppSettings } from "@/lib/storage"

export function SettingsPanel() {
  const { theme, setTheme } = useTheme()
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
    
    // Sync theme with next-themes
    if (currentSettings.theme && setTheme) {
      setTheme(currentSettings.theme)
    }
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
    } else if (key === "theme") {
      setTheme(value as string)
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
    setTheme(defaultSettings.theme)
  }


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-gradient-to-r from-background to-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95 hover:ring-2 hover:ring-primary/20 focus:ring-2 focus:ring-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 group relative overflow-hidden">
          <Settings className="size-4 drop-shadow-sm text-foreground group-hover:rotate-12 transition-transform duration-300" />
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
                  value={theme || settings.theme}
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

          {/* Reset Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Reset</h3>

            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={resetSettings}
                className="flex items-center gap-2 bg-gradient-to-r from-background to-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95 hover:ring-2 hover:ring-destructive/20 focus:ring-2 focus:ring-destructive/20 hover:bg-gradient-to-r hover:from-destructive/5 hover:to-destructive/10 group relative overflow-hidden"
              >
                <RotateCcw className="size-4 text-foreground group-hover:rotate-180 transition-transform duration-300" />
                Reset Settings
              </Button>
              <p className="text-sm text-muted-foreground">
                Reset all settings to their default values. Your preferences are automatically saved.
              </p>
            </div>
          </Card>

          {/* App Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">About UnitGo</h3>

            <div className="space-y-2 text-sm">
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
            </div>

            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
              <p>
                UnitGo provides accurate conversions based on ISO definitions. All conversions work offline and
                your data is stored locally on your device.
              </p>
              <p className="mt-2 text-orange-600 dark:text-orange-400">
                ⚠️ This is AI-assisted development and may have issues and bugs.
              </p>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
