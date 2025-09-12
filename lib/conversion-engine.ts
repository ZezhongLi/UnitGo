// Core conversion engine with ISO-based definitions
export interface Unit {
  id: string
  name: string
  symbol: string
  category: UnitCategory
  toBase: (value: number) => number
  fromBase: (value: number) => number
  isComposite?: boolean
  compositeInputs?: {
    name: string
    symbol: string
    placeholder: string
  }[]
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
      id: "ft_in",
      name: "Feet & Inches",
      symbol: "ft in",
      category: "length",
      toBase: (v) => v * 0.3048, // This will be overridden by composite conversion
      fromBase: (v) => v / 0.3048, // This will be overridden by composite conversion
      isComposite: true,
      compositeInputs: [
        {
          name: "feet",
          symbol: "ft",
          placeholder: "Feet"
        },
        {
          name: "inches",
          symbol: "in",
          placeholder: "Inches"
        }
      ]
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
    this.addUnit({
      id: "μm",
      name: "Micrometer",
      symbol: "μm",
      category: "length",
      toBase: (v) => v / 1000000,
      fromBase: (v) => v * 1000000,
    })
    this.addUnit({
      id: "nm",
      name: "Nanometer",
      symbol: "nm",
      category: "length",
      toBase: (v) => v / 1000000000,
      fromBase: (v) => v * 1000000000,
    })
    this.addUnit({
      id: "nmi",
      name: "Nautical Mile",
      symbol: "nmi",
      category: "length",
      toBase: (v) => v * 1852,
      fromBase: (v) => v / 1852,
    })
    this.addUnit({
      id: "dm",
      name: "Decimeter",
      symbol: "dm",
      category: "length",
      toBase: (v) => v / 10,
      fromBase: (v) => v * 10,
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
    this.addUnit({
      id: "stone",
      name: "Stone",
      symbol: "st",
      category: "weight",
      toBase: (v) => v * 6.35029,
      fromBase: (v) => v / 6.35029,
    })
    this.addUnit({
      id: "grain",
      name: "Grain",
      symbol: "gr",
      category: "weight",
      toBase: (v) => v * 0.0000647989,
      fromBase: (v) => v / 0.0000647989,
    })
    this.addUnit({
      id: "carat",
      name: "Carat",
      symbol: "ct",
      category: "weight",
      toBase: (v) => v * 0.0002,
      fromBase: (v) => v / 0.0002,
    })
    this.addUnit({
      id: "troy_oz",
      name: "Troy Ounce",
      symbol: "oz t",
      category: "weight",
      toBase: (v) => v * 0.0311035,
      fromBase: (v) => v / 0.0311035,
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
    this.addUnit({
      id: "m3",
      name: "Cubic Meter",
      symbol: "m³",
      category: "volume",
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    })
    this.addUnit({
      id: "cm3",
      name: "Cubic Centimeter",
      symbol: "cm³",
      category: "volume",
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    })
    this.addUnit({
      id: "ft3",
      name: "Cubic Foot",
      symbol: "ft³",
      category: "volume",
      toBase: (v) => v * 28.3168,
      fromBase: (v) => v / 28.3168,
    })
    this.addUnit({
      id: "in3",
      name: "Cubic Inch",
      symbol: "in³",
      category: "volume",
      toBase: (v) => v * 0.0163871,
      fromBase: (v) => v / 0.0163871,
    })
    this.addUnit({
      id: "barrel",
      name: "Barrel (US)",
      symbol: "bbl",
      category: "volume",
      toBase: (v) => v * 158.987,
      fromBase: (v) => v / 158.987,
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

    // Area units (base: square meter)
    this.addUnit({
      id: "m2",
      name: "Square Meter",
      symbol: "m²",
      category: "area",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "cm2",
      name: "Square Centimeter",
      symbol: "cm²",
      category: "area",
      toBase: (v) => v / 10000,
      fromBase: (v) => v * 10000,
    })
    this.addUnit({
      id: "km2",
      name: "Square Kilometer",
      symbol: "km²",
      category: "area",
      toBase: (v) => v * 1000000,
      fromBase: (v) => v / 1000000,
    })
    this.addUnit({
      id: "in2",
      name: "Square Inch",
      symbol: "in²",
      category: "area",
      toBase: (v) => v * 0.00064516,
      fromBase: (v) => v / 0.00064516,
    })
    this.addUnit({
      id: "ft2",
      name: "Square Foot",
      symbol: "ft²",
      category: "area",
      toBase: (v) => v * 0.092903,
      fromBase: (v) => v / 0.092903,
    })
    this.addUnit({
      id: "yd2",
      name: "Square Yard",
      symbol: "yd²",
      category: "area",
      toBase: (v) => v * 0.836127,
      fromBase: (v) => v / 0.836127,
    })
    this.addUnit({
      id: "acre",
      name: "Acre",
      symbol: "ac",
      category: "area",
      toBase: (v) => v * 4046.86,
      fromBase: (v) => v / 4046.86,
    })
    this.addUnit({
      id: "hectare",
      name: "Hectare",
      symbol: "ha",
      category: "area",
      toBase: (v) => v * 10000,
      fromBase: (v) => v / 10000,
    })

    // Speed units (base: meter per second)
    this.addUnit({
      id: "mps",
      name: "Meter per Second",
      symbol: "m/s",
      category: "speed",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "kmh",
      name: "Kilometer per Hour",
      symbol: "km/h",
      category: "speed",
      toBase: (v) => v / 3.6,
      fromBase: (v) => v * 3.6,
    })
    this.addUnit({
      id: "mph",
      name: "Mile per Hour",
      symbol: "mph",
      category: "speed",
      toBase: (v) => v * 0.44704,
      fromBase: (v) => v / 0.44704,
    })
    this.addUnit({
      id: "fps",
      name: "Foot per Second",
      symbol: "ft/s",
      category: "speed",
      toBase: (v) => v * 0.3048,
      fromBase: (v) => v / 0.3048,
    })
    this.addUnit({
      id: "knot",
      name: "Knot",
      symbol: "kn",
      category: "speed",
      toBase: (v) => v * 0.514444,
      fromBase: (v) => v / 0.514444,
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

    // Force units (base: Newton)
    this.addUnit({
      id: "n",
      name: "Newton",
      symbol: "N",
      category: "force",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "lbf",
      name: "Pound-force",
      symbol: "lbf",
      category: "force",
      toBase: (v) => v * 4.44822,
      fromBase: (v) => v / 4.44822,
    })
    this.addUnit({
      id: "kgf",
      name: "Kilogram-force",
      symbol: "kgf",
      category: "force",
      toBase: (v) => v * 9.80665,
      fromBase: (v) => v / 9.80665,
    })

    // Density units (base: kilogram per cubic meter)
    this.addUnit({
      id: "kg_m3",
      name: "Kilogram per Cubic Meter",
      symbol: "kg/m³",
      category: "density",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "g_cm3",
      name: "Gram per Cubic Centimeter",
      symbol: "g/cm³",
      category: "density",
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    })
    this.addUnit({
      id: "lb_ft3",
      name: "Pound per Cubic Foot",
      symbol: "lb/ft³",
      category: "density",
      toBase: (v) => v * 16.0185,
      fromBase: (v) => v / 16.0185,
    })

    // Angle units (base: radian)
    this.addUnit({
      id: "rad",
      name: "Radian",
      symbol: "rad",
      category: "angle",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "deg",
      name: "Degree",
      symbol: "°",
      category: "angle",
      toBase: (v) => v * Math.PI / 180,
      fromBase: (v) => v * 180 / Math.PI,
    })
    this.addUnit({
      id: "grad",
      name: "Gradian",
      symbol: "grad",
      category: "angle",
      toBase: (v) => v * Math.PI / 200,
      fromBase: (v) => v * 200 / Math.PI,
    })

    // Fuel efficiency units (base: liter per 100 kilometers)
    this.addUnit({
      id: "l_100km",
      name: "Liter per 100 km",
      symbol: "L/100km",
      category: "fuel",
      toBase: (v) => v,
      fromBase: (v) => v,
    })
    this.addUnit({
      id: "mpg_us",
      name: "Miles per Gallon (US)",
      symbol: "mpg",
      category: "fuel",
      toBase: (v) => 235.215 / v,
      fromBase: (v) => 235.215 / v,
    })
    this.addUnit({
      id: "mpg_uk",
      name: "Miles per Gallon (UK)",
      symbol: "mpg",
      category: "fuel",
      toBase: (v) => 282.481 / v,
      fromBase: (v) => 282.481 / v,
    })
    this.addUnit({
      id: "km_l",
      name: "Kilometer per Liter",
      symbol: "km/L",
      category: "fuel",
      toBase: (v) => 100 / v,
      fromBase: (v) => 100 / v,
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

  convertComposite(values: number[], fromUnitId: string, toUnitId: string): ConversionResult | null {
    const fromUnit = this.getUnit(fromUnitId)
    const toUnit = this.getUnit(toUnitId)

    if (!fromUnit || !toUnit || fromUnit.category !== toUnit.category) {
      return null
    }

    // Handle feet-inch conversion
    if (fromUnitId === "ft_in") {
      const [feet = 0, inches = 0] = values
      if (isNaN(feet) || isNaN(inches) || !isFinite(feet) || !isFinite(inches)) {
        return null
      }
      
      // Convert feet and inches to meters (base unit)
      const totalMeters = feet * 0.3048 + inches * 0.0254
      const convertedValue = toUnit.fromBase(totalMeters)
      
      return {
        value: convertedValue,
        unit: toUnit,
        formatted: this.formatNumber(convertedValue),
      }
    }

    // Handle conversion TO feet-inch
    if (toUnitId === "ft_in" && values.length === 1) {
      const [value] = values
      if (isNaN(value) || !isFinite(value)) {
        return null
      }
      
      const baseValue = fromUnit.toBase(value)
      // Convert meters to feet and inches
      const totalInches = baseValue / 0.0254
      const feet = Math.floor(totalInches / 12)
      const inches = totalInches % 12
      
      return {
        value: totalInches, // Keep original total inches for internal use
        unit: toUnit,
        formatted: `${feet}' ${this.formatNumber(inches)}"`,
      }
    }

    return null
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
