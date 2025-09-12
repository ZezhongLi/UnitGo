"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Ruler, ArrowUpDown } from "lucide-react"
import { conversionEngine } from "@/lib/conversion-engine"
import { storageManager } from "@/lib/storage"

export function HeightConverter() {
  const [feet, setFeet] = useState<string>("5")
  const [inches, setInches] = useState<string>("10")
  const [centimeters, setCentimeters] = useState<string>("177.8")
  const [mode, setMode] = useState<"ft-in-to-cm" | "cm-to-ft-in">("ft-in-to-cm")

  // Convert feet + inches to centimeters
  const convertToMetric = useCallback(() => {
    const feetNum = Number.parseFloat(feet) || 0
    const inchesNum = Number.parseFloat(inches) || 0

    if (feetNum >= 0 && inchesNum >= 0 && inchesNum < 12) {
      const result = conversionEngine.convertHeight(feetNum, inchesNum)
      if (result) {
        setCentimeters(result.formatted)

        // Save to recents
        storageManager.addRecent({
          fromUnitId: "ft-in",
          toUnitId: "cm",
          value: feetNum * 12 + inchesNum,
          result: result.value,
        })
      }
    }
  }, [feet, inches])

  // Convert centimeters to feet + inches
  const convertToImperial = useCallback(() => {
    const cmNum = Number.parseFloat(centimeters) || 0

    if (cmNum >= 0) {
      const totalInches = cmNum / 2.54
      const feetPart = Math.floor(totalInches / 12)
      const inchesPart = totalInches % 12

      setFeet(feetPart.toString())
      setInches(inchesPart.toFixed(1))

      // Save to recents
      storageManager.addRecent({
        fromUnitId: "cm",
        toUnitId: "ft-in",
        value: cmNum,
        result: totalInches,
      })
    }
  }, [centimeters])

  // Auto-convert when values change
  useEffect(() => {
    if (mode === "ft-in-to-cm") {
      convertToMetric()
    }
  }, [convertToMetric, mode])

  useEffect(() => {
    if (mode === "cm-to-ft-in") {
      convertToImperial()
    }
  }, [convertToImperial, mode])

  const handleModeSwap = () => {
    setMode(mode === "ft-in-to-cm" ? "cm-to-ft-in" : "ft-in-to-cm")
  }

  const getHeightDescription = () => {
    const feetNum = Number.parseFloat(feet) || 0
    const inchesNum = Number.parseFloat(inches) || 0
    const cmNum = Number.parseFloat(centimeters) || 0

    if (mode === "ft-in-to-cm") {
      if (feetNum >= 6) return "Tall"
      if (feetNum >= 5 && inchesNum >= 6) return "Above average"
      if (feetNum >= 5) return "Average"
      return "Below average"
    } else {
      if (cmNum >= 183) return "Tall"
      if (cmNum >= 168) return "Above average"
      if (cmNum >= 152) return "Average"
      return "Below average"
    }
  }

  const commonHeights = [
    { label: "5'0\"", feet: 5, inches: 0, cm: 152.4 },
    { label: "5'6\"", feet: 5, inches: 6, cm: 167.6 },
    { label: "6'0\"", feet: 6, inches: 0, cm: 182.9 },
    { label: "6'6\"", feet: 6, inches: 6, cm: 198.1 },
  ]

  const setCommonHeight = (height: { feet: number; inches: number; cm: number }) => {
    setFeet(height.feet.toString())
    setInches(height.inches.toString())
    setCentimeters(height.cm.toString())
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="size-5 text-accent" />
          <h2 className="text-2xl font-bold">Height Converter</h2>
        </div>
        <Badge variant="outline" className="text-sm">
          {getHeightDescription()}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center justify-center">
          <Button variant="outline" onClick={handleModeSwap} className="flex items-center gap-2 bg-transparent">
            <ArrowUpDown className="size-4" />
            {mode === "ft-in-to-cm" ? "Switch to CM → Feet/Inches" : "Switch to Feet/Inches → CM"}
          </Button>
        </div>

        {mode === "ft-in-to-cm" ? (
          /* Feet + Inches to Centimeters */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-lg font-medium">Imperial (US)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="feet">Feet</Label>
                  <Input
                    id="feet"
                    type="number"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    placeholder="5"
                    min="0"
                    max="10"
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inches">Inches</Label>
                  <Input
                    id="inches"
                    type="number"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    placeholder="10"
                    min="0"
                    max="11.9"
                    step="0.1"
                    className="text-lg"
                  />
                </div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <span className="text-lg font-semibold">
                  {feet}' {inches}"
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Metric</Label>
              <div className="space-y-2">
                <Label htmlFor="cm-result">Centimeters</Label>
                <Input id="cm-result" type="text" value={centimeters} readOnly className="text-lg bg-muted" />
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-lg font-semibold text-primary">{centimeters} cm</span>
              </div>
            </div>
          </div>
        ) : (
          /* Centimeters to Feet + Inches */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-lg font-medium">Metric</Label>
              <div className="space-y-2">
                <Label htmlFor="cm-input">Centimeters</Label>
                <Input
                  id="cm-input"
                  type="number"
                  value={centimeters}
                  onChange={(e) => setCentimeters(e.target.value)}
                  placeholder="177.8"
                  min="0"
                  max="300"
                  step="0.1"
                  className="text-lg"
                />
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <span className="text-lg font-semibold">{centimeters} cm</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Imperial (US)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Feet</Label>
                  <Input type="text" value={feet} readOnly className="text-lg bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Inches</Label>
                  <Input type="text" value={inches} readOnly className="text-lg bg-muted" />
                </div>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-lg font-semibold text-primary">
                  {feet}' {Number.parseFloat(inches).toFixed(1)}"
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Common Heights */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Common Heights</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {commonHeights.map((height) => (
              <Button
                key={height.label}
                variant="outline"
                size="sm"
                onClick={() => setCommonHeight(height)}
                className="flex flex-col h-auto p-3 bg-transparent"
              >
                <span className="font-medium">{height.label}</span>
                <span className="text-xs text-muted-foreground">{height.cm} cm</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Height Context */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Average heights:</strong> Men ~5'9" (175cm), Women ~5'4" (162cm)
            </p>
            <p>
              <strong>Tip:</strong> Height measurements are typically taken without shoes
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
