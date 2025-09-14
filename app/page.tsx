"use client"

import { useState, useEffect } from "react"
import { CategorySelector } from "@/components/category-selector"
import { UnitConverter } from "@/components/unit-converter"
import { BatchConverter } from "@/components/batch-converter"
import { ConversionShortcuts } from "@/components/conversion-shortcuts"
import { UnitSearch } from "@/components/unit-search"
import { SettingsPanel } from "@/components/settings-panel"
import { storageManager } from "@/lib/storage"
import { conversionEngine } from "@/lib/conversion-engine"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("length")
  const [converterProps, setConverterProps] = useState<{
    initialFromUnit?: string
    initialToUnit?: string
    initialValue?: string
    key?: string
  }>({})
  const [converterState, setConverterState] = useState<{
    fromValue: string
    fromUnit: string
    fromCompositeValues: string[]
  }>({
    fromValue: "1",
    fromUnit: "",
    fromCompositeValues: ["", ""]
  })

  // Load settings on mount
  useEffect(() => {
    // Apply saved settings to conversion engine
    const settings = storageManager.getSettings()
    conversionEngine.setPrecision(settings.precision)
    conversionEngine.setDataSizeMode(settings.dataSizeMode)
  }, [])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    // Clear converter props when category changes manually (not from shortcuts)
    setConverterProps({})
  }

  const handleUnitSelect = (unitId: string, category: string) => {
    if (category !== selectedCategory) {
      setSelectedCategory(category)
    }
    // The unit will be available for selection in the converter
  }


  const handleShortcutSelect = (shortcut: { fromUnit: string; toUnit: string; category: string; value: number }) => {
    // Use React's automatic batching to ensure both updates happen together
    setSelectedCategory(shortcut.category)
    setConverterProps({
      initialFromUnit: shortcut.fromUnit,
      initialToUnit: shortcut.toUnit,
      initialValue: shortcut.value.toString(),
      key: `shortcut-${Date.now()}` // Force re-mount to ensure fresh state
    })
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 mb-6">
            <h1 className="text-5xl font-bold text-balance tracking-tight">UnitGo</h1>
            <SettingsPanel />
          </div>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Quick conversions between everyday and technical units
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Category Selection */}
            <CategorySelector selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

            {/* Main Converter */}
            {selectedCategory && <UnitConverter key={converterProps.key || selectedCategory} selectedCategory={selectedCategory} initialFromUnit={converterProps.initialFromUnit} initialToUnit={converterProps.initialToUnit} initialValue={converterProps.initialValue} onStateChange={setConverterState} />}

            {/* Batch Converter */}
            {selectedCategory && <BatchConverter selectedCategory={selectedCategory} converterState={converterState} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Unit Search */}
            <UnitSearch onUnitSelect={handleUnitSelect} />

            {/* Conversion Shortcuts */}
            <ConversionShortcuts onShortcutSelect={handleShortcutSelect} />
          </div>
        </div>
      </div>
    </div>
  )
}
