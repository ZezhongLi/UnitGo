"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Ruler,
  Weight,
  Thermometer,
  Beaker,
  Square,
  Gauge,
  Clock,
  HardDrive,
  Zap,
  Power,
  Gauge as PressureIcon,
  ArrowUpRight,
  Layers,
  Compass,
  Fuel,
} from "lucide-react"
import type { UnitCategory } from "@/lib/conversion-engine"

interface CategorySelectorProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categoryConfig = {
  length: { icon: Ruler, label: "Length", description: "Distance, height, width" },
  weight: { icon: Weight, label: "Weight", description: "Mass, weight" },
  temperature: { icon: Thermometer, label: "Temperature", description: "Heat, cold" },
  volume: { icon: Beaker, label: "Volume", description: "Liquid, capacity" },
  area: { icon: Square, label: "Area", description: "Surface, space" },
  speed: { icon: Gauge, label: "Speed", description: "Velocity, pace" },
  time: { icon: Clock, label: "Time", description: "Duration, period" },
  data: { icon: HardDrive, label: "Data Size", description: "Storage, memory" },
  energy: { icon: Zap, label: "Energy", description: "Work, heat" },
  power: { icon: Power, label: "Power", description: "Rate, wattage" },
  pressure: { icon: PressureIcon, label: "Pressure", description: "Force per area" },
  force: { icon: ArrowUpRight, label: "Force", description: "Push, pull" },
  density: { icon: Layers, label: "Density", description: "Mass per volume" },
  angle: { icon: Compass, label: "Angle", description: "Rotation, direction" },
  fuel: { icon: Fuel, label: "Fuel Economy", description: "Consumption, efficiency" },
}

export function CategorySelector({ selectedCategory, onCategoryChange }: CategorySelectorProps) {
  const everydayCategories: UnitCategory[] = [
    "length",
    "weight",
    "temperature",
    "volume",
    "area",
    "speed",
    "time",
  ]
  const technicalCategories: UnitCategory[] = ["energy", "power", "pressure", "force", "density", "angle", "fuel", "data"]

  const CategoryButton = ({ category }: { category: UnitCategory }) => {
    const config = categoryConfig[category]
    const Icon = config.icon
    const isSelected = selectedCategory === category

    return (
      <Button
        variant={isSelected ? "default" : "outline"}
        onClick={() => onCategoryChange(category)}
        className="h-auto p-5 flex flex-col items-center gap-3 text-center transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95"
      >
        <Icon className="size-7 transition-transform duration-200 group-hover:scale-110" />
        <div className="space-y-1">
          <div className="font-semibold text-base">{config.label}</div>
          <div className="text-xs text-muted-foreground leading-tight">{config.description}</div>
        </div>
      </Button>
    )
  }

  return (
    <div className="space-y-8">
      {/* Everyday Categories */}
      <Card className="p-8 bg-gradient-to-br from-background via-background to-muted/20 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out backdrop-blur-sm">
        <h3 className="text-2xl font-bold mb-6 tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">Everyday Units</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {everydayCategories.map((category) => (
            <CategoryButton key={category} category={category} />
          ))}
        </div>
      </Card>

      {/* Technical Categories */}
      <Card className="p-8 bg-gradient-to-br from-background via-background to-muted/20 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out backdrop-blur-sm">
        <h3 className="text-2xl font-bold mb-6 tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">Technical Units</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {technicalCategories.map((category) => (
            <CategoryButton key={category} category={category} />
          ))}
        </div>
      </Card>
    </div>
  )
}
