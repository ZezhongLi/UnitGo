"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"

interface ConversionShortcut {
  label: string
  description: string
  fromUnit: string
  toUnit: string
  category: string
  value: number
}

interface ConversionShortcutsProps {
  onShortcutSelect: (shortcut: ConversionShortcut) => void
}

const commonShortcuts: ConversionShortcut[] = [
  {
    label: "Room Temperature",
    description: "20°C to Fahrenheit",
    fromUnit: "c",
    toUnit: "f",
    category: "temperature",
    value: 20,
  },
  {
    label: "Human Height",
    description: "6 feet to centimeters",
    fromUnit: "ft_in",
    toUnit: "cm",
    category: "length",
    value: 6,
  },
  {
    label: "Cooking Cup",
    description: "1 cup to milliliters",
    fromUnit: "cup",
    toUnit: "ml",
    category: "volume",
    value: 1,
  },
  {
    label: "Car Speed",
    description: "60 mph to km/h",
    fromUnit: "mph",
    toUnit: "kmh",
    category: "speed",
    value: 60,
  },
  {
    label: "Body Weight",
    description: "150 lbs to kilograms",
    fromUnit: "lb",
    toUnit: "kg",
    category: "weight",
    value: 150,
  },
  {
    label: "File Size",
    description: "1 GB to megabytes",
    fromUnit: "gb",
    toUnit: "mb",
    category: "data",
    value: 1,
  },
]

export function ConversionShortcuts({ onShortcutSelect }: ConversionShortcutsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="size-5 text-accent" />
        <h3 className="text-lg font-semibold">Quick Conversions</h3>
        <Badge variant="outline">Common examples</Badge>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {commonShortcuts.map((shortcut, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onShortcutSelect(shortcut)}
            className="h-auto p-3 flex flex-col items-start gap-1 text-left"
          >
            <span className="font-medium text-sm">{shortcut.label}</span>
            <span className="text-xs text-muted-foreground">{shortcut.description}</span>
          </Button>
        ))}
      </div>
    </Card>
  )
}
