"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, RotateCcw, Trash2 } from "lucide-react"
import { conversionEngine } from "@/lib/conversion-engine"
import { storageManager, type RecentConversion } from "@/lib/storage"

interface RecentsPanelProps {
  onConversionSelect: (fromUnitId: string, toUnitId: string, value: number) => void
}

export function RecentsPanel({ onConversionSelect }: RecentsPanelProps) {
  const [recents, setRecents] = useState<RecentConversion[]>([])

  useEffect(() => {
    loadRecents()
  }, [])

  const loadRecents = () => {
    const recentConversions = storageManager.getRecents()
    setRecents(recentConversions)
  }

  const clearRecents = () => {
    storageManager.clearRecents()
    loadRecents()
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  if (recents.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-5 text-accent" />
          <h3 className="text-lg font-semibold">Recent Conversions</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">
          No recent conversions yet. Start converting to see your history here.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-accent" />
          <h3 className="text-lg font-semibold">Recent Conversions</h3>
          <Badge variant="secondary">{recents.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={clearRecents}>
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {recents.map((recent, index) => {
          const fromUnit = conversionEngine.getUnit(recent.fromUnitId)
          const toUnit = conversionEngine.getUnit(recent.toUnitId)

          if (!fromUnit || !toUnit) return null

          return (
            <div
              key={`${recent.fromUnitId}-${recent.toUnitId}-${index}`}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer group"
              onClick={() => onConversionSelect(recent.fromUnitId, recent.toUnitId, recent.value)}
            >
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{recent.value}</span>
                  <span className="text-muted-foreground">{fromUnit.symbol}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{recent.result.toFixed(2)}</span>
                  <span className="text-muted-foreground">{toUnit.symbol}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {fromUnit.name} to {toUnit.name}
                  </span>
                  <span>•</span>
                  <span>{formatTimeAgo(recent.timestamp)}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
