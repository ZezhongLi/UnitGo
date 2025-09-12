"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { conversionEngine } from "@/lib/conversion-engine"
import { storageManager, type RecentConversion } from "@/lib/storage"

interface QuickAccessProps {
  onUnitSelect: (unitId: string, category: string) => void
  onConversionSelect: (fromUnitId: string, toUnitId: string, value: number) => void
}

export function QuickAccess({ onUnitSelect, onConversionSelect }: QuickAccessProps) {
  const [recents, setRecents] = useState<RecentConversion[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const recentConversions = storageManager.getRecents()
    setRecents(recentConversions)
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


  return (
    <Card className="p-6">
      <div className="space-y-4">


        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-5 text-accent" />
          <h3 className="text-lg font-semibold">Recent Conversions</h3>
          {recents.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {recents.length}
            </Badge>
          )}
        </div>

        {recents.length > 0 ? (
          <div className="space-y-2">
            {recents.slice(0, 4).map((recent, index) => {
              const fromUnit = conversionEngine.getUnit(recent.fromUnitId)
              const toUnit = conversionEngine.getUnit(recent.toUnitId)

              if (!fromUnit || !toUnit) return null

              return (
                <Button
                  key={`${recent.fromUnitId}-${recent.toUnitId}-${index}`}
                  variant="outline"
                  size="sm"
                  onClick={() => onConversionSelect(recent.fromUnitId, recent.toUnitId, recent.value)}
                  className="w-full h-auto p-3 flex flex-col items-start gap-1"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{recent.value}</span>
                    <span className="text-muted-foreground">{fromUnit.symbol}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{recent.result.toFixed(2)}</span>
                    <span className="text-muted-foreground">{toUnit.symbol}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{formatTimeAgo(recent.timestamp)}</div>
                </Button>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="size-8 mx-auto mb-2 opacity-50" />
            <p>No recent conversions</p>
            <p className="text-sm">Start converting to see history</p>
          </div>
        )}
      </div>
    </Card>
  )
}
