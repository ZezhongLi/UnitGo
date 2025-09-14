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
    <Card className="p-8 bg-gradient-to-br from-background via-background to-muted/20 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="size-6 text-accent drop-shadow-sm dark:text-accent" />
        <h3 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">Quick Conversions</h3>
        <Badge variant="outline" className="text-sm shadow-md">Common examples</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {commonShortcuts.map((shortcut, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onShortcutSelect(shortcut)}
            className="h-auto p-4 flex flex-col items-start gap-2 text-left transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 active:scale-95 bg-gradient-to-r from-background to-background/95 backdrop-blur-sm hover:ring-2 hover:ring-primary/20 focus:ring-2 focus:ring-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 group relative overflow-hidden"
          >
            <span className="font-semibold text-base text-foreground">{shortcut.label}</span>
            <span className="text-sm text-muted-foreground leading-tight">{shortcut.description}</span>
          </Button>
        ))}
      </div>
    </Card>
  )
}
