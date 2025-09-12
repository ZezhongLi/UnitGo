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
  const [fromValue, setFromValue] = useState<string>("1")
  const [toValue, setToValue] = useState<string>("")
  const [fromUnit, setFromUnit] = useState<string>("")
  const [toUnit, setToUnit] = useState<string>("")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [activeInput, setActiveInput] = useState<"from" | "to">("from")

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

  // Perform conversion from "from" to "to"
  const performConversionFromTo = useCallback(() => {
    const numValue = Number.parseFloat(fromValue)
    if (!isNaN(numValue) && fromUnit && toUnit) {
      const conversionResult = conversionEngine.convert(numValue, fromUnit, toUnit)
      setResult(conversionResult)
      if (conversionResult && activeInput === "from") {
        setToValue(conversionResult.formatted)
      }

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
      if (activeInput === "from") {
        setToValue("")
      }
    }
  }, [fromValue, fromUnit, toUnit, activeInput])

  // Perform conversion from "to" to "from"
  const performConversionToFrom = useCallback(() => {
    const numValue = Number.parseFloat(toValue)
    if (!isNaN(numValue) && fromUnit && toUnit) {
      const conversionResult = conversionEngine.convert(numValue, toUnit, fromUnit)
      if (conversionResult && activeInput === "to") {
        setFromValue(conversionResult.formatted)
      }

      // Save to recents
      storageManager.addRecent({
        fromUnitId: toUnit,
        toUnitId: fromUnit,
        value: numValue,
        result: conversionResult.value,
      })
    }
  }, [toValue, fromUnit, toUnit, activeInput])

  // Auto-convert when values change
  useEffect(() => {
    if (activeInput === "from") {
      performConversionFromTo()
    } else if (activeInput === "to") {
      performConversionToFrom()
    }
  }, [performConversionFromTo, performConversionToFrom, activeInput])

  const handleSwapUnits = () => {
    if (fromUnit && toUnit) {
      setFromUnit(toUnit)
      setToUnit(fromUnit)
      // Swap the values as well
      const tempValue = fromValue
      setFromValue(toValue)
      setToValue(tempValue)
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
    <Card className="p-8 space-y-8 bg-gradient-to-br from-background to-muted/20 border-2 shadow-lg">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Unit Converter
        </h2>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* From Unit */}
          <div className="space-y-4">
            <label className="text-lg font-semibold text-foreground">From</label>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type="number"
                  value={fromValue}
                  onChange={(e) => {
                    setFromValue(e.target.value)
                    setActiveInput("from")
                  }}
                  onFocus={() => setActiveInput("from")}
                  placeholder="Enter value"
                  className="text-xl h-14 px-4 border-2 border-primary/20 focus:border-primary shadow-md bg-background/80 backdrop-blur-sm"
                />
                {fromUnit && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                    {units.find((u) => u.id === fromUnit)?.symbol}
                  </div>
                )}
              </div>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="h-12 border-2 border-primary/20 focus:border-primary shadow-md">
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
          <div className="flex items-center justify-center md:mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapUnits}
              disabled={!fromUnit || !toUnit}
              className="rounded-full h-14 w-14 border-2 border-primary/30 hover:border-primary shadow-lg hover:shadow-xl transition-all duration-200 bg-background/80 backdrop-blur-sm"
            >
              <ArrowUpDown className="size-6" />
            </Button>
          </div>

          {/* To Unit */}
          <div className="space-y-4">
            <label className="text-lg font-semibold text-foreground">To</label>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type="number"
                  value={toValue}
                  onChange={(e) => {
                    setToValue(e.target.value)
                    setActiveInput("to")
                  }}
                  onFocus={() => setActiveInput("to")}
                  placeholder="Enter value"
                  className="text-xl h-14 px-4 border-2 border-primary/20 focus:border-primary shadow-md bg-background/80 backdrop-blur-sm"
                />
                {toUnit && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                    {units.find((u) => u.id === toUnit)?.symbol}
                  </div>
                )}
              </div>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="h-12 border-2 border-primary/20 focus:border-primary shadow-md">
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
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 shadow-md">
            <div className="text-xl font-medium">
              <span className="font-bold text-2xl">{fromValue}</span>
              <span className="mx-3 text-muted-foreground text-lg">{units.find((u) => u.id === fromUnit)?.symbol}</span>
              <span className="mx-3 text-2xl">=</span>
              <span className="font-bold text-2xl text-primary">{toValue}</span>
              <span className="mx-3 text-muted-foreground text-lg">{units.find((u) => u.id === toUnit)?.symbol}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
