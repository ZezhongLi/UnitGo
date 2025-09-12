"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"
import { conversionEngine, type Unit, type ConversionResult } from "@/lib/conversion-engine"
import { storageManager } from "@/lib/storage"

interface UnitConverterProps {
  selectedCategory: string
}

export function UnitConverter({ selectedCategory }: UnitConverterProps) {
  const [inputValue, setInputValue] = useState<string>("1")
  const [fromUnit, setFromUnit] = useState<string>("")
  const [toUnit, setToUnit] = useState<string>("")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [units, setUnits] = useState<Unit[]>([])

  // Load units for selected category
  useEffect(() => {
    if (selectedCategory) {
      const categoryUnits = conversionEngine.getUnitsByCategory(selectedCategory as any)
      setUnits(categoryUnits)

      // Set default units if none selected or if category changed
      if (!fromUnit || !categoryUnits.find((u) => u.id === fromUnit)) {
        setFromUnit(categoryUnits.length > 0 ? categoryUnits[0].id : "")
      }
      if (!toUnit || !categoryUnits.find((u) => u.id === toUnit)) {
        setToUnit(categoryUnits.length > 1 ? categoryUnits[1].id : "")
      }
    }
  }, [selectedCategory, fromUnit, toUnit])


  // Perform conversion
  const performConversion = useCallback(() => {
    const numValue = Number.parseFloat(inputValue)
    if (!isNaN(numValue) && fromUnit && toUnit) {
      const conversionResult = conversionEngine.convert(numValue, fromUnit, toUnit)
      setResult(conversionResult)

      // Save to recents
      if (conversionResult) {
        storageManager.addRecent({
          fromUnitId: fromUnit,
          toUnitId: toUnit,
          value: numValue,
          result: conversionResult.value,
        })
      }
    } else {
      setResult(null)
    }
  }, [inputValue, fromUnit, toUnit])

  // Auto-convert when values change
  useEffect(() => {
    performConversion()
  }, [performConversion])

  const handleSwapUnits = () => {
    if (fromUnit && toUnit) {
      setFromUnit(toUnit)
      setToUnit(fromUnit)
      if (result) {
        setInputValue(result.formatted)
      }
    }
  }


  const UnitSelectItem = ({ unit }: { unit: Unit }) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col">
        <span className="font-medium">{unit.name}</span>
        <span className="text-sm text-muted-foreground">{unit.symbol}</span>
      </div>
    </div>
  )

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Unit Converter</h2>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Unit */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <div className="space-y-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="text-lg"
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      <UnitSelectItem unit={unit} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center md:mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapUnits}
              disabled={!fromUnit || !toUnit}
              className="rounded-full bg-transparent"
            >
              <ArrowUpDown className="size-4" />
            </Button>
          </div>

          {/* To Unit */}
          <div className="space-y-2 md:col-start-2">
            <label className="text-sm font-medium">To</label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  value={result?.formatted || ""}
                  readOnly
                  placeholder="Result"
                  className="text-lg bg-muted"
                />
                {result && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {result.unit.symbol}
                  </div>
                )}
              </div>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      <UnitSelectItem unit={unit} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Conversion Display */}
        {result && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-lg">
              <span className="font-semibold">{inputValue}</span>
              <span className="mx-2 text-muted-foreground">{units.find((u) => u.id === fromUnit)?.symbol}</span>
              <span className="mx-2">=</span>
              <span className="font-semibold text-primary">{result.formatted}</span>
              <span className="mx-2 text-muted-foreground">{result.unit.symbol}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
