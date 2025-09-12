"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Copy, Check, List } from "lucide-react"
import { conversionEngine, type Unit, type ConversionResult } from "@/lib/conversion-engine"

interface BatchConverterProps {
  selectedCategory: string
  converterState: {
    fromValue: string
    fromUnit: string
    fromCompositeValues: string[]
  }
}

export function BatchConverter({ selectedCategory, converterState }: BatchConverterProps) {
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set())
  const [results, setResults] = useState<ConversionResult[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [showBatch, setShowBatch] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Use values from the main converter
  const { fromValue, fromUnit, fromCompositeValues } = converterState

  // Load units for selected category
  useEffect(() => {
    if (selectedCategory) {
      const categoryUnits = conversionEngine.getUnitsByCategory(selectedCategory as any)
      setUnits(categoryUnits)

      // Auto-select some common units for batch conversion
      if (categoryUnits.length > 1) {
        const commonUnits = categoryUnits.slice(0, Math.min(5, categoryUnits.length))
        setSelectedUnits(new Set(commonUnits.map((u) => u.id)))
      }
    }
  }, [selectedCategory])

  // Perform batch conversion
  const performBatchConversion = useMemo(() => {
    if (!fromUnit || selectedUnits.size === 0) {
      return []
    }

    // Calculate the numeric value, handling composite units
    const fromUnitObj = units.find(u => u.id === fromUnit)
    const numValue = fromUnitObj?.isComposite ? 
      fromCompositeValues.reduce((sum, v, i) => sum + (Number.parseFloat(v) || 0) * (i === 0 ? 12 : 1), 0) :
      Number.parseFloat(fromValue)

    if (!isNaN(numValue)) {
      const targetUnits = Array.from(selectedUnits).filter((unitId) => unitId !== fromUnit)
      return conversionEngine.convertToMultiple(numValue, fromUnit, targetUnits)
    }
    return []
  }, [fromValue, fromCompositeValues, fromUnit, selectedUnits, units])

  useEffect(() => {
    setResults(performBatchConversion)
  }, [performBatchConversion])

  const toggleUnitSelection = (unitId: string) => {
    setSelectedUnits((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(unitId)) {
        newSet.delete(unitId)
      } else {
        newSet.add(unitId)
      }
      return newSet
    })
  }

  const selectAllUnits = () => {
    setSelectedUnits(new Set(units.map((u) => u.id)))
  }

  const clearSelection = () => {
    setSelectedUnits(new Set([fromUnit].filter(Boolean)))
  }

  const copyResult = async (result: ConversionResult, index: number) => {
    const fromUnitObj = units.find((u) => u.id === fromUnit)
    const displayValue = fromUnitObj?.isComposite ? 
      `${fromCompositeValues[0] || "0"}' ${fromCompositeValues[1] || "0"}"` :
      fromValue
    const text = `${displayValue} ${fromUnitObj?.symbol} = ${result.formatted} ${result.unit.symbol}`
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const copyAllResults = async () => {
    const fromUnitObj = units.find((u) => u.id === fromUnit)
    const displayValue = fromUnitObj?.isComposite ? 
      `${fromCompositeValues[0] || "0"}' ${fromCompositeValues[1] || "0"}"` :
      fromValue
    const allText = results
      .map((result) => `${displayValue} ${fromUnitObj?.symbol} = ${result.formatted} ${result.unit.symbol}`)
      .join("\n")

    try {
      await navigator.clipboard.writeText(allText)
      setCopiedIndex(-1) // Special index for "copy all"
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy all:", err)
    }
  }

  if (!showBatch) {
    return (
      <Card className="p-6 border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <List className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Batch Conversion</h3>
              <p className="text-sm text-muted-foreground">Convert to multiple units at once</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-primary">Enable Batch Mode</div>
              <div className="text-xs text-muted-foreground">Convert 1 value → many units</div>
            </div>
            <Switch 
              checked={showBatch} 
              onCheckedChange={setShowBatch}
              className="data-[state=unchecked]:bg-border data-[state=unchecked]:border-2 data-[state=unchecked]:border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-md"
            />
          </div>
        </div>
        
        {/* Preview/teaser content */}
        <div className="mt-4 pt-4 border-t border-dashed border-primary/20">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>💡</span>
            <span>Perfect for comparing measurements across different units</span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-6 border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <List className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Batch Conversion</h3>
            <p className="text-sm text-muted-foreground">Active - Converting to multiple units</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-primary">Batch Mode</div>
            <div className="text-xs text-green-600 font-medium">● ACTIVE</div>
          </div>
          <Switch 
            id="batch-mode" 
            checked={showBatch} 
            onCheckedChange={setShowBatch}
            className="data-[state=unchecked]:bg-border data-[state=unchecked]:border-2 data-[state=unchecked]:border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-md"
          />
        </div>
      </div>

      {/* Current Value Display */}
      <div className="p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Converting from:</div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              {units.find(u => u.id === fromUnit)?.isComposite ? (
                <span>{fromCompositeValues[0] || "0"}' {fromCompositeValues[1] || "0"}"</span>
              ) : (
                <span>{fromValue}</span>
              )}
              <span className="ml-2 text-sm text-muted-foreground">
                {units.find((u) => u.id === fromUnit)?.symbol}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {units.find((u) => u.id === fromUnit)?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Unit Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Convert To (select multiple units)</Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAllUnits}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {units.map((unit) => {
            const isSelected = selectedUnits.has(unit.id)
            const isFromUnit = unit.id === fromUnit

            return (
              <Button
                key={unit.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleUnitSelection(unit.id)}
                disabled={isFromUnit}
                className="justify-start h-auto p-3"
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{unit.name}</span>
                  <span className="text-xs opacity-70">{unit.symbol}</span>
                </div>
              </Button>
            )
          })}
        </div>

        <div className="text-sm text-muted-foreground">Selected {selectedUnits.size} units for batch conversion</div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Conversion Results</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllResults}
              className="flex items-center gap-2 bg-transparent"
            >
              {copiedIndex === -1 ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
              Copy All
            </Button>
          </div>

          <div className="grid gap-3">
            {results.map((result, index) => (
              <div key={result.unit.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-mono">
                    <span className="font-semibold text-primary">{result.formatted}</span>
                    <span className="ml-2 text-muted-foreground">{result.unit.symbol}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{result.unit.name}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyResult(result, index)}
                  className="flex items-center gap-2"
                >
                  {copiedIndex === index ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                </Button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-center text-sm">
              <span className="font-semibold">
                {units.find(u => u.id === fromUnit)?.isComposite ? 
                  `${fromCompositeValues[0] || "0"}' ${fromCompositeValues[1] || "0"}"` :
                  fromValue
                }
              </span>
              <span className="mx-2">{units.find((u) => u.id === fromUnit)?.symbol}</span>
              <span className="text-muted-foreground">converted to {results.length} different units</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
