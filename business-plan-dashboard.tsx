"use client"

import type React from "react"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Line,
  LineChart,
  Area,
  AreaChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, MapPin } from "lucide-react"

// State coordinates for mapping
const stateCoordinates: { [key: string]: { lat: number; lng: number; name: string } } = {
  AL: { lat: 32.806671, lng: -86.79113, name: "Alabama" },
  AK: { lat: 61.370716, lng: -152.404419, name: "Alaska" },
  AZ: { lat: 33.729759, lng: -111.431221, name: "Arizona" },
  AR: { lat: 34.969704, lng: -92.373123, name: "Arkansas" },
  CA: { lat: 36.116203, lng: -119.681564, name: "California" },
  CO: { lat: 39.059811, lng: -105.311104, name: "Colorado" },
  CT: { lat: 41.597782, lng: -72.755371, name: "Connecticut" },
  DE: { lat: 39.318523, lng: -75.507141, name: "Delaware" },
  FL: { lat: 27.766279, lng: -81.686783, name: "Florida" },
  GA: { lat: 33.040619, lng: -83.643074, name: "Georgia" },
  HI: { lat: 21.094318, lng: -157.498337, name: "Hawaii" },
  ID: { lat: 44.240459, lng: -114.478828, name: "Idaho" },
  IL: { lat: 40.349457, lng: -88.986137, name: "Illinois" },
  IN: { lat: 39.849426, lng: -86.258278, name: "Indiana" },
  IA: { lat: 42.011539, lng: -93.210526, name: "Iowa" },
  KS: { lat: 38.5266, lng: -96.726486, name: "Kansas" },
  KY: { lat: 37.66814, lng: -84.670067, name: "Kentucky" },
  LA: { lat: 31.169546, lng: -91.867805, name: "Louisiana" },
  ME: { lat: 44.693947, lng: -69.381927, name: "Maine" },
  MD: { lat: 39.063946, lng: -76.802101, name: "Maryland" },
  MA: { lat: 42.230171, lng: -71.530106, name: "Massachusetts" },
  MI: { lat: 43.326618, lng: -84.536095, name: "Michigan" },
  MN: { lat: 45.694454, lng: -93.900192, name: "Minnesota" },
  MS: { lat: 32.741646, lng: -89.678696, name: "Mississippi" },
  MO: { lat: 38.456085, lng: -92.288368, name: "Missouri" },
  MT: { lat: 47.052952, lng: -109.63304, name: "Montana" },
  NE: { lat: 41.12537, lng: -98.268082, name: "Nebraska" },
  NV: { lat: 38.313515, lng: -117.055374, name: "Nevada" },
  NH: { lat: 43.452492, lng: -71.563896, name: "New Hampshire" },
  NJ: { lat: 40.298904, lng: -74.521011, name: "New Jersey" },
  NM: { lat: 34.840515, lng: -106.248482, name: "New Mexico" },
  NY: { lat: 42.165726, lng: -74.948051, name: "New York" },
  NC: { lat: 35.630066, lng: -79.806419, name: "North Carolina" },
  ND: { lat: 47.528912, lng: -99.784012, name: "North Dakota" },
  OH: { lat: 40.388783, lng: -82.764915, name: "Ohio" },
  OK: { lat: 35.565342, lng: -96.928917, name: "Oklahoma" },
  OR: { lat: 44.931109, lng: -123.029159, name: "Oregon" },
  PA: { lat: 40.590752, lng: -77.209755, name: "Pennsylvania" },
  RI: { lat: 41.680893, lng: -71.51178, name: "Rhode Island" },
  SC: { lat: 33.856892, lng: -80.945007, name: "South Carolina" },
  SD: { lat: 44.299782, lng: -99.438828, name: "South Dakota" },
  TN: { lat: 35.747845, lng: -86.692345, name: "Tennessee" },
  TX: { lat: 31.054487, lng: -97.563461, name: "Texas" },
  UT: { lat: 40.150032, lng: -111.862434, name: "Utah" },
  VT: { lat: 44.045876, lng: -72.710686, name: "Vermont" },
  VA: { lat: 37.769337, lng: -78.169968, name: "Virginia" },
  WA: { lat: 47.400902, lng: -121.490494, name: "Washington" },
  WV: { lat: 38.491226, lng: -80.95457, name: "West Virginia" },
  WI: { lat: 44.268543, lng: -89.616508, name: "Wisconsin" },
  WY: { lat: 42.755966, lng: -107.30249, name: "Wyoming" },
}

// Original project data for charts tab
const aggregateProjectData = () => {
  const projects = [
    {
      name: "BPS Capital Advisory Services",
      totalFee: 141500,
      state: "MA",
      startDate: "8/12/2023",
      endDate: "6/7/2024",
      dateAwarded: "10/2/2023",
      status: "Active",
    },
    {
      name: "East Side Union HSD Master Plan",
      totalFee: 348000,
      state: "CA",
      startDate: "2/27/2024",
      endDate: "9/19/2025",
      dateAwarded: "2/12/2024",
      status: "Active",
    },
    {
      name: "MPS Long Range Facilities Master Plan",
      totalFee: 933028.85,
      state: "WI",
      startDate: "2/17/2024",
      endDate: "10/31/2025",
      dateAwarded: "3/4/2024",
      status: "Active",
    },
    {
      name: "Anne Arundel County Schools FMP",
      totalFee: 578565.5,
      state: "MD",
      startDate: "3/2/2024",
      endDate: "7/25/2025",
      dateAwarded: "3/1/2024",
      status: "Active",
    },
    {
      name: "OUSD Facilities Master Planning Services",
      totalFee: 626189.75,
      state: "CA",
      startDate: "6/26/2024",
      endDate: "10/31/2025",
      dateAwarded: "8/2/2024",
      status: "Active",
    },
    {
      name: "BPS: Long-Term Facilities Plan",
      totalFee: 200000,
      state: "MA",
      startDate: "11/9/2024",
      endDate: "12/31/2025",
      dateAwarded: "10/7/2024",
      status: "Active",
    },
    {
      name: "Colorado Springs D11: Palmer High School",
      totalFee: 976137.4,
      state: "CO",
      startDate: "8/17/2024",
      endDate: "8/7/2027",
      dateAwarded: "8/5/2024",
      status: "Active",
    },
    {
      name: "Jeffco Public Schools: Capital MP",
      totalFee: 274900.33,
      state: "CO",
      startDate: "2/1/2025",
      endDate: "7/17/2026",
      dateAwarded: "1/1/2025",
      status: "Active",
    },
  ]
  return projects
}

// Calculate monthly revenue distribution for original charts
const calculateMonthlyRevenue = (projects: any[]) => {
  const monthlyData = new Map()

  projects.forEach((project) => {
    const startDate = new Date(project.startDate)
    const endDate = new Date(project.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return

    const durationMonths = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)),
    )
    const monthlyRevenue = project.totalFee / durationMonths

    const currentDate = new Date(startDate)
    for (let i = 0; i < durationMonths; i++) {
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthKey,
          revenue: 0,
          projects: [],
        })
      }

      const existing = monthlyData.get(monthKey)
      existing.revenue += monthlyRevenue
      if (!existing.projects.includes(project.name)) {
        existing.projects.push(project.name)
      }

      currentDate.setMonth(currentDate.getMonth() + 1)
    }
  })

  return Array.from(monthlyData.values()).sort((a, b) => a.month.localeCompare(b.month))
}

// Function to get quarter from date for original charts
const getQuarter = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const quarter = Math.ceil(month / 3)
  return `Q${quarter} ${year}`
}

const parseCSV = (csvText: string) => {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

  const data = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
    const row: any = {}

    headers.forEach((header, index) => {
      const value = values[index] || ""

      // Convert numeric fields
      if (header.toLowerCase().includes("fee") || header.toLowerCase().includes("total")) {
        row[header] = Number.parseFloat(value.replace(/[$,]/g, "")) || 0
      } else {
        row[header] = value
      }
    })

    return row
  })

  return data
}

// Simple SVG Map Component
const USMap = ({ projects, onStateClick }: { projects: any[]; onStateClick: (state: string) => void }) => {
  // Aggregate projects by state
  const stateData = useMemo(() => {
    const data = new Map()
    projects.forEach((project) => {
      const state = project.state
      if (!data.has(state)) {
        data.set(state, { count: 0, totalValue: 0, projects: [] })
      }
      const existing = data.get(state)
      existing.count += 1
      existing.totalValue += project.totalFee
      existing.projects.push(project)
    })
    return data
  }, [projects])

  // Get color intensity based on project value
  const getStateColor = (state: string) => {
    const data = stateData.get(state)
    if (!data) return "#f3f4f6" // gray-100

    const maxValue = Math.max(...Array.from(stateData.values()).map((d: any) => d.totalValue))
    const intensity = data.totalValue / maxValue

    if (intensity > 0.7) return "#dc2626" // red-600
    if (intensity > 0.4) return "#ea580c" // orange-600
    if (intensity > 0.2) return "#ca8a04" // yellow-600
    return "#16a34a" // green-600
  }

  return (
    <div className="w-full">
      <svg viewBox="0 0 1000 600" className="w-full h-auto border rounded-lg bg-blue-50">
        {/* Simplified US state shapes - showing key states from your data */}

        {/* California */}
        <path
          d="M50 200 L50 450 L150 450 L150 350 L120 300 L100 250 L80 200 Z"
          fill={getStateColor("CA")}
          stroke="#374151"
          strokeWidth="1"
          className="cursor-pointer hover:opacity-80"
          onClick={() => onStateClick("CA")}
        />

        {/* Colorado */}
        <path
          d="M300 250 L400 250 L400 350 L300 350 Z"
          fill={getStateColor("CO")}
          stroke="#374151"
          strokeWidth="1"
          className="cursor-pointer hover:opacity-80"
          onClick={() => onStateClick("CO")}
        />

        {/* Wisconsin */}
        <path
          d="M500 150 L550 150 L550 250 L500 250 Z"
          fill={getStateColor("WI")}
          stroke="#374151"
          strokeWidth="1"
          className="cursor-pointer hover:opacity-80"
          onClick={() => onStateClick("WI")}
        />

        {/* Maryland */}
        <path
          d="M700 250 L750 250 L750 280 L700 280 Z"
          fill={getStateColor("MD")}
          stroke="#374151"
          strokeWidth="1"
          className="cursor-pointer hover:opacity-80"
          onClick={() => onStateClick("MD")}
        />

        {/* Massachusetts */}
        <path
          d="M800 200 L850 200 L850 230 L800 230 Z"
          fill={getStateColor("MA")}
          stroke="#374151"
          strokeWidth="1"
          className="cursor-pointer hover:opacity-80"
          onClick={() => onStateClick("MA")}
        />

        {/* Project markers */}
        {projects.map((project, index) => {
          const coords = stateCoordinates[project.state]
          if (!coords) return null

          // Convert lat/lng to SVG coordinates (simplified)
          const x = ((coords.lng + 125) / 60) * 1000
          const y = ((50 - coords.lat) / 25) * 600

          const size = Math.max(4, Math.min(20, project.totalFee / 50000))

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r={size}
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80"
                opacity="0.8"
              />
              <text
                x={x}
                y={y - size - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#374151"
                className="pointer-events-none"
              >
                ${(project.totalFee / 1000).toFixed(0)}K
              </text>
            </g>
          )
        })}

        {/* State labels */}
        <text x="100" y="320" textAnchor="middle" fontSize="12" fill="#374151" className="pointer-events-none">
          CA
        </text>
        <text x="350" y="300" textAnchor="middle" fontSize="12" fill="#374151" className="pointer-events-none">
          CO
        </text>
        <text x="525" y="200" textAnchor="middle" fontSize="12" fill="#374151" className="pointer-events-none">
          WI
        </text>
        <text x="725" y="270" textAnchor="middle" fontSize="12" fill="#374151" className="pointer-events-none">
          MD
        </text>
        <text x="825" y="220" textAnchor="middle" fontSize="12" fill="#374151" className="pointer-events-none">
          MA
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span>Low Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-600 rounded"></div>
          <span>Medium Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-600 rounded"></div>
          <span>High Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span>Highest Value</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-600" />
          <span>Project Location</span>
        </div>
      </div>
    </div>
  )
}

// Default expense parameters
const defaultExpenseParams = {
  avgSalary: 85000,
  healthcarePerEmployee: 18000,
  payrollTaxRate: 0.0765,
  unemploymentTaxRate: 0.006,
  workersCompRate: 0.005,
  retirement401kRate: 0.06,
  officeRentPerMonth: 2500,
  utilitiesPerMonth: 400,
  internetPhonePerMonth: 300,
  laptopPerEmployee: 2500,
  softwareLicensesPerEmployee: 2400,
  itSupportPerEmployee: 1200,
  accountingAnnual: 15000,
  legalAnnual: 8000,
  insuranceAnnual: 12000,
  marketingAnnual: 25000,
  conferencesTrainingPerEmployee: 5000,
  travelPerEmployee: 15000,
  officeSuppliesPerEmployee: 1500,
  miscellaneousPerEmployee: 2000,
  inflationRate: 0.03,
}

export default function BusinessPlanDashboard() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [targetFTE, setTargetFTE] = useState(3)
  const [viewType, setViewType] = useState<"charts" | "overview" | "expenses" | "revenue" | "cashflow">("charts")
  const [expenseParams, setExpenseParams] = useState(defaultExpenseParams)
  const [csvData, setCsvData] = useState<any[]>([])
  const [isUsingCsvData, setIsUsingCsvData] = useState(false)

  // Original chart states
  const [sortBy, setSortBy] = useState<"fee" | "date" | "name">("fee")
  const [filterState, setFilterState] = useState<string>("all")
  const [chartViewType, setChartViewType] = useState<"projects" | "monthly" | "quarterly" | "growth" | "map">(
    "projects",
  )

  const projectData = useMemo(() => {
    if (isUsingCsvData && csvData.length > 0) {
      return csvData.map((row) => ({
        name: row.name || row.Name || row.project_name || row["Project Name"] || "Unknown Project",
        totalFee: row.totalFee || row.total_fee || row["Total Fee"] || row.fee || row.Fee || 0,
        state: row.state || row.State || row.location || row.Location || "Unknown",
        startDate: row.startDate || row.start_date || row["Start Date"] || row.start || "",
        endDate: row.endDate || row.end_date || row["End Date"] || row.end || "",
        dateAwarded:
          row.dateAwarded ||
          row.date_awarded ||
          row["Date Awarded"] ||
          row.awarded ||
          row.startDate ||
          row.start_date ||
          row["Start Date"] ||
          "",
        status: row.status || row.Status || "Active",
      }))
    }
    return aggregateProjectData()
  }, [csvData, isUsingCsvData])

  const states = useMemo(() => {
    const uniqueStates = [...new Set(projectData.map((p) => p.state))].sort()
    return ["all", ...uniqueStates]
  }, [projectData])

  const processedData = useMemo(() => {
    let filtered = projectData

    if (filterState !== "all") {
      filtered = projectData.filter((p) => p.state === filterState)
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "fee":
          return b.totalFee - a.totalFee
        case "date":
          return new Date(b.dateAwarded).getTime() - new Date(a.dateAwarded).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return sorted.map((project) => ({
      ...project,
      shortName: project.name.length > 25 ? project.name.substring(0, 25) + "..." : project.name,
      feeFormatted: `$${(project.totalFee / 1000).toFixed(0)}K`,
    }))
  }, [sortBy, filterState, projectData])

  const totalValue = useMemo(() => {
    return processedData.reduce((sum, project) => sum + project.totalFee, 0)
  }, [processedData])

  const monthlyRevenueData = useMemo(() => {
    return calculateMonthlyRevenue(projectData)
  }, [projectData])

  const quarterlyData = useMemo(() => {
    const quarterMap = new Map<string, { quarter: string; value: number; projects: string[] }>()

    projectData.forEach((project) => {
      if (project.dateAwarded) {
        const quarter = getQuarter(project.dateAwarded)
        if (quarterMap.has(quarter)) {
          const existing = quarterMap.get(quarter)!
          existing.value += project.totalFee
          existing.projects.push(project.name)
        } else {
          quarterMap.set(quarter, {
            quarter,
            value: project.totalFee,
            projects: [project.name],
          })
        }
      }
    })

    return Array.from(quarterMap.values()).sort((a, b) => {
      const [aQ, aYear] = a.quarter.split(" ")
      const [bQ, bYear] = b.quarter.split(" ")
      const aYearNum = Number.parseInt(aYear)
      const bYearNum = Number.parseInt(bYear)
      const aQuarterNum = Number.parseInt(aQ.replace("Q", ""))
      const bQuarterNum = Number.parseInt(bQ.replace("Q", ""))

      if (aYearNum !== bYearNum) {
        return aYearNum - bYearNum
      }
      return aQuarterNum - bQuarterNum
    })
  }, [projectData])

  const growthTrendData = useMemo(() => {
    const sortedProjects = [...projectData]
      .filter((p) => p.dateAwarded)
      .sort((a, b) => new Date(a.dateAwarded).getTime() - new Date(b.dateAwarded).getTime())

    const cumulativeData = []
    let runningTotal = 0

    const yearlyData = new Map()

    sortedProjects.forEach((project) => {
      const year = new Date(project.dateAwarded).getFullYear()
      if (!yearlyData.has(year)) {
        yearlyData.set(year, { year, value: 0, projects: [] })
      }
      const yearData = yearlyData.get(year)
      yearData.value += project.totalFee
      yearData.projects.push(project.name)
    })

    const years = Array.from(yearlyData.keys()).sort()
    years.forEach((year) => {
      runningTotal += yearlyData.get(year).value
      cumulativeData.push({
        year: year.toString(),
        cumulativeValue: runningTotal,
        yearlyValue: yearlyData.get(year).value,
        projects: yearlyData.get(year).projects,
      })
    })

    const cagr = 0.3

    if (cumulativeData.length >= 1) {
      const lastYear = cumulativeData[cumulativeData.length - 1]
      const currentYear = Number.parseInt(lastYear.year)

      for (let year = currentYear + 1; year <= 2030; year++) {
        const yearsFromLast = year - currentYear
        const projectedValue = lastYear.cumulativeValue * Math.pow(1 + cagr, yearsFromLast)
        cumulativeData.push({
          year: year.toString(),
          cumulativeValue: projectedValue,
          yearlyValue: 0,
          projects: [],
          isProjected: true,
          growthRate: cagr,
        })
      }
    }

    return cumulativeData
  }, [projectData])

  // Map data for state summary
  const mapStateData = useMemo(() => {
    const stateMap = new Map()
    projectData.forEach((project) => {
      const state = project.state
      if (!stateMap.has(state)) {
        stateMap.set(state, { state, count: 0, totalValue: 0, projects: [] })
      }
      const existing = stateMap.get(state)
      existing.count += 1
      existing.totalValue += project.totalFee
      existing.projects.push(project)
    })
    return Array.from(stateMap.values()).sort((a, b) => b.totalValue - a.totalValue)
  }, [projectData])

  // Expense calculations with dynamic parameters
  const calculateExpenses = (fte: number, year: number) => {
    const baseYear = 2025
    const yearsFromBase = year - baseYear
    const inflationMultiplier = Math.pow(1 + expenseParams.inflationRate, yearsFromBase)

    const avgSalary = expenseParams.avgSalary * inflationMultiplier
    const healthcarePerEmployee = expenseParams.healthcarePerEmployee * inflationMultiplier
    const payrollTaxes = avgSalary * expenseParams.payrollTaxRate
    const unemploymentTax = avgSalary * expenseParams.unemploymentTaxRate
    const workersComp = avgSalary * expenseParams.workersCompRate
    const retirement401k = avgSalary * expenseParams.retirement401kRate

    const officeRentPerMonth = expenseParams.officeRentPerMonth * inflationMultiplier
    const utilitiesPerMonth = expenseParams.utilitiesPerMonth * inflationMultiplier
    const internetPhonePerMonth = expenseParams.internetPhonePerMonth * inflationMultiplier

    const laptopPerEmployee = expenseParams.laptopPerEmployee * inflationMultiplier
    const softwareLicensesPerEmployee = expenseParams.softwareLicensesPerEmployee * inflationMultiplier
    const itSupportPerEmployee = expenseParams.itSupportPerEmployee * inflationMultiplier

    const accountingAnnual = expenseParams.accountingAnnual * inflationMultiplier
    const legalAnnual = expenseParams.legalAnnual * inflationMultiplier
    const insuranceAnnual = expenseParams.insuranceAnnual * inflationMultiplier

    const marketingAnnual = expenseParams.marketingAnnual * inflationMultiplier
    const conferencesTrainingPerEmployee = expenseParams.conferencesTrainingPerEmployee * inflationMultiplier

    const travelPerEmployee = expenseParams.travelPerEmployee * inflationMultiplier

    const officeSuppliesPerEmployee = expenseParams.officeSuppliesPerEmployee * inflationMultiplier
    const miscellaneousPerEmployee = expenseParams.miscellaneousPerEmployee * inflationMultiplier

    return {
      salaries: avgSalary * fte,
      healthcare: healthcarePerEmployee * fte,
      payrollTaxes: payrollTaxes * fte,
      unemploymentTax: unemploymentTax * fte,
      workersComp: workersComp * fte,
      retirement: retirement401k * fte,
      officeRent: officeRentPerMonth * 12,
      utilities: utilitiesPerMonth * 12,
      internetPhone: internetPhonePerMonth * 12,
      equipment: (laptopPerEmployee * fte) / 3,
      software: softwareLicensesPerEmployee * fte,
      itSupport: itSupportPerEmployee * fte,
      accounting: accountingAnnual,
      legal: legalAnnual,
      insurance: insuranceAnnual,
      marketing: marketingAnnual,
      training: conferencesTrainingPerEmployee * fte,
      travel: travelPerEmployee * fte,
      officeSupplies: officeSuppliesPerEmployee * inflationMultiplier * fte,
      miscellaneous: miscellaneousPerEmployee * inflationMultiplier * fte,
      year,
      fte,
    }
  }

  // Revenue projections
  const calculateRevenue = (year: number) => {
    const baseRevenue2025 = 4100000
    const growthRate = 0.3
    const yearsFromBase = year - 2025
    return baseRevenue2025 * Math.pow(1 + growthRate, yearsFromBase)
  }

  const calculateBillableRevenue = (fte: number, year: number) => {
    const baseYear = 2025
    const yearsFromBase = year - baseYear
    const inflationMultiplier = Math.pow(1 + expenseParams.inflationRate, yearsFromBase)

    const billableHoursPerFTE = 1600
    const averageHourlyRate = 175 * inflationMultiplier

    return fte * billableHoursPerFTE * averageHourlyRate
  }

  const projectionYears = [2025, 2026, 2027, 2028, 2029, 2030]

  const businessProjections = useMemo(() => {
    return projectionYears.map((year) => {
      const fteForYear = year <= 2025 ? 1 : year <= 2026 ? 2 : 3
      const expenses = calculateExpenses(fteForYear, year)
      const contractRevenue = calculateRevenue(year)
      const billableRevenue = calculateBillableRevenue(fteForYear, year)

      const totalExpenses = Object.values(expenses).reduce((sum, val) => (typeof val === "number" ? sum + val : sum), 0)

      const netIncome = contractRevenue - totalExpenses
      const profitMargin = (netIncome / contractRevenue) * 100

      return {
        year,
        fte: fteForYear,
        contractRevenue,
        billableRevenue,
        totalExpenses,
        netIncome,
        profitMargin,
        expenses,
      }
    })
  }, [expenseParams])

  const expenseBreakdown = useMemo(() => {
    const yearData = businessProjections.find((p) => p.year === selectedYear)
    if (!yearData) return []

    const expenses = yearData.expenses
    return [
      { category: "Salaries", amount: expenses.salaries, color: "hsl(var(--chart-1))" },
      { category: "Healthcare", amount: expenses.healthcare, color: "hsl(var(--chart-2))" },
      {
        category: "Payroll Taxes",
        amount: expenses.payrollTaxes + expenses.unemploymentTax + expenses.workersComp,
        color: "hsl(var(--chart-3))",
      },
      { category: "Retirement", amount: expenses.retirement, color: "hsl(var(--chart-4))" },
      { category: "Office Rent", amount: expenses.officeRent, color: "hsl(var(--chart-5))" },
      {
        category: "IT & Software",
        amount: expenses.equipment + expenses.software + expenses.itSupport,
        color: "hsl(var(--chart-1))",
      },
      {
        category: "Professional Services",
        amount: expenses.accounting + expenses.legal + expenses.insurance,
        color: "hsl(var(--chart-2))",
      },
      { category: "Travel", amount: expenses.travel, color: "hsl(var(--chart-3))" },
      { category: "Marketing", amount: expenses.marketing, color: "hsl(var(--chart-4))" },
      { category: "Training", amount: expenses.training, color: "hsl(var(--chart-5))" },
      {
        category: "Other",
        amount: expenses.utilities + expenses.internetPhone + expenses.officeSupplies + expenses.miscellaneous,
        color: "hsl(var(--chart-1))",
      },
    ].sort((a, b) => b.amount - a.amount)
  }, [selectedYear, businessProjections])

  const updateExpenseParam = (key: string, value: number) => {
    setExpenseParams((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const csvText = e.target?.result as string
      try {
        const parsedData = parseCSV(csvText)
        setCsvData(parsedData)
        setIsUsingCsvData(true)
      } catch (error) {
        console.error("Error parsing CSV:", error)
        alert("Error parsing CSV file. Please check the format.")
      }
    }
    reader.readAsText(file)
  }

  const handleStateClick = (state: string) => {
    setFilterState(state)
    setChartViewType("projects")
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Educational Consulting Business Plan</CardTitle>
          <CardDescription>
            Complete financial analysis with original project charts and dynamic expense modeling
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={viewType} onValueChange={(value) => setViewType(value as any)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="charts">Original Charts</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Revenue Analysis</CardTitle>
              <CardDescription>
                Educational facility projects showing revenue distribution across {processedData.length} active projects
              </CardDescription>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                  <label htmlFor="csv-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload CSV
                      </span>
                    </Button>
                  </label>
                  {isUsingCsvData && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsUsingCsvData(false)
                        setCsvData([])
                      }}
                    >
                      Use Sample Data
                    </Button>
                  )}
                  {isUsingCsvData && (
                    <span className="text-sm text-muted-foreground">Using CSV data ({csvData.length} projects)</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={chartViewType === "projects" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartViewType("projects")}
                  >
                    By Project
                  </Button>
                  <Button
                    variant={chartViewType === "monthly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartViewType("monthly")}
                  >
                    Monthly Revenue
                  </Button>
                  <Button
                    variant={chartViewType === "quarterly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartViewType("quarterly")}
                  >
                    Quarterly Awards
                  </Button>
                  <Button
                    variant={chartViewType === "growth" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartViewType("growth")}
                  >
                    Growth Trend
                  </Button>
                  <Button
                    variant={chartViewType === "map" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartViewType("map")}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Map View
                  </Button>
                </div>
                {chartViewType === "projects" && (
                  <>
                    <div className="flex gap-2">
                      <Button
                        variant={sortBy === "fee" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("fee")}
                      >
                        Sort by Fee
                      </Button>
                      <Button
                        variant={sortBy === "date" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("date")}
                      >
                        Sort by Date
                      </Button>
                      <Button
                        variant={sortBy === "name" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("name")}
                      >
                        Sort by Name
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {states.map((state) => (
                        <Button
                          key={state}
                          variant={filterState === state ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterState(state)}
                        >
                          {state === "all" ? "All States" : state}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {chartViewType === "map" && (
                <div className="space-y-4">
                  <USMap projects={projectData} onStateClick={handleStateClick} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Projects by State</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mapStateData.map((stateData, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                              onClick={() => handleStateClick(stateData.state)}
                            >
                              <div>
                                <div className="font-medium">
                                  {stateCoordinates[stateData.state]?.name || stateData.state} ({stateData.state})
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {stateData.count} project{stateData.count !== 1 ? "s" : ""}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">${(stateData.totalValue / 1000).toFixed(0)}K</div>
                                <div className="text-sm text-muted-foreground">
                                  ${(stateData.totalValue / stateData.count / 1000).toFixed(0)}K avg
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Geographic Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-semibold">Total States</div>
                              <div className="text-2xl font-bold text-primary">{mapStateData.length}</div>
                            </div>
                            <div>
                              <div className="font-semibold">Largest Market</div>
                              <div className="text-lg font-bold text-green-600">
                                {mapStateData[0]?.state} (${(mapStateData[0]?.totalValue / 1000).toFixed(0)}K)
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold mb-2">Top Markets</div>
                            <div className="space-y-2">
                              {mapStateData.slice(0, 3).map((stateData, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{stateData.state}</span>
                                  <span className="font-medium">${(stateData.totalValue / 1000).toFixed(0)}K</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {chartViewType === "growth" && growthTrendData.length > 0 && (
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">2023 Starting Value</div>
                      <div className="text-2xl font-bold text-primary">
                        ${(growthTrendData[0]?.cumulativeValue / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">Current Value (2025)</div>
                      <div className="text-2xl font-bold text-green-600">
                        $
                        {(
                          growthTrendData.find((d) => d.year === "2025" && !d.isProjected)?.cumulativeValue / 1000000 ||
                          growthTrendData[growthTrendData.findIndex((d) => d.isProjected) - 1]?.cumulativeValue /
                            1000000 ||
                          0
                        ).toFixed(1)}
                        M
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">Growth Rate (CAGR)</div>
                      <div className="text-2xl font-bold text-blue-600">30.0%</div>
                    </div>
                    <div>
                      <div className="font-semibold">2030 Projection</div>
                      <div className="text-2xl font-bold text-purple-600">
                        ${(growthTrendData.find((d) => d.year === "2030")?.cumulativeValue / 1000000 || 0).toFixed(1)}M
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {chartViewType !== "growth" && chartViewType !== "map" && (
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">Total Projects</div>
                      <div className="text-2xl font-bold text-primary">{processedData.length}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Total Value</div>
                      <div className="text-2xl font-bold text-green-600">${(totalValue / 1000000).toFixed(1)}M</div>
                    </div>
                    <div>
                      <div className="font-semibold">Average Project</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${(totalValue / processedData.length / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">States Covered</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {new Set(processedData.map((p) => p.state)).size}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {chartViewType === "projects" && (
                <ChartContainer
                  config={{
                    fee: {
                      label: "Project Fee",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[600px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="shortName" angle={-45} textAnchor="end" height={120} fontSize={12} />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} fontSize={12} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{data.name}</p>
                                <p className="text-sm text-muted-foreground">State: {data.state}</p>
                                <p className="text-sm text-muted-foreground">Start: {data.startDate}</p>
                                <p className="text-sm text-muted-foreground">End: {data.endDate}</p>
                                <p className="text-lg font-bold text-primary">${data.totalFee.toLocaleString()}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="totalFee" fill="var(--color-fee)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}

              {chartViewType === "monthly" && (
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Monthly Revenue",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[500px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" fontSize={12} angle={-45} textAnchor="end" height={80} />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} fontSize={12} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg max-w-xs">
                                <p className="font-semibold">{data.month}</p>
                                <p className="text-lg font-bold text-primary">${data.revenue.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Active Projects ({data.projects.length}):
                                </p>
                                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                                  {data.projects.slice(0, 3).map((project: string, idx: number) => (
                                    <li key={idx} className="truncate">
                                      • {project.length > 25 ? project.substring(0, 25) + "..." : project}
                                    </li>
                                  ))}
                                  {data.projects.length > 3 && (
                                    <li className="text-xs">... and {data.projects.length - 3} more</li>
                                  )}
                                </ul>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}

              {chartViewType === "quarterly" && (
                <ChartContainer
                  config={{
                    value: {
                      label: "Contract Value",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quarterlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" fontSize={12} />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} fontSize={12} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg max-w-xs">
                                <p className="font-semibold">{data.quarter}</p>
                                <p className="text-lg font-bold text-primary">${data.value.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground mt-2">Projects ({data.projects.length}):</p>
                                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                                  {data.projects.map((project: string, idx: number) => (
                                    <li key={idx} className="truncate">
                                      • {project.length > 30 ? project.substring(0, 30) + "..." : project}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}

              {chartViewType === "growth" && (
                <ChartContainer
                  config={{
                    cumulativeValue: {
                      label: "Cumulative Value",
                      color: "hsl(var(--chart-4))",
                    },
                    projected: {
                      label: "Projected Value",
                      color: "hsl(var(--chart-5))",
                    },
                  }}
                  className="h-[500px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" fontSize={12} />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} fontSize={12} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            const isProjected = data.isProjected
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg max-w-xs">
                                <p className="font-semibold">
                                  {data.year} {isProjected && "(Projected)"}
                                </p>
                                <p className="text-lg font-bold text-primary">
                                  ${data.cumulativeValue.toLocaleString()}
                                </p>
                                {!isProjected && data.yearlyValue > 0 && (
                                  <p className="text-sm text-muted-foreground">
                                    New contracts: ${data.yearlyValue.toLocaleString()}
                                  </p>
                                )}
                                {isProjected && data.growthRate && (
                                  <p className="text-sm text-muted-foreground">
                                    Growth rate: {(data.growthRate * 100).toFixed(1)}% CAGR
                                  </p>
                                )}
                                {!isProjected && data.projects && data.projects.length > 0 && (
                                  <>
                                    <p className="text-sm text-muted-foreground mt-2">
                                      Projects ({data.projects.length}):
                                    </p>
                                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                                      {data.projects.slice(0, 3).map((project: string, idx: number) => (
                                        <li key={idx} className="truncate">
                                          • {project.length > 25 ? project.substring(0, 25) + "..." : project}
                                        </li>
                                      ))}
                                      {data.projects.length > 3 && (
                                        <li className="text-xs">... and {data.projects.length - 3} more</li>
                                      )}
                                    </ul>
                                  </>
                                )}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cumulativeValue"
                        stroke="var(--color-cumulativeValue)"
                        strokeWidth={3}
                        dot={(props) => {
                          const { payload } = props
                          return (
                            <circle
                              cx={props.cx}
                              cy={props.cy}
                              r={payload?.isProjected ? 3 : 5}
                              fill={payload?.isProjected ? "hsl(var(--chart-5))" : "var(--color-cumulativeValue)"}
                              strokeWidth={payload?.isProjected ? 2 : 0}
                              stroke={payload?.isProjected ? "var(--color-cumulativeValue)" : "none"}
                              strokeDasharray={payload?.isProjected ? "4,4" : "none"}
                            />
                          )
                        }}
                        strokeDasharray={(dataPoint) => (dataPoint?.isProjected ? "8,8" : "none")}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {businessProjections.map((projection) => (
              <Card key={projection.year}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{projection.year}</CardTitle>
                  <CardDescription>{projection.fte} FTE</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                    <div className="text-xl font-bold text-green-600">
                      ${(projection.contractRevenue / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Expenses</div>
                    <div className="text-lg font-semibold text-red-600">
                      ${(projection.totalExpenses / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Net Income</div>
                    <div className="text-lg font-bold text-blue-600">${(projection.netIncome / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Profit Margin</div>
                    <div className="text-sm font-semibold">{projection.profitMargin.toFixed(1)}%</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>5-Year Business Growth Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
                  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
                  netIncome: { label: "Net Income", color: "hsl(var(--chart-3))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={businessProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">
                                {label} ({data.fte} FTE)
                              </p>
                              <p className="text-green-600">Revenue: ${(data.contractRevenue / 1000000).toFixed(1)}M</p>
                              <p className="text-red-600">Expenses: ${(data.totalExpenses / 1000).toFixed(0)}K</p>
                              <p className="text-blue-600">Net Income: ${(data.netIncome / 1000).toFixed(0)}K</p>
                              <p className="text-sm">Margin: {data.profitMargin.toFixed(1)}%</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="contractRevenue"
                      stackId="1"
                      stroke="var(--color-revenue)"
                      fill="var(--color-revenue)"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalExpenses"
                      stackId="2"
                      stroke="var(--color-expenses)"
                      fill="var(--color-expenses)"
                      fillOpacity={0.6}
                    />
                    <Line type="monotone" dataKey="netIncome" stroke="var(--color-netIncome)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex gap-2">
              <span className="text-sm font-medium">Year:</span>
              {projectionYears.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Expense Breakdown - {selectedYear}</CardTitle>
                <CardDescription>
                  {businessProjections.find((p) => p.year === selectedYear)?.fte} FTE Configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    amount: { label: "Amount", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseBreakdown} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <YAxis dataKey="category" type="category" width={120} fontSize={12} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{label}</p>
                                <p className="text-lg font-bold">${payload[0].value?.toLocaleString()}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="amount" fill="var(--color-amount)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Parameters</CardTitle>
                <CardDescription>Adjust values to see impact on projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="avgSalary">Average Salary</Label>
                  <Input
                    id="avgSalary"
                    type="number"
                    value={expenseParams.avgSalary}
                    onChange={(e) => updateExpenseParam("avgSalary", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthcare">Healthcare per Employee</Label>
                  <Input
                    id="healthcare"
                    type="number"
                    value={expenseParams.healthcarePerEmployee}
                    onChange={(e) => updateExpenseParam("healthcarePerEmployee", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officeRent">Office Rent (Monthly)</Label>
                  <Input
                    id="officeRent"
                    type="number"
                    value={expenseParams.officeRentPerMonth}
                    onChange={(e) => updateExpenseParam("officeRentPerMonth", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travel">Travel per Employee</Label>
                  <Input
                    id="travel"
                    type="number"
                    value={expenseParams.travelPerEmployee}
                    onChange={(e) => updateExpenseParam("travelPerEmployee", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketing">Marketing (Annual)</Label>
                  <Input
                    id="marketing"
                    type="number"
                    value={expenseParams.marketingAnnual}
                    onChange={(e) => updateExpenseParam("marketingAnnual", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="software">Software per Employee</Label>
                  <Input
                    id="software"
                    type="number"
                    value={expenseParams.softwareLicensesPerEmployee}
                    onChange={(e) => updateExpenseParam("softwareLicensesPerEmployee", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accounting">Accounting (Annual)</Label>
                  <Input
                    id="accounting"
                    type="number"
                    value={expenseParams.accountingAnnual}
                    onChange={(e) => updateExpenseParam("accountingAnnual", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inflation">Inflation Rate</Label>
                  <Input
                    id="inflation"
                    type="number"
                    step="0.01"
                    value={expenseParams.inflationRate}
                    onChange={(e) => updateExpenseParam("inflationRate", Number(e.target.value))}
                  />
                </div>
                <Button variant="outline" onClick={() => setExpenseParams(defaultExpenseParams)} className="w-full">
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expenseBreakdown.map((expense, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{expense.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {(
                          (expense.amount / businessProjections.find((p) => p.year === selectedYear)!.totalExpenses) *
                          100
                        ).toFixed(1)}
                        % of total
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${expense.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">${(expense.amount / 12).toFixed(0)}/month</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth Projection</CardTitle>
              <CardDescription>Contract revenue vs billable capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  contractRevenue: { label: "Contract Revenue", color: "hsl(var(--chart-1))" },
                  billableRevenue: { label: "Billable Capacity", color: "hsl(var(--chart-2))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={businessProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">
                                {label} ({data.fte} FTE)
                              </p>
                              <p className="text-blue-600">
                                Contract Revenue: ${(data.contractRevenue / 1000000).toFixed(1)}M
                              </p>
                              <p className="text-green-600">
                                Billable Capacity: ${(data.billableRevenue / 1000000).toFixed(1)}M
                              </p>
                              <p className="text-sm">
                                Utilization: {((data.contractRevenue / data.billableRevenue) * 100).toFixed(1)}%
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="contractRevenue"
                      stroke="var(--color-contractRevenue)"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="billableRevenue"
                      stroke="var(--color-billableRevenue)"
                      strokeWidth={3}
                      strokeDasharray="5,5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>Monthly cash flow projections</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  netIncome: { label: "Net Income", color: "hsl(var(--chart-3))" },
                  profitMargin: { label: "Profit Margin %", color: "hsl(var(--chart-4))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={businessProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(0)}%`} />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{label}</p>
                              <p className="text-blue-600">Net Income: ${(data.netIncome / 1000).toFixed(0)}K</p>
                              <p className="text-green-600">Profit Margin: {data.profitMargin.toFixed(1)}%</p>
                              <p className="text-sm">Monthly: ${(data.netIncome / 12 / 1000).toFixed(0)}K</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="netIncome"
                      stroke="var(--color-netIncome)"
                      strokeWidth={3}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="profitMargin"
                      stroke="var(--color-profitMargin)"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Break-Even Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Monthly Fixed Costs (3 FTE)</div>
                    <div className="text-xl font-bold">
                      ${(businessProjections.find((p) => p.year === 2028)?.totalExpenses / 12 / 1000 || 0).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Required Monthly Revenue</div>
                    <div className="text-lg font-semibold text-green-600">
                      ${(businessProjections.find((p) => p.year === 2028)?.totalExpenses / 12 / 1000 || 0).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Ratios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Revenue per FTE (2028)</div>
                    <div className="text-xl font-bold">
                      $
                      {((businessProjections.find((p) => p.year === 2028)?.contractRevenue || 0) / 3 / 1000).toFixed(0)}
                      K
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Cost per FTE (2028)</div>
                    <div className="text-lg font-semibold">
                      ${((businessProjections.find((p) => p.year === 2028)?.totalExpenses || 0) / 3 / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-muted-foreground">5-Year Revenue CAGR</div>
                    <div className="text-xl font-bold text-green-600">30.0%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Target 2030 Revenue</div>
                    <div className="text-lg font-semibold">
                      ${(businessProjections.find((p) => p.year === 2030)?.contractRevenue / 1000000 || 0).toFixed(1)}M
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
