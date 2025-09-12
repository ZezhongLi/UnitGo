// Core conversion engine with ISO-based definitions
export interface Unit {
  id: string
  name: string
  symbol: string
  category: UnitCategory
  toBase: (value: number) => number
  fromBase: (value: number) => number
}

export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "volume"
  | "area"
  | "speed"
  | "time"
  | "data"
  | "energy"
  | "power"
  | "pressure"
  | "force"
  | "density"
  | "angle"
  | "fuel"

export interface ConversionResult {
  value: number
  unit: Unit
  formatted: string
}

export class ConversionEngine {
  private units: Map<string, Unit> = new Map()
  private precision = 6
  private dataSizeMode: "si" | "binary" = "si"

  constructor() {
    this.initializeUnits()
  }

  setPrecision(precision: number) {
    this.precision = Math.max(1, Math.min(15, precision))
  }

  setDataSizeMode(mode: "si" | "binary") {
    this.dataSizeMode = mode
    this.initializeDataUnits() // Reinitialize data units with new mode
  }

  private initializeUnits() {
    // Length units (base: meter)
    this.addUnit({
      id: "mm",
      name: "Millimeter",
      symbol: "mm",
      category: "length",
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    })
    this.addUnit({
      id: "cm",
      name: "Centimeter",
      symbol: "cm",
      category: "length",
      toBase: (v) => v / 100,
      fromBase: (v) => v * 100,
    })
    this.addUnit({
      id: "m",
      name: "Meter",
      symbol: "m",
      category: "length",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "km",
      name: "Kilometer",
      symbol: "km",
      category: "length",
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    })
    this.addUnit({
      id: "in",
      name: "Inch",
      symbol: "in",
      category: "length",
      toBase: (v) => v * 0.0254,
      fromBase: (v) => v / 0.0254,
    })
    this.addUnit({
      id: "ft",
      name: "Foot",
      symbol: "ft",
      category: "length",
      toBase: (v) => v * 0.3048,
      fromBase: (v) => v / 0.3048,
    })
    this.addUnit({
      id: "yd",
      name: "Yard",
      symbol: "yd",
      category: "length",
      toBase: (v) => v * 0.9144,
      fromBase: (v) => v / 0.9144,
    })
    this.addUnit({
      id: "mi",
      name: "Mile",
      symbol: "mi",
      category: "length",
      toBase: (v) => v * 1609.344,
      fromBase: (v) => v / 1609.344,
    })

    // Weight units (base: kilogram)
    this.addUnit({
      id: "mg",
      name: "Milligram",
      symbol: "mg",
      category: "weight",
      toBase: (v) => v / 1000000,
      fromBase: (v) => v * 1000000,
    })
    this.addUnit({
      id: "g",
      name: "Gram",
      symbol: "g",
      category: "weight",
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    })
    this.addUnit({
      id: "kg",
      name: "Kilogram",
      symbol: "kg",
      category: "weight",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "oz",
      name: "Ounce",
      symbol: "oz",
      category: "weight",
      toBase: (v) => v * 0.0283495,
      fromBase: (v) => v / 0.0283495,
    })
    this.addUnit({
      id: "lb",
      name: "Pound",
      symbol: "lb",
      category: "weight",
      toBase: (v) => v * 0.453592,
      fromBase: (v) => v / 0.453592,
    })
    this.addUnit({
      id: "ton",
      name: "Metric Ton",
      symbol: "t",
      category: "weight",
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    })

    // Temperature units (base: Celsius)
    this.addUnit({
      id: "c",
      name: "Celsius",
      symbol: "°C",
      category: "temperature",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "f",
      name: "Fahrenheit",
      symbol: "°F",
      category: "temperature",
      toBase: (v) => ((v - 32) * 5) / 9,
      fromBase: (v) => (v * 9) / 5 + 32,
    })
    this.addUnit({
      id: "k",
      name: "Kelvin",
      symbol: "K",
      category: "temperature",
      toBase: (v) => v - 273.15,
      fromBase: (v) => v + 273.15,
    })

    // Volume units (base: liter)
    this.addUnit({
      id: "ml",
      name: "Milliliter",
      symbol: "ml",
      category: "volume",
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    })
    this.addUnit({
      id: "l",
      name: "Liter",
      symbol: "L",
      category: "volume",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "cup",
      name: "Cup (US)",
      symbol: "cup",
      category: "volume",
      toBase: (v) => v * 0.236588,
      fromBase: (v) => v / 0.236588,
    })
    this.addUnit({
      id: "pint",
      name: "Pint (US)",
      symbol: "pt",
      category: "volume",
      toBase: (v) => v * 0.473176,
      fromBase: (v) => v / 0.473176,
    })
    this.addUnit({
      id: "quart",
      name: "Quart (US)",
      symbol: "qt",
      category: "volume",
      toBase: (v) => v * 0.946353,
      fromBase: (v) => v / 0.946353,
    })
    this.addUnit({
      id: "gallon",
      name: "Gallon (US)",
      symbol: "gal",
      category: "volume",
      toBase: (v) => v * 3.78541,
      fromBase: (v) => v / 3.78541,
    })
    this.addUnit({
      id: "floz",
      name: "Fluid Ounce (US)",
      symbol: "fl oz",
      category: "volume",
      toBase: (v) => v * 0.0295735,
      fromBase: (v) => v / 0.0295735,
    })
    this.addUnit({
      id: "tbsp",
      name: "Tablespoon",
      symbol: "tbsp",
      category: "volume",
      toBase: (v) => v * 0.0147868,
      fromBase: (v) => v / 0.0147868,
    })
    this.addUnit({
      id: "tsp",
      name: "Teaspoon",
      symbol: "tsp",
      category: "volume",
      toBase: (v) => v * 0.00492892,
      fromBase: (v) => v / 0.00492892,
    })

    // Time units (base: second)
    this.addUnit({
      id: "s",
      name: "Second",
      symbol: "s",
      category: "time",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "min",
      name: "Minute",
      symbol: "min",
      category: "time",
      toBase: (v) => v * 60,
      fromBase: (v) => v / 60,
    })
    this.addUnit({
      id: "h",
      name: "Hour",
      symbol: "h",
      category: "time",
      toBase: (v) => v * 3600,
      fromBase: (v) => v / 3600,
    })
    this.addUnit({
      id: "d",
      name: "Day",
      symbol: "d",
      category: "time",
      toBase: (v) => v * 86400,
      fromBase: (v) => v / 86400,
    })
    this.addUnit({
      id: "wk",
      name: "Week",
      symbol: "wk",
      category: "time",
      toBase: (v) => v * 604800,
      fromBase: (v) => v / 604800,
    })
    this.addUnit({
      id: "mo",
      name: "Month (30d)",
      symbol: "mo",
      category: "time",
      toBase: (v) => v * 2592000, // 30 days
      fromBase: (v) => v / 2592000,
    })
    this.addUnit({
      id: "yr",
      name: "Year (365d)",
      symbol: "yr",
      category: "time",
      toBase: (v) => v * 31536000, // 365 days
      fromBase: (v) => v / 31536000,
    })

    this.initializeDataUnits()
    this.initializeTechnicalUnits()
  }

  private initializeDataUnits() {
    const multiplier = this.dataSizeMode === "binary" ? 1024 : 1000

    // Data units (base: byte)
    this.addUnit({
      id: "b",
      name: "Byte",
      symbol: "B",
      category: "data",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "kb",
      name: "Kilobyte",
      symbol: "KB",
      category: "data",
      toBase: (v) => v * multiplier,
      fromBase: (v) => v / multiplier,
    })
    this.addUnit({
      id: "mb",
      name: "Megabyte",
      symbol: "MB",
      category: "data",
      toBase: (v) => v * Math.pow(multiplier, 2),
      fromBase: (v) => v / Math.pow(multiplier, 2),
    })
    this.addUnit({
      id: "gb",
      name: "Gigabyte",
      symbol: "GB",
      category: "data",
      toBase: (v) => v * Math.pow(multiplier, 3),
      fromBase: (v) => v / Math.pow(multiplier, 3),
    })
    this.addUnit({
      id: "tb",
      name: "Terabyte",
      symbol: "TB",
      category: "data",
      toBase: (v) => v * Math.pow(multiplier, 4),
      fromBase: (v) => v / Math.pow(multiplier, 4),
    })
  }

  private initializeTechnicalUnits() {
    // Pressure units (base: Pascal)
    this.addUnit({
      id: "pa",
      name: "Pascal",
      symbol: "Pa",
      category: "pressure",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "bar",
      name: "Bar",
      symbol: "bar",
      category: "pressure",
      toBase: (v) => v * 100000,
      fromBase: (v) => v / 100000,
    })
    this.addUnit({
      id: "psi",
      name: "PSI",
      symbol: "psi",
      category: "pressure",
      toBase: (v) => v * 6894.76,
      fromBase: (v) => v / 6894.76,
    })
    this.addUnit({
      id: "atm",
      name: "Atmosphere",
      symbol: "atm",
      category: "pressure",
      toBase: (v) => v * 101325,
      fromBase: (v) => v / 101325,
    })

    // Energy units (base: Joule)
    this.addUnit({
      id: "j",
      name: "Joule",
      symbol: "J",
      category: "energy",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "cal",
      name: "Calorie",
      symbol: "cal",
      category: "energy",
      toBase: (v) => v * 4.184,
      fromBase: (v) => v / 4.184,
    })
    this.addUnit({
      id: "kwh",
      name: "Kilowatt Hour",
      symbol: "kWh",
      category: "energy",
      toBase: (v) => v * 3600000,
      fromBase: (v) => v / 3600000,
    })
    this.addUnit({
      id: "btu",
      name: "BTU",
      symbol: "BTU",
      category: "energy",
      toBase: (v) => v * 1055.06,
      fromBase: (v) => v / 1055.06,
    })

    // Power units (base: Watt)
    this.addUnit({
      id: "w",
      name: "Watt",
      symbol: "W",
      category: "power",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "kw",
      name: "Kilowatt",
      symbol: "kW",
      category: "power",
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    })
    this.addUnit({
      id: "hp",
      name: "Horsepower",
      symbol: "hp",
      category: "power",
      toBase: (v) => v * 745.7,
      fromBase: (v) => v / 745.7,
    })
  }

  private addUnit(unit: Unit) {
    this.units.set(unit.id, unit)
  }

  getUnit(id: string): Unit | undefined {
    return this.units.get(id)
  }

  getUnitsByCategory(category: UnitCategory): Unit[] {
    return Array.from(this.units.values()).filter((unit) => unit.category === category)
  }

  getAllCategories(): UnitCategory[] {
    return [
      "length",
      "weight",
      "temperature",
      "volume",
      "area",
      "speed",
      "time",
      "data",
      "energy",
      "power",
      "pressure",
      "force",
      "density",
      "angle",
      "fuel",
    ]
  }

  convert(value: number, fromUnitId: string, toUnitId: string): ConversionResult | null {
    const fromUnit = this.getUnit(fromUnitId)
    const toUnit = this.getUnit(toUnitId)

    if (!fromUnit || !toUnit || fromUnit.category !== toUnit.category) {
      return null
    }

    if (isNaN(value) || !isFinite(value)) {
      return null
    }

    // Convert to base unit, then to target unit
    const baseValue = fromUnit.toBase(value)
    const convertedValue = toUnit.fromBase(baseValue)

    const formatted = this.formatNumber(convertedValue)

    return {
      value: convertedValue,
      unit: toUnit,
      formatted,
    }
  }

  convertToMultiple(value: number, fromUnitId: string, toUnitIds: string[]): ConversionResult[] {
    const results: ConversionResult[] = []

    for (const toUnitId of toUnitIds) {
      const result = this.convert(value, fromUnitId, toUnitId)
      if (result) {
        results.push(result)
      }
    }

    return results
  }

  private formatNumber(value: number): string {
    if (value === 0) return "0"

    const absValue = Math.abs(value)

    // For very large or very small numbers, use scientific notation
    if (absValue >= 1e6 || (absValue < 0.001 && absValue > 0)) {
      return value.toExponential(this.precision - 1)
    }

    // For normal numbers, use fixed precision but remove trailing zeros
    const fixed = value.toFixed(this.precision)
    return Number.parseFloat(fixed).toString()
  }

}

// Singleton instance
export const conversionEngine = new ConversionEngine()
