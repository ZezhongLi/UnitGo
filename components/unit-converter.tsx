"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftRight } from "lucide-react"
import { conversionEngine, type Unit, type ConversionResult } from "@/lib/conversion-engine"
import { DualInput } from "./dual-input"

interface UnitConverterProps {
  selectedCategory: string
  initialFromUnit?: string
  initialToUnit?: string
  initialValue?: string
  onStateChange?: (state: {
    fromValue: string
    fromUnit: string
    fromCompositeValues: string[]
  }) => void
}

export function UnitConverter({ selectedCategory, initialFromUnit, initialToUnit, initialValue, onStateChange }: UnitConverterProps) {
  const [fromValue, setFromValue] = useState<string>("1")
  const [toValue, setToValue] = useState<string>("")
  const [fromUnit, setFromUnit] = useState<string>("")
  const [toUnit, setToUnit] = useState<string>("")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [activeInput, setActiveInput] = useState<"from" | "to">("from")
  const [fromCompositeValues, setFromCompositeValues] = useState<string[]>(["", ""])
  const [toCompositeValues, setToCompositeValues] = useState<string[]>(["", ""])
  const initialValuesApplied = useRef(false)

  // Helpers to avoid infinite update loops when setting composite values
  const setToCompositeIfChanged = useCallback((next: string[]) => {
    setToCompositeValues((prev) => {
      if ((prev[0] ?? "") === (next[0] ?? "") && (prev[1] ?? "") === (next[1] ?? "")) {
        return prev
      }
      return next
    })
  }, [])

  const setFromCompositeIfChanged = useCallback((next: string[]) => {
    setFromCompositeValues((prev) => {
      if ((prev[0] ?? "") === (next[0] ?? "") && (prev[1] ?? "") === (next[1] ?? "")) {
        return prev
      }
      return next
    })
  }, [])

  // Reset the initial values applied flag when props change
  useEffect(() => {
    initialValuesApplied.current = false
  }, [initialFromUnit, initialToUnit, initialValue])

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && fromUnit) {
      onStateChange({
        fromValue,
        fromUnit,
        fromCompositeValues
      })
    }
  }, [fromValue, fromUnit, fromCompositeValues, onStateChange])

  // Load units for selected category
  useEffect(() => {
    if (selectedCategory) {
      const categoryUnits = conversionEngine.getUnitsByCategory(selectedCategory as any)
      setUnits(categoryUnits)

      // Set default units only when category changes or units are empty
      if (!fromUnit && categoryUnits.length > 0) {
        setFromUnit(categoryUnits[0].id)
      }
      if (!toUnit && categoryUnits.length > 1) {
        setToUnit(categoryUnits[1].id)
      }
    }
  }, [selectedCategory])

  // Apply initial values from props (runs after units are loaded)
  useEffect(() => {
    if (units.length > 0 && !initialValuesApplied.current && (initialFromUnit || initialToUnit || initialValue)) {
      // Apply initial units
      if (initialFromUnit && units.find(u => u.id === initialFromUnit)) {
        setFromUnit(initialFromUnit)
      }
      if (initialToUnit && units.find(u => u.id === initialToUnit)) {
        setToUnit(initialToUnit)
      }

      // Apply initial value
      if (initialValue) {
        const targetFromUnit = initialFromUnit || fromUnit
        const fromUnitObj = units.find(u => u.id === targetFromUnit)
        
        if (fromUnitObj?.isComposite && targetFromUnit === "ft_in") {
          // For feet & inches, set the feet value and inches to 0
          setFromCompositeValues([initialValue, "0"])
        } else {
          setFromValue(initialValue)
        }
        setActiveInput("from")
      }

      initialValuesApplied.current = true
    }
  }, [units, initialFromUnit, initialToUnit, initialValue, fromUnit])

  // Validate units when they change - ensure they exist in current category
  useEffect(() => {
    if (units.length > 0) {
      if (fromUnit && !units.find((u) => u.id === fromUnit)) {
        setFromUnit(units[0].id)
      }
      if (toUnit && !units.find((u) => u.id === toUnit)) {
        setToUnit(units.length > 1 ? units[1].id : units[0].id)
      }
    }
  }, [units, fromUnit, toUnit])

  // Perform conversion from "from" to "to"
  const performConversionFromTo = useCallback(() => {
    if (!fromUnit || !toUnit) {
      setResult(null)
      return
    }

    const fromUnitObj = units.find(u => u.id === fromUnit)
    const toUnitObj = units.find(u => u.id === toUnit)

    let conversionResult: ConversionResult | null = null

    // Handle composite unit conversion
    if (fromUnitObj?.isComposite) {
      const values = fromCompositeValues.map(v => Number.parseFloat(v) || 0)
      conversionResult = conversionEngine.convertComposite(values, fromUnit, toUnit)
    } else {
      const numValue = Number.parseFloat(fromValue)
      if (!isNaN(numValue)) {
        if (toUnitObj?.isComposite) {
          conversionResult = conversionEngine.convertComposite([numValue], fromUnit, toUnit)
        } else {
          conversionResult = conversionEngine.convert(numValue, fromUnit, toUnit)
        }
      }
    }

    setResult(conversionResult)

    if (conversionResult && activeInput === "from") {
      if (toUnitObj?.isComposite) {
        // For composite units, parse the formatted result
        if (toUnit === "ft_in" && conversionResult.formatted.includes("'")) {
          const parts = conversionResult.formatted.split("'")
          const feet = parts[0].trim()
          const inches = parts[1].replace('"', '').trim()
          setToCompositeIfChanged([feet, inches])
        }
      } else {
        setToValue(conversionResult.formatted)
      }
    }

  }, [fromValue, fromCompositeValues, fromUnit, toUnit, activeInput, units])

  // Perform conversion from "to" to "from"
  const performConversionToFrom = useCallback(() => {
    if (!fromUnit || !toUnit) return

    const fromUnitObj = units.find(u => u.id === fromUnit)
    const toUnitObj = units.find(u => u.id === toUnit)

    let conversionResult: ConversionResult | null = null

    // Handle composite unit conversion
    if (toUnitObj?.isComposite) {
      const values = toCompositeValues.map(v => Number.parseFloat(v) || 0)
      conversionResult = conversionEngine.convertComposite(values, toUnit, fromUnit)
    } else {
      const numValue = Number.parseFloat(toValue)
      if (!isNaN(numValue)) {
        if (fromUnitObj?.isComposite) {
          conversionResult = conversionEngine.convertComposite([numValue], toUnit, fromUnit)
        } else {
          conversionResult = conversionEngine.convert(numValue, toUnit, fromUnit)
        }
      }
    }

    if (conversionResult && activeInput === "to") {
      if (fromUnitObj?.isComposite) {
        // For composite units, parse the formatted result
        if (fromUnit === "ft_in" && conversionResult.formatted.includes("'")) {
          const parts = conversionResult.formatted.split("'")
          const feet = parts[0].trim()
          const inches = parts[1].replace('"', '').trim()
          setFromCompositeIfChanged([feet, inches])
        }
      } else {
        setFromValue(conversionResult.formatted)
      }
    }

  }, [toValue, toCompositeValues, fromUnit, toUnit, activeInput, units])

  // Auto-convert when editing the FROM side
  useEffect(() => {
    if (activeInput !== "from") return
    performConversionFromTo()
  }, [fromValue, fromCompositeValues, fromUnit, toUnit, activeInput, units, performConversionFromTo])

  // Auto-convert when editing the TO side
  useEffect(() => {
    if (activeInput !== "to") return
    performConversionToFrom()
  }, [toValue, toCompositeValues, fromUnit, toUnit, activeInput, units, performConversionToFrom])

  const handleSwapUnits = useCallback(() => {
    if (fromUnit && toUnit) {
      // Store current values to avoid state update conflicts
      const currentFromUnit = fromUnit
      const currentToUnit = toUnit
      const currentFromValue = fromValue
      const currentToValue = toValue
      const currentFromComposite = [...fromCompositeValues]
      const currentToComposite = [...toCompositeValues]
      
      // Batch all state updates
      setFromUnit(currentToUnit)
      setToUnit(currentFromUnit)
      setFromValue(currentToValue)
      setToValue(currentFromValue)
      setFromCompositeValues(currentToComposite)
      setToCompositeValues(currentFromComposite)
      
      // Reset active input to maintain proper conversion flow
      setActiveInput("from")
    }
  }, [fromUnit, toUnit, fromValue, toValue, fromCompositeValues, toCompositeValues])

  const UnitSelectItem = ({ unit }: { unit: Unit }) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col">
        <span className="font-medium">{unit.name}</span>
        <span className="text-sm text-muted-foreground">{unit.symbol}</span>
      </div>
    </div>
  )

  return (
    <Card className="p-10 space-y-10 bg-gradient-to-br from-background via-background to-muted/30 border-2 border-primary/10 shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out backdrop-blur-sm">
      <div className="space-y-8">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-in fade-in-50 duration-700 tracking-tight drop-shadow-sm">
          Unit Converter
        </h2>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* From Unit */}
          <div className="space-y-5">
            <label className="text-xl font-semibold text-foreground tracking-wide">From</label>
            <div className="space-y-4">
              {units.find(u => u.id === fromUnit)?.isComposite ? (
                <DualInput
                  unit={units.find(u => u.id === fromUnit)!}
                  values={fromCompositeValues}
                  onChange={(values) => {
                    setFromCompositeValues(values)
                    setActiveInput("from")
                  }}
                  onFocus={() => setActiveInput("from")}
                />
              ) : (
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
                    className="text-xl h-14 px-4 border-2 border-primary/20 focus:border-primary shadow-lg bg-gradient-to-r from-background to-background/95 backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-primary/40 hover:shadow-xl focus:shadow-2xl focus:scale-[1.02]"
                  />
                  {fromUnit && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                      {units.find((u) => u.id === fromUnit)?.symbol}
                    </div>
                  )}
                </div>
              )}
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="h-12 border-2 border-primary/20 focus:border-primary shadow-lg bg-gradient-to-r from-background to-background/95 backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-primary/40 hover:shadow-xl focus:shadow-2xl">
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
              className="rounded-full h-14 w-14 border-2 border-primary/30 hover:border-primary shadow-xl bg-gradient-to-br from-background to-background/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <ArrowLeftRight className="size-6 transition-transform duration-200 group-hover:rotate-180 text-foreground" />
            </Button>
          </div>

          {/* To Unit */}
          <div className="space-y-5">
            <label className="text-xl font-semibold text-foreground tracking-wide">To</label>
            <div className="space-y-4">
              {units.find(u => u.id === toUnit)?.isComposite ? (
                <DualInput
                  unit={units.find(u => u.id === toUnit)!}
                  values={toCompositeValues}
                  onChange={(values) => {
                    setToCompositeValues(values)
                    setActiveInput("to")
                  }}
                  onFocus={() => setActiveInput("to")}
                />
              ) : (
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
                    className="text-xl h-14 px-4 border-2 border-primary/20 focus:border-primary shadow-lg bg-gradient-to-r from-background to-background/95 backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-primary/40 hover:shadow-xl focus:shadow-2xl focus:scale-[1.02]"
                  />
                  {toUnit && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                      {units.find((u) => u.id === toUnit)?.symbol}
                    </div>
                  )}
                </div>
              )}
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="h-12 border-2 border-primary/20 focus:border-primary shadow-lg bg-gradient-to-r from-background to-background/95 backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-primary/40 hover:shadow-xl focus:shadow-2xl">
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
          <div className="text-center p-8 bg-gradient-to-r from-primary/15 via-primary/10 to-accent/10 rounded-xl border border-primary/30 shadow-2xl animate-in slide-in-from-bottom-4 duration-500 ease-out backdrop-blur-sm">
            <div className="text-2xl font-medium">
              {/* From value display */}
              {units.find(u => u.id === fromUnit)?.isComposite ? (
                <span className="font-bold text-3xl">
                  {fromCompositeValues[0] || "0"}' {fromCompositeValues[1] || "0"}"
                </span>
              ) : (
                <span className="font-bold text-3xl">{fromValue}</span>
              )}
              <span className="mx-4 text-muted-foreground text-xl">{units.find((u) => u.id === fromUnit)?.symbol}</span>
              
              <span className="mx-4 text-3xl">=</span>
              
              {/* To value display */}
              {units.find(u => u.id === toUnit)?.isComposite ? (
                <span className="font-bold text-3xl text-primary">
                  {toCompositeValues[0] || "0"}' {toCompositeValues[1] || "0"}"
                </span>
              ) : (
                <span className="font-bold text-3xl text-primary">{toValue}</span>
              )}
              <span className="mx-4 text-muted-foreground text-xl">{units.find((u) => u.id === toUnit)?.symbol}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
