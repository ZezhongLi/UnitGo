"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { conversionEngine, type Unit } from "@/lib/conversion-engine"

interface UnitSearchProps {
  onUnitSelect: (unitId: string, category: string) => void
}

export function UnitSearch({ onUnitSelect }: UnitSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const allUnits = useMemo(() => {
    const categories = conversionEngine.getAllCategories()
    return categories.flatMap((category) => conversionEngine.getUnitsByCategory(category))
  }, [])

  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return allUnits.filter(
      (unit) =>
        unit.name.toLowerCase().includes(query) ||
        unit.symbol.toLowerCase().includes(query) ||
        unit.category.toLowerCase().includes(query),
    )
  }, [searchQuery, allUnits])

  const handleUnitClick = (unit: Unit) => {
    onUnitSelect(unit.id, unit.category)
    setSearchQuery("") // Clear search after selection
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold">Search Units</h3>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by unit name, symbol, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchQuery.trim() && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredUnits.length > 0 ? (
              filteredUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer group"
                  onClick={() => handleUnitClick(unit)}
                >
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{unit.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {unit.symbol}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground capitalize">{unit.category}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No units found matching "{searchQuery}"</p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
