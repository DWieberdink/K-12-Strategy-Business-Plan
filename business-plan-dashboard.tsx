"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, MapPin } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Line,
  LineChart,
  Cell,
  Legend,
  Brush,
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

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

// Enhanced function to clean and parse monetary values
const cleanFee = (str: string | number) => {
  if (!str) return 0
  if (typeof str === "number") return str

  // Remove all non-numeric characters except decimal points and negative signs
  let cleaned = str.toString().replace(/[^\d.-]/g, "")

  // Handle cases where there might be multiple decimal points
  const parts = cleaned.split(".")
  if (parts.length > 2) {
    // If more than one decimal point, assume the last one is the decimal separator
    // and the others are thousands separators
    cleaned = parts.slice(0, -1).join("") + "." + parts[parts.length - 1]
  }

  // Parse the cleaned string
  const parsed = Number.parseFloat(cleaned)

  // Return 0 if parsing failed, otherwise return the parsed number
  return isNaN(parsed) ? 0 : parsed
}

// Original project data for charts tab
const aggregateProjectData = () => {
  const projects = [
    {
      Start_Date: "7/17/2025",
      Completion_Date: "10/1/2025",
      "Practice Area": "K12 Education",
      Status: "Awaiting",
      Project_Name: "Montgomery County Public Schools",
      City: "Montgomery",
      State: "MD",
      Date_Awarded: "6/1/2025",
      detail_Name: "Montgomery County Public Schools",
      Studio: "Austin Studio 01",
      Fee: 400000.0,
      Reimbursables: " $10,000.00 ",
    },
    {
      Start_Date: "8/1/2025",
      Completion_Date: "12/1/2025",
      "Practice Area": "Higher Education",
      Status: "In Progress",
      Project_Name: "University of Texas at Austin",
      City: "Austin",
      State: "TX",
      Date_Awarded: "7/1/2025",
      detail_Name: "University of Texas at Austin",
      Studio: "Austin Studio 01",
      Fee: 750000.0,
      Reimbursables: " $25,000.00 ",
    },
    {
      Start_Date: "9/15/2025",
      Completion_Date: "3/15/2026",
      "Practice Area": "K12 Education",
      Status: "In Progress",
      Project_Name: "Los Angeles Unified School District",
      City: "Los Angeles",
      State: "CA",
      Date_Awarded: "8/15/2025",
      detail_Name: "Los Angeles Unified School District",
      Studio: "LA Studio 01",
      Fee: 1200000.0,
      Reimbursables: " $50,000.00 ",
    },
    {
      Start_Date: "10/1/2025",
      Completion_Date: "6/1/2026",
      "Practice Area": "K12 Education",
      Status: "Completed",
      Project_Name: "Chicago Public Schools",
      City: "Chicago",
      State: "IL",
      Date_Awarded: "9/1/2025",
      detail_Name: "Chicago Public Schools",
      Studio: "Chicago Studio 01",
      Fee: 950000.0,
      Reimbursables: " $30,000.00 ",
    },
    {
      Start_Date: "11/1/2025",
      Completion_Date: "5/1/2026",
      "Practice Area": "Higher Education",
      Status: "Awaiting",
      Project_Name: "Harvard University",
      City: "Cambridge",
      State: "MA",
      Date_Awarded: "10/1/2025",
      detail_Name: "Harvard University",
      Studio: "Boston Studio 01",
      Fee: 850000.0,
      Reimbursables: " $40,000.00 ",
    },
    {
      Start_Date: "12/1/2025",
      Completion_Date: "8/1/2026",
      "Practice Area": "K12 Education",
      Status: "In Progress",
      Project_Name: "Miami-Dade County Public Schools",
      City: "Miami",
      State: "FL",
      Date_Awarded: "11/1/2025",
      detail_Name: "Miami-Dade County Public Schools",
      Studio: "Miami Studio 01",
      Fee: 1100000.0,
      Reimbursables: " $45,000.00 ",
    },
    {
      Start_Date: "1/15/2026",
      Completion_Date: "7/15/2026",
      "Practice Area": "Higher Education",
      Status: "In Progress",
      Project_Name: "Stanford University",
      City: "Stanford",
      State: "CA",
      Date_Awarded: "12/15/2025",
      detail_Name: "Stanford University",
      Studio: "LA Studio 01",
      Fee: 1500000.0,
      Reimbursables: " $60,000.00 ",
    },
    {
      Start_Date: "2/1/2026",
      Completion_Date: "9/1/2026",
      "Practice Area": "K12 Education",
      Status: "Awaiting",
      Project_Name: "Houston Independent School District",
      City: "Houston",
      State: "TX",
      Date_Awarded: "1/1/2026",
      detail_Name: "Houston Independent School District",
      Studio: "Austin Studio 01",
      Fee: 900000.0,
      Reimbursables: " $35,000.00 ",
    },
    {
      Start_Date: "3/1/2026",
      Completion_Date: "10/1/2026",
      "Practice Area": "Higher Education",
      Status: "Completed",
      Project_Name: "University of California, Berkeley",
      City: "Berkeley",
      State: "CA",
      Date_Awarded: "2/1/2026",
      detail_Name: "University of California, Berkeley",
      Studio: "LA Studio 01",
      Fee: 1300000.0,
      Reimbursables: " $55,000.00 ",
    },
    {
      Start_Date: "4/1/2026",
      Completion_Date: "11/1/2026",
      "Practice Area": "K12 Education",
      Status: "In Progress",
      Project_Name: "Fairfax County Public Schools",
      City: "Fairfax",
      State: "VA",
      Date_Awarded: "3/1/2026",
      detail_Name: "Fairfax County Public Schools",
      Studio: "DC Studio 01",
      Fee: 980000.0,
      Reimbursables: " $40,000.00 ",
    },
  ]

  return projects.map((row) => ({
    name: row.Project_Name || row.detail_Name || "Unknown Project",
    totalFee: cleanFee(row.Fee),
    state: row.State || "",
    city: row.City || "",
    startDate: row.Start_Date || "",
    endDate: row.Completion_Date || "",
    dateAwarded: row.Date_Awarded || row.Start_Date || "",
    status: row.Status || "Active",
    practiceArea: row["Practice Area"] || "",
    reimbursables: cleanFee(row.Reimbursables),
    studio: row.Studio || "",
  }))
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
      row[header] = value
    })

    return row
  })

  // Transform the data to match our expected format - now with enhanced parsing
  return data
    .map((row) => {
      return {
        name: row.Project_Name || row.detail_Name || "Unknown Project",
        totalFee: cleanFee(row.Fee),
        state: row.State || "",
        city: row.City || "",
        startDate: row.Start_Date || "",
        endDate: row.Completion_Date || "",
        dateAwarded: row.Date_Awarded || row.Start_Date || "",
        status: row.Status || "Active",
        practiceArea: row["Practice Area"] || "",
        reimbursables: cleanFee(row.Reimbursables),
        studio: row.Studio || "",
      }
    })
    .filter((project) => project.name && project.name !== "Unknown Project" && project.totalFee > 0)
}

// Simple SVG Map Component with all US states
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
    if (!data) return "#e5e7eb" // gray-200 for states with no projects

    const maxValue = Math.max(...Array.from(stateData.values()).map((d: any) => d.totalValue))
    const intensity = data.totalValue / maxValue

    if (intensity > 0.7) return "#dc2626" // red-600
    if (intensity > 0.4) return "#ea580c" // orange-600
    if (intensity > 0.2) return "#ca8a04" // yellow-600
    return "#16a34a" // green-600
  }

  // All US state paths (simplified but recognizable shapes)
  const statePaths = {
    // West Coast
    CA: "M20 180 L20 420 L120 420 L120 320 L90 270 L70 220 L50 180 Z",
    OR: "M20 120 L120 120 L120 180 L20 180 Z",
    WA: "M20 60 L120 60 L120 120 L20 120 Z",

    // Mountain West
    NV: "M120 180 L180 180 L180 320 L120 320 Z",
    ID: "M120 60 L180 60 L180 180 L120 180 Z",
    UT: "M180 180 L240 180 L240 280 L180 280 Z",
    AZ: "M120 320 L180 320 L180 420 L120 420 Z",
    NM: "M180 320 L240 320 L240 420 L180 420 Z",
    CO: "M240 180 L300 180 L300 280 L240 280 Z",
    WY: "M180 120 L300 120 L300 180 L180 180 Z",
    MT: "M180 60 L360 60 L360 120 L180 120 Z",
    ND: "M360 60 L420 60 L420 120 L360 120 Z",
    SD: "M360 120 L420 120 L420 180 L360 180 Z",
    NE: "M300 180 L420 180 L420 240 L300 240 Z",
    KS: "M300 240 L420 240 L420 300 L300 300 Z",
    OK: "M300 300 L480 300 L480 360 L300 360 Z",
    TX: "M240 360 L480 360 L480 500 L240 500 Z",

    // Midwest
    MN: "M420 60 L480 60 L480 140 L420 140 Z",
    IA: "M420 140 L480 140 L480 200 L420 200 Z",
    MO: "M420 200 L480 200 L480 300 L420 300 Z",
    AR: "M480 300 L540 300 L540 380 L480 380 Z",
    LA: "M480 380 L540 380 L540 460 L480 460 Z",
    WI: "M480 60 L540 60 L540 140 L480 140 Z",
    IL: "M540 140 L580 140 L580 240 L540 240 Z",
    MS: "M540 300 L580 300 L580 420 L540 420 Z",
    AL: "M580 300 L620 300 L620 420 L580 420 Z",
    TN: "M540 240 L660 240 L660 300 L540 300 Z",
    KY: "M580 200 L660 200 L660 240 L580 240 Z",
    IN: "M580 140 L620 140 L620 200 L580 200 Z",
    OH: "M620 140 L680 140 L680 200 L620 200 Z",
    MI: "M620 80 L680 80 L680 140 L620 140 Z",

    // Southeast
    GA: "M620 300 L680 300 L680 400 L620 400 Z",
    FL: "M680 400 L740 400 L760 480 L720 500 L680 480 Z",
    SC: "M680 300 L740 300 L740 360 L680 360 Z",
    NC: "M680 240 L780 240 L780 300 L680 300 Z",
    VA: "M680 200 L780 200 L780 240 L680 240 Z",
    WV: "M680 180 L740 180 L740 220 L680 220 Z",

    // Northeast
    PA: "M680 140 L760 140 L760 200 L680 200 Z",
    NY: "M740 80 L820 80 L820 140 L740 140 Z",
    VT: "M820 80 L840 80 L840 120 L820 120 Z",
    NH: "M840 80 L860 80 L860 120 L840 120 Z",
    ME: "M860 60 L900 60 L900 140 L860 140 Z",
    MA: "M820 120 L880 120 L880 140 L820 140 Z",
    RI: "M880 120 L890 120 L890 135 L880 135 Z",
    CT: "M820 140 L860 140 L860 160 L820 160 Z",
    NJ: "M760 140 L780 140 L780 180 L760 180 Z",
    DE: "M780 160 L790 160 L790 180 L780 180 Z",
    MD: "M760 180 L800 180 L800 200 L760 200 Z",
    DC: "M785 185 L795 185 L795 195 L785 195 Z",

    // Alaska and Hawaii (positioned separately)
    AK: "M60 480 L160 480 L160 540 L60 540 Z",
    HI: "M200 500 L240 500 L240 520 L200 520 Z",
  }

  const getPathCenter = (path: string) => {
    const coords = path.split(" ").filter((coord) => coord !== "M" && coord !== "L" && coord !== "Z")
    const xCoords = []
    const yCoords = []

    for (let i = 0; i < coords.length; i += 2) {
      const x = Number.parseFloat(coords[i])
      const y = Number.parseFloat(coords[i + 1])
      if (!isNaN(x) && !isNaN(y)) {
        xCoords.push(x)
        yCoords.push(y)
      }
    }

    if (xCoords.length === 0 || yCoords.length === 0) {
      return { x: 0, y: 0 }
    }

    return {
      x: xCoords.reduce((a, b) => a + b, 0) / xCoords.length,
      y: yCoords.reduce((a, b) => a + b, 0) / yCoords.length,
    }
  }

  return (
    <div className="w-full">
      <svg viewBox="0 0 920 560" className="w-full h-auto border rounded-lg bg-blue-50">
        {/* Render all states */}
        {Object.entries(statePaths).map(([stateCode, path]) => {
          const hasProjects = stateData.has(stateCode)
          const pathCenter = getPathCenter(path)

          return (
            <g key={stateCode}>
              <path
                d={path}
                fill={getStateColor(stateCode)}
                stroke="#374151"
                strokeWidth="1"
                className={`${hasProjects ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
                onClick={() => hasProjects && onStateClick(stateCode)}
                opacity={hasProjects ? 1 : 0.6}
              />
              {/* State labels */}
              <text
                x={pathCenter.x}
                y={pathCenter.y}
                textAnchor="middle"
                fontSize="10"
                fill={hasProjects ? "#374151" : "#9ca3af"}
                className="pointer-events-none font-medium"
              >
                {stateCode}
              </text>
            </g>
          )
        })}

        {/* Project markers for states with projects */}
        {projects.map((project, index) => {
          const coords = stateCoordinates[project.state]
          if (!coords || !statePaths[project.state]) return null

          const pathCenter = getPathCenter(statePaths[project.state])
          const size = Math.max(3, Math.min(12, (project.totalFee || 0) / 100000))

          return (
            <g key={index}>
              <circle
                cx={pathCenter.x}
                cy={pathCenter.y}
                r={size}
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80"
                opacity="0.9"
              />
              <text
                x={pathCenter.x}
                y={pathCenter.y - size - 8}
                textAnchor="middle"
                fontSize="8"
                fill="#374151"
                className="pointer-events-none font-medium"
              >
                ${((project.totalFee || 0) / 1000).toFixed(0)}K
              </text>
            </g>
          )
        })}
      </svg>

      {/* Enhanced Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded border"></div>
          <span>No Projects</span>
        </div>
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
  loanAmount: 0,
  loanInterestRate: 0.06,
  loanTermYears: 5,
}

export default function BusinessPlanDashboard() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [customFTE, setCustomFTE] = useState(3) // Manual FTE override
  const [viewType, setViewType] = useState<"charts" | "overview" | "expenses" | "revenue" | "cashflow">("charts")
  const [expenseParams, setExpenseParams] = useState(defaultExpenseParams)
  const [csvData, setCsvData] = useState<any[]>([])
  const [isUsingCsvData, setIsUsingCsvData] = useState(false)
  const [showMonthlyExpenses, setShowMonthlyExpenses] = useState(false)
  const [startingCash, setStartingCash] = useState(50000)

  // Original chart states
  const [sortBy, setSortBy] = useState<"fee" | "date" | "name">("fee")
  const [sortReverse, setSortReverse] = useState(false)
  const [filterState, setFilterState] = useState<string>("all")
  const [filterPracticeArea, setFilterPracticeArea] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [chartViewType, setChartViewType] = useState<
    "projects" | "monthly" | "quarterly" | "growth" | "map" | "timeline"
  >("projects")

  const projectData = useMemo(() => {
    if (isUsingCsvData && csvData.length > 0) {
      return csvData // The parseCSV function now returns the correct format
    }
    return aggregateProjectData()
  }, [csvData, isUsingCsvData])

  const states = useMemo(() => {
    const uniqueStates = [...new Set(projectData.map((p) => p.state))].sort()
    return ["all", ...uniqueStates]
  }, [projectData])

  const practiceAreas = useMemo(() => {
    const uniqueAreas = [...new Set(projectData.map((p) => p.practiceArea).filter(Boolean))].sort()
    return ["all", ...uniqueAreas]
  }, [projectData])

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(projectData.map((p) => p.status).filter(Boolean))].sort()
    return ["all", ...uniqueStatuses]
  }, [projectData])

  const processedData = useMemo(() => {
    let filtered = projectData

    if (filterState !== "all") {
      filtered = filtered.filter((p) => p.state === filterState)
    }

    if (filterPracticeArea !== "all") {
      filtered = filtered.filter((p) => p.practiceArea === filterPracticeArea)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus)
    }

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "fee":
          comparison = (Number(b.totalFee) || 0) - (Number(a.totalFee) || 0)
          break
        case "date":
          comparison = new Date(b.dateAwarded).getTime() - new Date(a.dateAwarded).getTime()
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        default:
          comparison = 0
      }
      return sortReverse ? -comparison : comparison
    })

    return sorted.map((project) => {
      const startDate = new Date(project.startDate)
      const endDate = new Date(project.endDate)
      const today = new Date()

      let projectStatus = "not-started"
      let statusColor = "#f97316" // orange for not started

      if (startDate <= today) {
        if (endDate <= today) {
          projectStatus = "completed"
          statusColor = "#22c55e" // green for completed
        } else {
          projectStatus = "in-progress"
          statusColor = "#3b82f6" // blue for in progress
        }
      }

      return {
        ...project,
        shortName: project.name.length > 25 ? project.name.substring(0, 25) + "..." : project.name,
        feeFormatted: `$${(project.totalFee / 1000).toFixed(0)}K`,
        projectStatus,
        statusColor,
        hasStarted: startDate <= today,
        isCompleted: endDate <= today,
      }
    })
  }, [sortBy, sortReverse, filterState, filterPracticeArea, filterStatus, projectData])

  const totalValue = useMemo(() => {
    return processedData.reduce((sum, project) => sum + (Number(project.totalFee) || 0), 0)
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

  // Practice area data
  const practiceAreaData = useMemo(() => {
    const areaMap = new Map()
    projectData.forEach((project) => {
      const area = project.practiceArea || "Unknown"
      if (!areaMap.has(area)) {
        areaMap.set(area, { area, count: 0, totalValue: 0, projects: [] })
      }
      const existing = areaMap.get(area)
      existing.count += 1
      existing.totalValue += project.totalFee
      existing.projects.push(project)
    })
    return Array.from(areaMap.values()).sort((a, b) => b.totalValue - a.totalValue)
  }, [projectData])

  // Status breakdown data
  const statusData = useMemo(() => {
    const statusMap = new Map()
    projectData.forEach((project) => {
      const status = project.status || "Unknown"
      if (!statusMap.has(status)) {
        statusMap.set(status, { status, count: 0, totalValue: 0, projects: [] })
      }
      const existing = statusMap.get(status)
      existing.count += 1
      existing.totalValue += project.totalFee
      existing.projects.push(project)
    })
    return Array.from(statusMap.values()).sort((a, b) => b.totalValue - a.totalValue)
  }, [projectData])

  // Studio breakdown data
  const studioData = useMemo(() => {
    const studioMap = new Map()
    projectData.forEach((project) => {
      const studio = project.studio || "Unknown"
      if (!studioMap.has(studio)) {
        studioMap.set(studio, { studio, count: 0, totalValue: 0, projects: [] })
      }
      const existing = studioMap.get(studio)
      existing.count += 1
      existing.totalValue += project.totalFee
      existing.projects.push(project)
    })
    return Array.from(studioMap.values()).sort((a, b) => b.totalValue - a.totalValue)
  }, [projectData])

  // Expense calculations with dynamic parameters
  const calculateExpenses = (fte: number, year: number) => {
    // Validate inputs
    const validFte = Math.max(1, Number(fte) || 1)
    const validYear = Number(year) || 2025

    const baseYear = 2025
    const yearsFromBase = validYear - baseYear
    const inflationMultiplier = Math.pow(1 + (expenseParams.inflationRate || 0.03), yearsFromBase)

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

    // Calculate loan payment if there's a loan
    const monthlyLoanPayment =
      expenseParams.loanAmount > 0
        ? (expenseParams.loanAmount *
            (expenseParams.loanInterestRate / 12) *
            Math.pow(1 + expenseParams.loanInterestRate / 12, expenseParams.loanTermYears * 12)) /
          (Math.pow(1 + expenseParams.loanInterestRate / 12, expenseParams.loanTermYears * 12) - 1)
        : 0
    const annualLoanPayment = monthlyLoanPayment * 12

    return {
      salaries: avgSalary * validFte,
      healthcare: healthcarePerEmployee * validFte,
      payrollTaxes: payrollTaxes * validFte,
      unemploymentTax: unemploymentTax * validFte,
      workersComp: workersComp * validFte,
      retirement: retirement401k * validFte,
      officeRent: officeRentPerMonth * 12,
      utilities: utilitiesPerMonth * 12,
      internetPhone: internetPhonePerMonth * 12,
      equipment: (laptopPerEmployee * validFte) / 3,
      software: softwareLicensesPerEmployee * validFte,
      itSupport: itSupportPerEmployee * validFte,
      accounting: accountingAnnual,
      legal: legalAnnual,
      insurance: insuranceAnnual,
      marketing: marketingAnnual,
      training: conferencesTrainingPerEmployee * validFte,
      travel: travelPerEmployee * validFte,
      officeSupplies: officeSuppliesPerEmployee * inflationMultiplier * validFte,
      miscellaneous: miscellaneousPerEmployee * inflationMultiplier * validFte,
      loanPayment: annualLoanPayment,
      year: validYear,
      fte: validFte,
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
    // Use custom FTE for the selected year calculation
    const expenses = calculateExpenses(customFTE, selectedYear)
    const breakdown = [
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
    ]

    // Add loan payment if it exists
    if (expenses.loanPayment > 0) {
      breakdown.push({
        category: "Loan Payment",
        amount: expenses.loanPayment,
        color: "hsl(var(--chart-6))",
      })
    }

    return breakdown.sort((a, b) => b.amount - a.amount)
  }, [selectedYear, customFTE, expenseParams])

  const monthlyExpensesData = useMemo(() => {
    const expensesByMonth = new Map()

    // Calculate monthly expenses for each year
    businessProjections.forEach((projection) => {
      const monthlyExpense = projection.totalExpenses / 12

      for (let month = 1; month <= 12; month++) {
        const monthKey = `${projection.year}-${String(month).padStart(2, "0")}`
        expensesByMonth.set(monthKey, monthlyExpense)
      }
    })

    return Array.from(expensesByMonth.entries())
      .map(([month, expense]) => ({
        month,
        expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [businessProjections])

  const combinedMonthlyData = useMemo(() => {
    const combined = new Map()
    monthlyRevenueData.forEach((item) => {
      combined.set(item.month, { ...item, expense: 0 })
    })
    monthlyExpensesData.forEach((item) => {
      if (combined.has(item.month)) {
        combined.get(item.month).expense = item.expense
      } else {
        combined.set(item.month, { month: item.month, revenue: 0, expense: item.expense, projects: [] })
      }
    })
    return Array.from(combined.values()).sort((a, b) => a.month.localeCompare(b.month))
  }, [monthlyRevenueData, monthlyExpensesData])

  const cashFlowProjections = useMemo(() => {
    let cumulativeCash = startingCash
    return businessProjections.map((proj) => {
      cumulativeCash += proj.netIncome
      return {
        ...proj,
        cumulativeCash,
      }
    })
  }, [businessProjections, startingCash])

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
          <TabsTrigger value="charts">Project Performance</TabsTrigger>
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
              <div className="flex flex-wrap items-center gap-4 mt-4">
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
                  {!isUsingCsvData && (
                    <span className="text-sm text-muted-foreground">
                      Using Sample Data ({projectData.length} projects)
                    </span>
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
                  <Button
                    variant={chartViewType === "timeline" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartViewType("timeline")}
                  >
                    Timeline
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={sortBy === "fee" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (sortBy === "fee") {
                        setSortReverse(!sortReverse)
                      } else {
                        setSortBy("fee")
                        setSortReverse(false)
                      }
                    }}
                  >
                    Sort by Fee {sortBy === "fee" && (sortReverse ? "↑" : "↓")}
                  </Button>
                  <Button
                    variant={sortBy === "date" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (sortBy === "date") {
                        setSortReverse(!sortReverse)
                      } else {
                        setSortBy("date")
                        setSortReverse(false)
                      }
                    }}
                  >
                    Sort by Date {sortBy === "date" && (sortReverse ? "↑" : "↓")}
                  </Button>
                  <Button
                    variant={sortBy === "name" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (sortBy === "name") {
                        setSortReverse(!sortReverse)
                      } else {
                        setSortBy("name")
                        setSortReverse(false)
                      }
                    }}
                  >
                    Sort by Name {sortBy === "name" && (sortReverse ? "↑" : "↓")}
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

                {practiceAreas.length > 1 && (
                  <div className="flex gap-2">
                    {practiceAreas.slice(0, 4).map((area) => (
                      <Button
                        key={area}
                        variant={filterPracticeArea === area ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterPracticeArea(area)}
                      >
                        {area === "all" ? "All Areas" : area.length > 15 ? area.substring(0, 15) + "..." : area}
                      </Button>
                    ))}
                  </div>
                )}

                {statuses.length > 1 && (
                  <div className="flex gap-2">
                    {statuses.map((status) => (
                      <Button
                        key={status}
                        variant={filterStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus(status)}
                      >
                        {status === "all" ? "All Status" : status}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {chartViewType === "map" && (
                <div className="space-y-4">
                  <USMap projects={projectData} onStateClick={handleStateClick} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Projects by State</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mapStateData.slice(0, 6).map((stateData, index) => (
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
                        <CardTitle>Practice Areas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {practiceAreaData.slice(0, 5).map((areaData, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <div>
                                <div className="font-medium">{areaData.area}</div>
                                <div className="text-sm text-muted-foreground">
                                  {areaData.count} project{areaData.count !== 1 ? "s" : ""}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">${(areaData.totalValue / 1000).toFixed(0)}K</div>
                                <div className="text-sm text-muted-foreground">
                                  ${(areaData.totalValue / areaData.count / 1000).toFixed(0)}K avg
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Project Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {statusData.map((statusItem, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <div>
                                <div className="font-medium">{statusItem.status}</div>
                                <div className="text-sm text-muted-foreground">
                                  {statusItem.count} project{statusItem.count !== 1 ? "s" : ""}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">${(statusItem.totalValue / 1000).toFixed(0)}K</div>
                                <div className="text-sm text-muted-foreground">
                                  ${(statusItem.totalValue / statusItem.count / 1000).toFixed(0)}K avg
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {studioData.length > 1 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Studio Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {studioData.map((studioItem, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <div>
                                <div className="font-medium">{studioItem.studio}</div>
                                <div className="text-sm text-muted-foreground">
                                  {studioItem.count} project{studioItem.count !== 1 ? "s" : ""}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">${(studioItem.totalValue / 1000).toFixed(0)}K</div>
                                <div className="text-sm text-muted-foreground">
                                  ${(studioItem.totalValue / studioItem.count / 1000).toFixed(0)}K avg
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
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
                        ${(totalValue / (processedData.length || 1) / 1000).toFixed(0)}K
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
                                <p className="text-sm text-muted-foreground">Status: {data.projectStatus}</p>
                                <p className="text-lg font-bold text-primary">${data.totalFee.toLocaleString()}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="totalFee" radius={[4, 4, 0, 0]}>
                        {processedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.statusColor} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}

              {chartViewType === "monthly" && (
                <>
                  <div className="flex justify-end mb-2">
                    <Button variant="outline" size="sm" onClick={() => setShowMonthlyExpenses(!showMonthlyExpenses)}>
                      {showMonthlyExpenses ? "Hide" : "Show"} Expenses
                    </Button>
                  </div>
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Monthly Revenue",
                        color: "hsl(var(--chart-3))",
                      },
                      expense: {
                        label: "Monthly Expense",
                        color: "hsl(var(--chart-5))",
                      },
                    }}
                    className="h-[500px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={combinedMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                                  <p className="text-lg font-bold text-primary">
                                    Revenue: ${data.revenue.toLocaleString()}
                                  </p>
                                  {showMonthlyExpenses && (
                                    <p className="text-lg font-bold text-red-500">
                                      Expense: ${data.expense.toLocaleString()}
                                    </p>
                                  )}
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
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--color-revenue)"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                        {showMonthlyExpenses && (
                          <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="var(--color-expense)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 3 }}
                          />
                        )}
                        <Brush dataKey="month" height={30} stroke="hsl(var(--chart-3))" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </>
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

              {chartViewType === "timeline" && (
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
                    <BarChart
                      data={processedData.sort(
                        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
                      )}
                      margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="startDate"
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
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
                                <p className="text-sm text-muted-foreground">Status: {data.projectStatus}</p>
                                <p className="text-lg font-bold text-primary">${data.totalFee.toLocaleString()}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="totalFee" radius={[4, 4, 0, 0]}>
                        {processedData
                          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                          .map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.statusColor} />
                          ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}

              {(chartViewType === "projects" || chartViewType === "timeline") && (
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>Not Started</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Completed</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectData.length}</div>
                <p className="text-xs text-muted-foreground">Active projects in pipeline</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contract Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(projectData.reduce((sum, p) => sum + p.totalFee, 0) / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">Combined project value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Project Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(projectData.reduce((sum, p) => sum + p.totalFee, 0) / projectData.length / 1000).toFixed(0)}K
                </div>
                <p className="text-xs text-muted-foreground">Mean contract value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">States Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(projectData.map((p) => p.state)).size}</div>
                <p className="text-xs text-muted-foreground">Geographic reach</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Projections Summary</CardTitle>
                <CardDescription>Key financial metrics for 2025-2030</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessProjections.map((proj) => (
                    <div key={proj.year} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{proj.year}</div>
                        <div className="text-sm text-muted-foreground">{proj.fte} FTE</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${(proj.contractRevenue / 1000000).toFixed(1)}M</div>
                        <div className="text-sm text-muted-foreground">{proj.profitMargin.toFixed(1)}% margin</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Distribution</CardTitle>
                <CardDescription>Breakdown by practice area and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">By Practice Area</h4>
                    <div className="space-y-2">
                      {practiceAreaData.slice(0, 3).map((area, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{area.area}</span>
                          <div className="text-right">
                            <span className="font-medium">{area.count} projects</span>
                            <div className="text-xs text-muted-foreground">${(area.totalValue / 1000).toFixed(0)}K</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">By Status</h4>
                    <div className="space-y-2">
                      {statusData.map((status, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{status.status}</span>
                          <div className="text-right">
                            <span className="font-medium">{status.count} projects</span>
                            <div className="text-xs text-muted-foreground">
                              ${(status.totalValue / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Projects by state with total values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {mapStateData.map((stateData, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{stateCoordinates[stateData.state]?.name || stateData.state}</div>
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
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium">FTE:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={customFTE}
                onChange={(e) => setCustomFTE(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Expense Breakdown - {selectedYear}</CardTitle>
                <CardDescription>{customFTE} FTE Configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    amount: {
                      label: "Amount",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={expenseBreakdown}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} fontSize={12} />
                      <YAxis type="category" dataKey="category" fontSize={10} width={90} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{data.category}</p>
                                <p className="text-lg font-bold text-primary">${data.amount.toLocaleString()}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
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
              <CardContent className="space-y-6 max-h-[400px] overflow-y-auto">
                {/* Personnel Costs */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Personnel Costs</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Average Salary</label>
                    <input
                      type="number"
                      value={expenseParams.avgSalary}
                      onChange={(e) => updateExpenseParam("avgSalary", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Healthcare per Employee</label>
                    <input
                      type="number"
                      value={expenseParams.healthcarePerEmployee}
                      onChange={(e) => updateExpenseParam("healthcarePerEmployee", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Payroll Tax Rate</label>
                    <input
                      type="number"
                      step="0.001"
                      value={expenseParams.payrollTaxRate}
                      onChange={(e) => updateExpenseParam("payrollTaxRate", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">401k Match Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      value={expenseParams.retirement401kRate}
                      onChange={(e) => updateExpenseParam("retirement401kRate", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>

                {/* Office & Facilities */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Office & Facilities</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Office Rent (Monthly)</label>
                    <input
                      type="number"
                      value={expenseParams.officeRentPerMonth}
                      onChange={(e) => updateExpenseParam("officeRentPerMonth", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Utilities (Monthly)</label>
                    <input
                      type="number"
                      value={expenseParams.utilitiesPerMonth}
                      onChange={(e) => updateExpenseParam("utilitiesPerMonth", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Internet/Phone (Monthly)</label>
                    <input
                      type="number"
                      value={expenseParams.internetPhonePerMonth}
                      onChange={(e) => updateExpenseParam("internetPhonePerMonth", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>

                {/* Technology */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Technology</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Laptop per Employee</label>
                    <input
                      type="number"
                      value={expenseParams.laptopPerEmployee}
                      onChange={(e) => updateExpenseParam("laptopPerEmployee", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Software per Employee</label>
                    <input
                      type="number"
                      value={expenseParams.softwareLicensesPerEmployee}
                      onChange={(e) => updateExpenseParam("softwareLicensesPerEmployee", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">IT Support per Employee</label>
                    <input
                      type="number"
                      value={expenseParams.itSupportPerEmployee}
                      onChange={(e) => updateExpenseParam("itSupportPerEmployee", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>

                {/* Professional Services */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Professional Services</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Accounting (Annual)</label>
                    <input
                      type="number"
                      value={expenseParams.accountingAnnual}
                      onChange={(e) => updateExpenseParam("accountingAnnual", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Legal (Annual)</label>
                    <input
                      type="number"
                      value={expenseParams.legalAnnual}
                      onChange={(e) => updateExpenseParam("legalAnnual", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Insurance (Annual)</label>
                    <input
                      type="number"
                      value={expenseParams.insuranceAnnual}
                      onChange={(e) => updateExpenseParam("insuranceAnnual", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>

                {/* Business Development */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Business Development</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Marketing (Annual)</label>
                    <input
                      type="number"
                      value={expenseParams.marketingAnnual}
                      onChange={(e) => updateExpenseParam("marketingAnnual", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Travel per Employee</label>
                    <input
                      type="number"
                      value={expenseParams.travelPerEmployee}
                      onChange={(e) => updateExpenseParam("travelPerEmployee", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Training per Employee</label>
                    <input
                      type="number"
                      value={expenseParams.conferencesTrainingPerEmployee}
                      onChange={(e) => updateExpenseParam("conferencesTrainingPerEmployee", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>

                {/* Financing */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Financing</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Loan Amount</label>
                    <input
                      type="number"
                      value={expenseParams.loanAmount}
                      onChange={(e) => updateExpenseParam("loanAmount", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Interest Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      value={expenseParams.loanInterestRate}
                      onChange={(e) => updateExpenseParam("loanInterestRate", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Term (Years)</label>
                    <input
                      type="number"
                      value={expenseParams.loanTermYears}
                      onChange={(e) => updateExpenseParam("loanTermYears", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>

                {/* Other */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-1">Other</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Inflation Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      value={expenseParams.inflationRate}
                      onChange={(e) => updateExpenseParam("inflationRate", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>

                <Button variant="outline" onClick={() => setExpenseParams(defaultExpenseParams)} className="w-full">
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Projections</CardTitle>
                <CardDescription>Contract revenue growth from 2025-2030</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    contractRevenue: {
                      label: "Contract Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                    billableRevenue: {
                      label: "Billable Revenue",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={businessProjections} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" fontSize={12} />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} fontSize={12} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{data.year}</p>
                                <p className="text-sm text-blue-500">
                                  Contract Revenue: ${data.contractRevenue.toLocaleString()}
                                </p>
                                <p className="text-sm text-green-500">
                                  Billable Revenue: ${data.billableRevenue.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">FTE: {data.fte}</p>
                                <p className="text-xs text-muted-foreground">
                                  Profit Margin: {data.profitMargin.toFixed(1)}%
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Bar dataKey="contractRevenue" fill="var(--color-contractRevenue)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="billableRevenue" fill="var(--color-billableRevenue)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Margins</CardTitle>
                <CardDescription>Net income and profit margin trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    netIncome: {
                      label: "Net Income",
                      color: "hsl(var(--chart-3))",
                    },
                    profitMargin: {
                      label: "Profit Margin %",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={businessProjections} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" fontSize={12} />
                      <YAxis
                        yAxisId="left"
                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                        fontSize={12}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(value) => `${value.toFixed(0)}%`}
                        fontSize={12}
                      />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{data.year}</p>
                                <p className="text-sm text-green-500">Net Income: ${data.netIncome.toLocaleString()}</p>
                                <p className="text-sm text-blue-500">Profit Margin: {data.profitMargin.toFixed(1)}%</p>
                                <p className="text-xs text-muted-foreground">
                                  Revenue: ${data.contractRevenue.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Expenses: ${data.totalExpenses.toLocaleString()}
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="netIncome" fill="var(--color-netIncome)" radius={[4, 4, 0, 0]} />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="profitMargin"
                        stroke="var(--color-profitMargin)"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown by Year</CardTitle>
              <CardDescription>Detailed financial projections with key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Year</th>
                      <th className="text-left p-2">FTE</th>
                      <th className="text-left p-2">Contract Revenue</th>
                      <th className="text-left p-2">Billable Revenue</th>
                      <th className="text-left p-2">Total Expenses</th>
                      <th className="text-left p-2">Net Income</th>
                      <th className="text-left p-2">Profit Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessProjections.map((proj) => (
                      <tr key={proj.year} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{proj.year}</td>
                        <td className="p-2">{proj.fte}</td>
                        <td className="p-2">${proj.contractRevenue.toLocaleString()}</td>
                        <td className="p-2">${proj.billableRevenue.toLocaleString()}</td>
                        <td className="p-2">${proj.totalExpenses.toLocaleString()}</td>
                        <td className="p-2 font-medium text-green-600">${proj.netIncome.toLocaleString()}</td>
                        <td className="p-2">{proj.profitMargin.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Projections</CardTitle>
              <CardDescription>
                Projected cash flow from {projectionYears[0]} to {projectionYears[projectionYears.length - 1]}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm font-medium">Starting Cash:</label>
                <input
                  type="number"
                  value={startingCash}
                  onChange={(e) => setStartingCash(Number(e.target.value))}
                  className="w-32 px-2 py-1 border rounded text-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div>
                  <div className="font-semibold">Starting Cash</div>
                  <div className="text-2xl font-bold text-primary">${(startingCash / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="font-semibold">Total Net Income</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${(cashFlowProjections.reduce((sum, p) => sum + p.netIncome, 0) / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Lowest Cash Point</div>
                  <div className="text-2xl font-bold text-red-600">
                    ${(Math.min(...cashFlowProjections.map((p) => p.cumulativeCash)) / 1000).toFixed(0)}K
                  </div>
                </div>
                <div>
                  <div className="font-semibold">
                    Ending Cash ({cashFlowProjections[cashFlowProjections.length - 1].year})
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${(cashFlowProjections[cashFlowProjections.length - 1].cumulativeCash / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>

              <ChartContainer
                config={{
                  cumulativeCash: {
                    label: "Cumulative Cash",
                    color: "hsl(var(--chart-1))",
                  },
                  netIncome: {
                    label: "Net Income",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowProjections} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" fontSize={12} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} fontSize={12} />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.year}</p>
                              <p className="text-sm text-blue-500">
                                Cumulative Cash: ${data.cumulativeCash.toLocaleString()}
                              </p>
                              <p className="text-sm text-green-500">Net Income: ${data.netIncome.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">
                                Revenue: ${data.contractRevenue.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Expenses: ${data.totalExpenses.toLocaleString()}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cumulativeCash"
                      stroke="var(--color-cumulativeCash)"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="netIncome"
                      stroke="var(--color-netIncome)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
