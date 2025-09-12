"use client"

import { Input } from "@/components/ui/input"
import { Unit } from "@/lib/conversion-engine"

interface DualInputProps {
  unit: Unit
  values: string[]
  onChange: (values: string[]) => void
  onFocus?: () => void
  className?: string
}

export function DualInput({ unit, values, onChange, onFocus, className = "" }: DualInputProps) {
  if (!unit.isComposite || !unit.compositeInputs) {
    return null
  }

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...values]
    newValues[index] = value
    onChange(newValues)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {unit.compositeInputs.map((input, index) => (
        <div key={input.name} className="relative">
          <Input
            type="number"
            value={values[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onFocus={onFocus}
            placeholder={input.placeholder}
            className="text-xl h-14 px-4 border-2 border-primary/20 focus:border-primary shadow-md bg-background/80 backdrop-blur-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
            {input.symbol}
          </div>
        </div>
      ))}
    </div>
  )
}
