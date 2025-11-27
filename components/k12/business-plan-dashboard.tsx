"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useMemo, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, MapPin, ChevronsUpDown, ChevronDown, MoreHorizontal, FileDown, Settings2 } from "lucide-react"
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
  PieChart,
  Pie,
  Tooltip,
  LabelList,
  ComposedChart,
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import * as d3 from 'd3'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { Input } from "@/components/ui/input"
import { cleanFee, parseCSV, aggregateProjectData, calculateMonthlyRevenue, getQuarter } from "@/lib/data-processing"
import { calculateExpenses, calculateRevenue, getFTE, updateExpenseParam, defaultExpenseParams } from "@/lib/financial-calculations"
import { handleExportCurrentTabPDF, handleExportAllTabsPDF } from "@/lib/pdf-export"
import { handleFileUpload, getQuarterStatus, filterProjects } from "@/lib/project-management"
import { StateMap } from "@/components/state-map"
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown"

// Set Mapbox access token
// d3.select("svg").attr("width", "100%").attr("height", "100%")

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

export default function BusinessPlanDashboard() {
  const router = useRouter()

  // Tab access control (must be first in function)
  const allTabs = [
    { key: 'business-plan', label: 'Business Plan' },
    { key: 'project-performance', label: 'Project Performance' },
    { key: 'financial', label: 'Financial Projections' },
    { key: 'strategy', label: 'Go To Market' },
  ]
  const allowedTabs = allTabs.map((tab) => tab.key)
  const ADMIN_PASSWORD = '12'
  const [userAccess, setUserAccess] = useState<{ [pw: string]: string[] }>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dashboardUserAccess')
      if (stored) return JSON.parse(stored)
    }
    return { [ADMIN_PASSWORD]: allTabs.map(t => t.key) }
  })
  const isAdmin = true

  // Add state for summary section collapse (must be before any early returns)
  const [summaryOpen, setSummaryOpen] = useState(true)

  const [mainTab, setMainTab] = useState<'business-plan' | 'financial' | 'strategy' | 'project-performance'>('business-plan')
  const [viewType, setViewType] = useState<'charts' | 'expenses' | 'revenue' | 'cashflow' | 'overview'>('expenses')
  const [strategyTab, setStrategyTab] = useState<'case' | 'proscons'>('case')
  const [selectedYear, setSelectedYear] = useState(2026)
  const [customFTE, setCustomFTE] = useState(3) // Manual FTE override
  const [expenseParams, setExpenseParams] = useState(defaultExpenseParams)
  const [csvData, setCsvData] = useState<any[]>([])
  const [isUsingCsvData, setIsUsingCsvData] = useState(false)
  const [showMonthlyExpenses, setShowMonthlyExpenses] = useState(false)
  const [startingCash, setStartingCash] = useState(300000)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Original chart states
  const [sortBy, setSortBy] = useState<"fee" | "date" | "name">("fee")
  const [sortReverse, setSortReverse] = useState(false)
  const [filterState, setFilterState] = useState<string[]>(["all"])
  const [filterPracticeArea, setFilterPracticeArea] = useState<string[]>(["all"])
  const [filterStatus, setFilterStatus] = useState<string[]>(["all"])
  const [chartViewType, setChartViewType] = useState<"projects" | "monthly" | "quarterly" | "map">("projects")

  // Add state for CAGR
  const [cagr, setCagr] = useState(0.20)

  // Add state for FTE mode, manual FTEs, and FTE growth rate
  const [fteMode, setFteMode] = useState<'manual' | 'growth'>('manual')
  const [manualFTEs, setManualFTEs] = useState<{ [year: number]: number }>({
    2026: 2, // Increased from 1 to make expenses higher
    2027: 2,
    2028: 3,
    2029: 3,
    2030: 3,
    2031: 3,
  })
  const [fteBase, setFteBase] = useState(1)
  const [fteGrowth, setFteGrowth] = useState(0.05)

  // Manual revenue input state
  const [useManualRevenue, setUseManualRevenue] = useState(true)
  const [manualRevenue, setManualRevenue] = useState<{ [year: number]: number }>({
    2026: 460000,
    2027: 950000,
    2028: 2270000,
    2029: 4420000,
    2030: Math.round(4420000 * 1.25), // 5,525,000
    2031: Math.round(4420000 * 1.25 * 1.25), // 6,906,250
  })
  const [manualRevenueGrowthRate, setManualRevenueGrowthRate] = useState(0.25)
  const [manualRevenueGrowthStartYear, setManualRevenueGrowthStartYear] = useState(2030)
  const [useQuarterlyBreakdown, setUseQuarterlyBreakdown] = useState(false)
  const [quarterlyRevenue2026, setQuarterlyRevenue2026] = useState({
    Q1: 0,
    Q2: 100000,
    Q3: 150000,
    Q4: 210000,
  })

  // Add state for collapsible expense groups
  const [expenseGroupsCollapsed, setExpenseGroupsCollapsed] = useState<{ [key: string]: boolean }>({
    personnel: true,
    office: true,
    technology: true,
    professional: true,
    business: true,
    financing: true,
    other: true,
  })

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

    if (!filterState.includes("all")) {
      filtered = filtered.filter((p) => filterState.includes(p.state))
    }

    if (!filterPracticeArea.includes("all")) {
      filtered = filtered.filter((p) => filterPracticeArea.includes(p.practiceArea || ""))
    }

    if (!filterStatus.includes("all")) {
      filtered = filtered.filter((p) => filterStatus.includes(p.status || ""))
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

      // Ensure project.name is always a string
      const projectName = project.name || project.Project_Name || project.detail_Name || "Unknown Project"

      // Get quarter with year for dateAwarded
      let quarterWithYear = ""
      if (project.dateAwarded) {
        const date = new Date(project.dateAwarded)
        const year = date.getFullYear()
        const quarter = getQuarter(project.dateAwarded)
        quarterWithYear = `${quarter} ${year}`
      }

      // Create label with quarter when sorting by date
      let displayLabel = projectName.length > 25 ? projectName.substring(0, 25) + "..." : projectName
      if (sortBy === "date" && quarterWithYear) {
        const maxLength = 20
        const truncatedName = displayLabel.length > maxLength ? displayLabel.substring(0, maxLength) + "..." : displayLabel
        displayLabel = `${truncatedName} (${quarterWithYear})`
      }

      return {
        ...project,
        name: projectName, // Ensure name is always set
        shortName: displayLabel,
        feeFormatted: `$${(project.totalFee / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`,
        projectStatus,
        statusColor,
        quarterWithYear,
        hasStarted: startDate <= today,
        isCompleted: endDate <= today,
      }
    })
  }, [sortBy, sortReverse, filterState, filterPracticeArea, filterStatus, projectData])

  const totalValue = useMemo(() => {
    return processedData.reduce((sum, project) => sum + (Number(project.totalFee) || 0), 0)
  }, [processedData])

  const monthlyRevenueData = useMemo(() => {
    return calculateMonthlyRevenue(processedData)
  }, [processedData])

  const quarterlyData = useMemo(() => {
    const quarterMap = new Map<string, { quarter: string; value: number; projects: string[] }>()

    processedData.forEach((project) => {
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
  }, [processedData])

  const growthTrendData = useMemo(() => {
    const sortedProjects = [...processedData]
      .filter((p) => p.dateAwarded)
      .sort((a, b) => new Date(a.dateAwarded).getTime() - new Date(b.dateAwarded).getTime())

    const cumulativeData: any[] = []
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

    if (cumulativeData.length >= 1) {
      const lastYear = cumulativeData[cumulativeData.length - 1]
      const currentYear = Number.parseInt(lastYear.year)
      for (let year = currentYear + 1; year <= 2031; year++) {
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
  }, [processedData, cagr, projectData])

  // Map data for state summary
  const mapStateData = useMemo(() => {
    const stateMap = new Map()
    processedData.forEach((project) => {
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
  }, [processedData])

  // Practice area data
  const practiceAreaData = useMemo(() => {
    const areaMap = new Map()
    processedData.forEach((project) => {
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
  }, [processedData])

  // Status breakdown data
  const statusData = useMemo(() => {
    const statusMap = new Map()
    processedData.forEach((project) => {
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
  }, [processedData])

  // Studio breakdown data
  const studioData = useMemo(() => {
    const studioMap = new Map()
    processedData.forEach((project) => {
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
  }, [processedData])

  // Expense calculations with dynamic parameters
  const calculateExpenses = (fte: number, year: number) => {
    // Validate inputs
    const validFte = Math.max(1, Number(fte) || 1)
    const validYear = Number(year) || 2026

    const baseYear = 2026
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
      freelance: expenseParams.freelanceAnnual * inflationMultiplier,
    }
  }

  // Revenue projections based on actual contract data or manual input
  const calculateRevenue = (year: number) => {
    // If manual revenue is enabled, use the manually entered values
    if (useManualRevenue) {
      return manualRevenue[year] || 0
    }
    
    // Otherwise, calculate based on project data
    // Get all projects that are active during this year
    const activeProjects = projectData.filter(project => {
      if (!project.startDate || !project.endDate || !project.totalFee) return false
      
      const startYear = new Date(project.startDate).getFullYear()
      const endYear = new Date(project.endDate).getFullYear()
      
      // Project is active if the year falls within the contract period
      return year >= startYear && year <= endYear
    })
    
    // Calculate revenue for each project in this year
    let totalRevenue = 0
    activeProjects.forEach(project => {
      const startYear = new Date(project.startDate).getFullYear()
      const endYear = new Date(project.endDate).getFullYear()
      const contractLength = endYear - startYear + 1 // +1 because both start and end year count
      
      // Revenue for this year = contract value / contract length
      const yearlyRevenue = project.totalFee / contractLength
      totalRevenue += yearlyRevenue
    })
    
    return totalRevenue
  }

  const projectionYears = [2026, 2027, 2028, 2029, 2030, 2031]

  // Helper to get FTE for a year
  const getFTE = (year: number) => {
    if (fteMode === 'manual') {
      return manualFTEs[year] || 1
    } else {
      // Growth mode: FTE = base * (1 + growth)^(year - 2026)
      return Math.round(fteBase * Math.pow(1 + fteGrowth, year - 2026))
    }
  }

  // In businessProjections, use getFTE(year) instead of hardcoded FTEs
  const businessProjections = useMemo(() => {
    return projectionYears.map((year) => {
      const fteForYear = getFTE(year)
      const expenses = calculateExpenses(fteForYear, year)
      const contractRevenue = calculateRevenue(year)
      const totalExpenses = Object.values(expenses).reduce((sum, val) => (typeof val === "number" ? sum + val : sum), 0)
      const netIncome = contractRevenue - totalExpenses
      const profitMargin = (netIncome / contractRevenue) * 100
      return {
        year,
        fte: fteForYear,
        contractRevenue,
        totalExpenses,
        netIncome,
        profitMargin,
        expenses,
      }
    })
  }, [expenseParams, fteMode, manualFTEs, fteBase, fteGrowth, projectData, useManualRevenue, manualRevenue])

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
        amount: expenses.accounting + expenses.legal + expenses.insurance + expenses.freelance,
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
    monthlyRevenueData.forEach((item: { month: string; [key: string]: any }) => {
      combined.set(item.month, { ...item, expense: 0 })
    })
    monthlyExpensesData.forEach((item: { month: string; [key: string]: any }) => {
      if (combined.has(item.month)) {
        combined.get(item.month).expense = item.expense
      } else {
        combined.set(item.month, { month: item.month, revenue: 0, expense: item.expense, projects: [] })
      }
    })
    return Array.from(combined.values()).sort((a, b) => a.month.localeCompare(b.month))
  }, [monthlyRevenueData, monthlyExpensesData])

  // Refactored cash flow projections to show revenue, expenses, cash amount, and cumulative cash
  const cashFlowProjections = useMemo(() => {
    let cumulativeCash = startingCash
    return businessProjections.map((proj) => {
      const revenue = proj.contractRevenue
      const expenses = proj.totalExpenses
      const cashAmount = revenue - expenses
      cumulativeCash += cashAmount
      return {
        ...proj,
        revenue,
        expenses,
        cashAmount,
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
        console.log('Parsed CSV data:', parsedData)
        
        // Check if we got valid data
        if (parsedData && parsedData.length > 0) {
          setCsvData(parsedData)
          setIsUsingCsvData(true)
          console.log('CSV data loaded successfully:', parsedData.length, 'projects')
        } else {
          console.warn('CSV parsing returned empty data, falling back to default')
          setCsvData([])
          setIsUsingCsvData(false)
          alert("CSV file appears to be empty or invalid. Using default data instead.")
        }
      } catch (error) {
        console.error("Error parsing CSV:", error)
        setCsvData([])
        setIsUsingCsvData(false)
        alert("Error parsing CSV file. Using default data instead.")
      }
    }
    reader.readAsText(file)
  }

  const resetToDefaultData = () => {
    setCsvData([])
    setIsUsingCsvData(false)
    console.log('Reset to default data')
  }

  // Load local CSV file on component mount
  useEffect(() => {
    const loadLocalCSV = async () => {
      try {
        const response = await fetch('/api/projectlist')
        if (!response.ok) {
          console.warn('Could not load local CSV file, using default data')
          return
        }
        const csvText = await response.text()
        const parsedData = parseCSV(csvText)
        
        if (parsedData && parsedData.length > 0) {
          setCsvData(parsedData)
          setIsUsingCsvData(true)
          console.log('Local CSV data loaded successfully:', parsedData.length, 'projects')
        } else {
          console.warn('Local CSV parsing returned empty data, falling back to default')
        }
      } catch (error) {
        console.error("Error loading local CSV file:", error)
        // Silently fall back to default data
      }
    }

    loadLocalCSV()
  }, [])

  const handleStateClick = (state: string) => {
    setFilterState([state])
    setChartViewType("projects")
  }

  // Admin panel for managing user access
  const [newUserPw, setNewUserPw] = useState('')
  const [newUserTabs, setNewUserTabs] = useState<string[]>([])
  const handleAddUser = () => {
    if (!newUserPw.trim() || newUserTabs.length === 0) return
    setUserAccess(prev => {
      const updated = { ...prev, [newUserPw]: newUserTabs }
      localStorage.setItem('dashboardUserAccess', JSON.stringify(updated))
      return updated
    })
    setNewUserPw('')
    setNewUserTabs([])
  }
  const handleRemoveUser = (pw: string) => {
    if (pw === '12') return
    setUserAccess(prev => {
      const updated = { ...prev }
      delete updated[pw]
      localStorage.setItem('dashboardUserAccess', JSON.stringify(updated))
      return updated
    })
  }

  // Place this after all useState/useMemo/useEffect hooks, but before any logic/returns
  const yearlyExpenseBreakdown = useMemo(() => {
    return projectionYears.map(year => {
      const fte = getFTE(year)
      const expenses = calculateExpenses(fte, year)
      // Match the Expense Parameters UI groups
      const breakdown = [
        { category: "Personnel Costs", amount: expenses.salaries + expenses.healthcare + expenses.payrollTaxes + expenses.unemploymentTax + expenses.workersComp + expenses.retirement },
        { category: "Office & Facilities", amount: expenses.officeRent + expenses.utilities + expenses.internetPhone },
        { category: "Technology", amount: expenses.equipment + expenses.software + expenses.itSupport },
        { category: "Professional Services", amount: expenses.accounting + expenses.legal + expenses.insurance + expenses.freelance },
        { category: "Business Development", amount: expenses.marketing + expenses.travel + expenses.training },
        { category: "Financing", amount: expenses.loanPayment },
        { category: "Other", amount: expenses.officeSupplies + expenses.miscellaneous },
      ]
      const row: { [key: string]: string | number } = { year: year.toString() }
      breakdown.forEach(item => {
        row[item.category] = item.amount
      })
      // Add total for labels
      const total = breakdown.reduce((sum, item) => sum + item.amount, 0)
      row.total = total
      return row
    })
  }, [projectionYears, fteMode, manualFTEs, fteBase, fteGrowth, expenseParams])

  // Place this here:
  const getQuarterStatus = (projects: string[]) => {
    if (!projects || projects.length === 0) return 'no-value'
    // Find the status of the majority of projects in this quarter
    const statusCounts: Record<string, number> = {}
    projects.forEach(name => {
      const project = processedData.find(p => p.name === name)
      const status = project?.status?.toLowerCase() || 'active'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
    const maxStatus = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'active'
    if (maxStatus.includes('await')) return 'awaiting'
    if (maxStatus.includes('active')) return 'active'
    return 'no-value'
  }

  // Build a list of all quarters and an 'Unspecified' bucket
  const allQuarters = Array.from(new Set(
    processedData
      .filter(p => p.dateAwarded)
      .map(p => getQuarter(p.dateAwarded))
  )).sort();

  let quarterlyStatusData = allQuarters.map(quarter => {
    const projectsInQuarter = processedData.filter(p => getQuarter(p.dateAwarded) === quarter);
    return {
      quarter,
      active: projectsInQuarter.filter(p => p.status?.toLowerCase().includes('active')).reduce((sum, p) => sum + p.totalFee, 0),
      awaiting: projectsInQuarter.filter(p => p.status?.toLowerCase().includes('await')).reduce((sum, p) => sum + p.totalFee, 0),
      completed: projectsInQuarter.filter(p => p.status?.toLowerCase().includes('completed')).reduce((sum, p) => sum + p.totalFee, 0),
      unspecified: projectsInQuarter.filter(p => !p.status || (!p.status.toLowerCase().includes('active') && !p.status.toLowerCase().includes('await') && !p.status.toLowerCase().includes('completed'))).reduce((sum, p) => sum + p.totalFee, 0),
    }
  });

  // Add a bar for projects with no date/quarter
  const unspecifiedProjects = processedData.filter(p => !p.dateAwarded);
  if (unspecifiedProjects.length > 0) {
    quarterlyStatusData.push({
      quarter: 'Unspecified',
      active: unspecifiedProjects.filter(p => p.status?.toLowerCase().includes('active')).reduce((sum, p) => sum + p.totalFee, 0),
      awaiting: unspecifiedProjects.filter(p => p.status?.toLowerCase().includes('await')).reduce((sum, p) => sum + p.totalFee, 0),
      completed: unspecifiedProjects.filter(p => p.status?.toLowerCase().includes('completed')).reduce((sum, p) => sum + p.totalFee, 0),
      unspecified: unspecifiedProjects.filter(p => !p.status || (!p.status.toLowerCase().includes('active') && !p.status.toLowerCase().includes('await') && !p.status.toLowerCase().includes('completed'))).reduce((sum, p) => sum + p.totalFee, 0),
    });
  }

  // Sort quarterlyStatusData: chronological by year and quarter, 'Unspecified' always last
  quarterlyStatusData = quarterlyStatusData.sort((a, b) => {
    if (a.quarter === 'Unspecified') return 1;
    if (b.quarter === 'Unspecified') return -1;
    // Parse year and quarter
    const [aQ, aYear] = a.quarter.split(' ');
    const [bQ, bYear] = b.quarter.split(' ');
    const aYearNum = parseInt(aYear);
    const bYearNum = parseInt(bYear);
    const aQuarterNum = parseInt(aQ.replace('Q', ''));
    const bQuarterNum = parseInt(bQ.replace('Q', ''));
    if (aYearNum !== bYearNum) return aYearNum - bYearNum;
    return aQuarterNum - bQuarterNum;
  });

  // Before the return statement in BusinessPlanDashboard
  const personnelExpenses1FTE = calculateExpenses(1, selectedYear)
  const personnelSubtotal = personnelExpenses1FTE.salaries + personnelExpenses1FTE.healthcare + personnelExpenses1FTE.payrollTaxes + personnelExpenses1FTE.unemploymentTax + personnelExpenses1FTE.workersComp + personnelExpenses1FTE.retirement

  const officeSubtotal = expenseParams.officeRentPerMonth * 12 + expenseParams.utilitiesPerMonth * 12 + expenseParams.internetPhonePerMonth * 12
  const techSubtotal = expenseParams.laptopPerEmployee + expenseParams.softwareLicensesPerEmployee + expenseParams.itSupportPerEmployee
  const profSubtotal = expenseParams.freelanceAnnual + expenseParams.accountingAnnual + expenseParams.legalAnnual + expenseParams.insuranceAnnual
  const bizSubtotal = expenseParams.marketingAnnual + expenseParams.travelPerEmployee + expenseParams.conferencesTrainingPerEmployee
  const financeSubtotal = expenseParams.loanAmount > 0 ? (expenseParams.loanAmount * expenseParams.loanInterestRate / 12) * Math.pow(1 + expenseParams.loanInterestRate / 12, expenseParams.loanTermYears * 12) / (Math.pow(1 + expenseParams.loanInterestRate / 12, expenseParams.loanTermYears * 12) - 1) : 0
  const otherSubtotal = expenseParams.officeSuppliesPerEmployee * 12 + expenseParams.miscellaneousPerEmployee * 12

  const personnelHeader = (
    <button
      type="button"
      className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
      onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, personnel: !prev.personnel }))}
    >
      <span>Personnel Costs</span>
      <span className="ml-auto text-xs font-normal text-blue-900">${personnelSubtotal.toLocaleString()}</span>
      <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.personnel ? 'rotate-180' : ''}`} />
    </button>
  )
  const officeHeader = (
    <button
      type="button"
      className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
      onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, office: !prev.office }))}
    >
      <span>Office & Facilities</span>
      <span className="ml-auto text-xs font-normal text-blue-900">${officeSubtotal.toLocaleString()}</span>
      <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.office ? 'rotate-180' : ''}`} />
    </button>
  )
  const techHeader = (
    <button
      type="button"
      className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
      onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, technology: !prev.technology }))}
    >
      <span>Technology</span>
      <span className="ml-auto text-xs font-normal text-blue-900">${techSubtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.technology ? 'rotate-180' : ''}`} />
    </button>
  )
  const profHeader = (
    <button
      type="button"
      className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
      onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, professional: !prev.professional }))}
    >
      <span>Professional Services</span>
      <span className="ml-auto text-xs font-normal text-blue-900">${profSubtotal.toLocaleString()}</span>
      <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.professional ? 'rotate-180' : ''}`} />
    </button>
  )
  const bizHeader = (
    <button
      type="button"
      className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
      onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, business: !prev.business }))}
    >
      <span>Business Development</span>
      <span className="ml-auto text-xs font-normal text-blue-900">${bizSubtotal.toLocaleString()}</span>
      <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.business ? 'rotate-180' : ''}`} />
    </button>
  )
  const financeHeader = (
    <button
      type="button"
      className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
      onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, financing: !prev.financing }))}
    >
      <span>Financing</span>
      <span className="ml-auto text-xs font-normal text-blue-900">${financeSubtotal.toLocaleString()}</span>
      <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.financing ? 'rotate-180' : ''}`} />
    </button>
  )
  const otherHeader = (
    <button
      type="button"
      className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
      onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, other: !prev.other }))}
    >
      <span>Other</span>
      <span className="ml-auto text-xs font-normal text-blue-900">${otherSubtotal.toLocaleString()}</span>
      <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.other ? 'rotate-180' : ''}`} />
    </button>
  )

  // PDF export handler
  const handleExportCurrentTabPDF = async () => {
    const input = document.body // Or a more specific selector for your dashboard
    const pdf = new jsPDF({ unit: "mm", format: [297, 210] }) // A4 landscape
    const canvas = await html2canvas(input, { scale: 1.5, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' })
    const imgData = canvas.toDataURL("image/png")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgAspectRatio = canvas.width / canvas.height
    const pdfAspectRatio = pdfWidth / pdfHeight
    let imgWidth, imgHeight
    if (imgAspectRatio > pdfAspectRatio) {
      imgWidth = pdfWidth - 10 // 5mm margin each side
      imgHeight = imgWidth / imgAspectRatio
    } else {
      imgHeight = pdfHeight - 10
      imgWidth = imgHeight * imgAspectRatio
    }
    const x = (pdfWidth - imgWidth) / 2
    const y = (pdfHeight - imgHeight) / 2
    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
    pdf.save("dashboard.pdf")
  }

  const handleExportAllTabsPDF = async () => {
    const originalTab = mainTab
    const pdf = new jsPDF({ unit: "mm", format: [297, 210] }) // A4 landscape
    for (const tab of allTabs) {
      setMainTab(tab.key as 'business-plan' | 'strategy' | 'project-performance' | 'financial')
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for tab to render
      const input = document.body
      const canvas = await html2canvas(input, { scale: 1.5, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL("image/png")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgAspectRatio = canvas.width / canvas.height
      const pdfAspectRatio = pdfWidth / pdfHeight
      let imgWidth, imgHeight
      if (imgAspectRatio > pdfAspectRatio) {
        imgWidth = pdfWidth - 10
        imgHeight = imgWidth / imgAspectRatio
      } else {
        imgHeight = pdfHeight - 10
        imgWidth = imgHeight * imgAspectRatio
      }
      const x = (pdfWidth - imgWidth) / 2
      const y = (pdfHeight - imgHeight) / 2
      if (tab !== allTabs[0]) pdf.addPage()
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
    }
    setMainTab(originalTab)
    pdf.save("dashboard-all-tabs.pdf")
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pb-16">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      <Tabs
        value={mainTab}
        onValueChange={(value) => setMainTab(value as 'business-plan' | 'financial' | 'strategy' | 'project-performance')}
        className="h-full flex flex-col rounded-3xl border border-border bg-background shadow-sm"
      >
        <TabsList className="flex w-full mb-6 gap-1 items-center flex-wrap overflow-visible border-b border-border bg-muted/60 backdrop-blur-sm h-auto px-3 py-2 rounded-t-3xl">
          {/* Tab triggers */}
          {allTabs.filter(tab => allowedTabs.includes(tab.key)).map(tab => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className={`min-w-[120px] md:min-w-[140px] px-4 py-2 text-sm md:text-base rounded-full transition-colors duration-200 font-medium
                data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm
                data-[state=inactive]:text-muted-foreground hover:text-primary hover:bg-background/70
              `}
            >
              {tab.label}
            </TabsTrigger>
          ))}
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-transparent h-10 w-10 rounded-full"
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span className="sr-only">Open dashboard actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault()
                    fileInputRef.current?.click()
                  }}
                >
                  <Upload className="w-4 h-4" />
                  Upload CSV
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault()
                      router.push("/k12-strategy/admin")
                    }}
                  >
                    <Settings2 className="w-4 h-4" />
                    Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault()
                    handleExportCurrentTabPDF()
                  }}
                >
                  <FileDown className="w-4 h-4" />
                  Export current tab
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault()
                    handleExportAllTabsPDF()
                  }}
                >
                  <FileDown className="w-4 h-4" />
                  Export all tabs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TabsList>
        {allowedTabs.includes('business-plan') && (
        <TabsContent value="business-plan" className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col space-y-4">
            
            {/* Business Plan Content */}
            <div className="flex-1 bg-white rounded-lg border border-border overflow-hidden" style={{ minHeight: '600px' }}>
              <div className="h-full flex flex-col">
                {/* Document Header */}
                <div className="bg-gray-50 border-b border-border px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Business Plan Document</h3>
                      <p className="text-sm text-muted-foreground">K-12 Strategy Business Plan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isAdmin && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                        Edit Mode
                      </span>
                    )}
                    <a
                      href="https://1drv.ms/w/c/e25b0f41ee1d8f0f/EW1ysidp4bBNpRwEIMkE-uQBL0_xHXluhSM2hKa4rHnhTA?e=3RY3H3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open in Word
                    </a>
                  </div>
                </div>
                
                {/* Document Preview */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="max-w-4xl mx-auto">
                    <div className="prose prose-sm max-w-none">
                      <h1 className="text-2xl font-bold text-foreground mb-6">K-12 Strategy Business Plan</h1>
                      
                      <div className="space-y-6">
                        <section>
                          <h2 className="text-xl font-semibold text-foreground mb-3">Executive Summary</h2>
                          <p className="text-muted-foreground leading-relaxed">
                            This business plan outlines our strategy for expanding into the K-12 education sector, 
                            leveraging our expertise in public sector facilities consulting to address the growing 
                            infrastructure needs of school districts nationwide.
                          </p>
                        </section>
                        
                        <section>
                          <h2 className="text-xl font-semibold text-foreground mb-3">Market Opportunity</h2>
                          <p className="text-muted-foreground leading-relaxed">
                            The K-12 education market presents significant opportunities for growth, with school 
                            districts across the country facing aging infrastructure, capacity constraints, and 
                            evolving educational requirements that demand strategic facility planning and development.
                          </p>
                        </section>
                        
                        <section>
                          <h2 className="text-xl font-semibold text-foreground mb-3">Strategic Approach</h2>
                          <p className="text-muted-foreground leading-relaxed">
                            Our approach focuses on building long-term partnerships with school districts, 
                            providing comprehensive facility assessments, master planning, and project management 
                            services tailored to the unique needs of educational environments.
                          </p>
                        </section>
                        
                        <section>
                          <h2 className="text-xl font-semibold text-foreground mb-3">Financial Projections</h2>
                          <p className="text-muted-foreground leading-relaxed">
                            Based on our current pipeline and market analysis, we project significant revenue 
                            growth over the next 3-5 years, with the K-12 sector becoming a major contributor 
                            to our overall business portfolio.
                          </p>
                        </section>
                      </div>
                      
                      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm text-blue-800 font-medium mb-1">Full Document Available</p>
                            <p className="text-sm text-blue-700">
                              This is a preview of the business plan. For the complete document with detailed 
                              financial models, market analysis, and strategic recommendations, 
                              <a 
                                href="https://1drv.ms/w/c/e25b0f41ee1d8f0f/EW1ysidp4bBNpRwEIMkE-uQBL0_xHXluhSM2hKa4rHnhTA?e=3RY3H3" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-900 ml-1"
                              >
                                open the full document in Microsoft Word
                              </a>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        )}
        {allowedTabs.includes('strategy') && (
        <TabsContent value="strategy">
          <Tabs value={strategyTab} onValueChange={(value) => setStrategyTab(value as 'case' | 'proscons')} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-white border-b border-border h-14 min-h-[56px] px-0 mb-6 rounded-none">
              <TabsTrigger
                value="case"
                className="px-4 py-3 rounded-none font-medium h-12 flex items-center justify-center transition-all duration-200 border-b-2 border-transparent
                  data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent
                  data-[state=inactive]:text-muted-foreground hover:text-primary hover:bg-transparent"
              >
                A Case for...
              </TabsTrigger>
              <TabsTrigger
                value="proscons"
                className="px-4 py-3 rounded-none font-medium h-12 flex items-center justify-center transition-all duration-200 border-b-2 border-transparent
                  data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent
                  data-[state=inactive]:text-muted-foreground hover:text-primary hover:bg-transparent"
              >
                Business Model Comparison
              </TabsTrigger>
            </TabsList>
            <TabsContent value="case">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pros: ...Becoming Independent? */}
                  <div className="bg-white rounded-lg border border-border p-4">
                    <h3 className="text-base font-semibold mb-3 text-center border-b pb-2">...Becoming Independent</h3>
                    <div className="mb-2 font-semibold text-green-700">Pros:</div>
                    <div className="space-y-4 mb-4">
                      <div>
                        <div className="font-semibold">Full control over strategy</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>Set our own priorities</li>
                          <li>Make decisions quickly</li>
                          <li>Align directly with our mission</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold">Greater financial upside</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>Lower overhead</li>
                          <li>More competitive pricing</li>
                          <li>Full ownership of profit and equity growth</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold">Freedom to innovate</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>Explore new markets</li>
                          <li>Test bold ideas</li>
                          <li>Adapt quickly—without external constraints</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold">Increased flexibility</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>Use the systems, tools, and workflows that best fit our needs</li>
                          <li>No one-size-fits-all limitations</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold">Culture on our terms</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>Build a team based on our values</li>
                          <li>Shape a work environment that reflects who we are</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold">Ownership of brand and identity</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>Develop a reputation that's fully ours</li>
                          <li>Distinct in the market</li>
                          <li>Aligned with our vision</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* Cons: ...not Becoming Independent */}
                  <div className="bg-white rounded-lg border border-border p-4">
                    <h3 className="text-base font-semibold mb-3 text-center border-b pb-2">...not Becoming Independent</h3>
                    <div className="mb-2 font-semibold text-red-700">Cons:</div>
                    <div className="space-y-4">
                      <div>
                        <div className="font-semibold">Higher Financial Risk</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>Without shared resources or backing</li>
                          <li>We assume full responsibility for cash flow, payroll, and liabilities</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold">Need to Build Infrastructure</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>HR, IT, accounting, legal, insurance</li>
                          <li>All overhead functions must be set up, maintained, and funded internally or bought</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold">Resource Gaps at Launch</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>Limited access to specialized talent (e.g., sustainability, legal, architecture)</li>
                          <li>Unless we hire or contract independently</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold">Slower Ramp-Up Time</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>Establishing systems, hiring staff, and building brand recognition takes time and effort</li>
                          <li>Slowing early momentum</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold">Administrative Burden on Leadership</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>Time spent on operations may reduce focus on business development</li>
                          <li>Client relationships</li>
                          <li>Strategic growth</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold">No Safety Net</div>
                        <ul className="list-[circle] ml-6 space-y-0.5 text-sm">
                          <li>In lean periods or downturns</li>
                          <li>There's no parent organization to absorb the impact</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="proscons">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Affiliate Model */}
                  <div className="bg-white rounded-lg border border-border p-4">
                    <h3 className="text-base font-semibold mb-3 text-center border-b pb-2">Affiliate Model</h3>
                    <div className="mb-2 font-semibold text-green-700">Pros:</div>
                    <ul className="list-disc list-inside mb-4 text-sm space-y-1">
                      <li>Shared overhead expenses (HR, IT, Accounting)</li>
                      <li>Access to specialized expertise (e.g., Sustainability, Architecture)</li>
                      <li>Lower financial risk</li>
                    </ul>
                    <div className="mb-2 font-semibold text-red-700">Cons:</div>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Limited control over IT systems and infrastructure</li>
                      <li>Constrained decision-making authority</li>
                      <li>Lower share of financial upside/reward</li>
                    </ul>
                  </div>
                  {/* Independent Model */}
                  <div className="bg-white rounded-lg border border-border p-4">
                    <h3 className="text-base font-semibold mb-3 text-center border-b pb-2">Independent Model</h3>
                    <div className="mb-2 font-semibold text-green-700">Pros:</div>
                    <ul className="list-disc list-inside mb-4 text-sm space-y-1">
                      <li>Full control over business operations and strategy</li>
                      <li>Maximum flexibility in tools, systems, and staffing</li>
                      <li>Potential for higher financial rewards</li>
                    </ul>
                    <div className="mb-2 font-semibold text-red-700">Cons:</div>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Must build and manage all overhead functions (HR, IT, Accounting)</li>
                      <li>Greater financial risk and responsibility</li>
                      <li>Requires investment in building internal capacity from scratch</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        )}
        {allowedTabs.includes('project-performance') && (
        <TabsContent value="project-performance">
          <div className="flex-1 overflow-auto space-y-4">
                <div className="mb-2 flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 text-sm rounded bg-white text-foreground font-medium hover:bg-secondary transition border border-border"
                    onClick={() => setSummaryOpen(o => !o)}
                    aria-expanded={summaryOpen}
                    aria-controls="summary-cards"
                  >
                    {summaryOpen ? "Hide" : "Show"} Summary
                  </button>
                </div>
                <div
                  id="summary-cards"
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 transition-all duration-300 overflow-hidden ${summaryOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                  style={{ transitionProperty: 'max-height, opacity' }}
                >
                  {/* Total Projects Card */}
                  <Card className="w-full border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
                      <CardTitle className="text-sm font-medium text-foreground">Total Projects</CardTitle>
              </CardHeader>
                    <CardContent className="px-3 pb-3">
                <div className="text-xl font-semibold text-primary">{processedData.length}</div>
                <p className="text-xs text-muted-foreground">Active projects in pipeline</p>
                      {/* Sub-counts for Active, Awaiting, Unspecified, Completed */}
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Active:</span>
                          <span>{processedData.filter(p => p.status?.toLowerCase().includes('active')).length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-700">Awaiting:</span>
                          <span>{processedData.filter(p => p.status?.toLowerCase().includes('await')).length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Unspecified:</span>
                          <span>{processedData.filter(p => !p.status || (!p.status.toLowerCase().includes('active') && !p.status.toLowerCase().includes('await') && !p.status.toLowerCase().includes('completed'))).length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">Completed:</span>
                          <span>{processedData.filter(p => p.status?.toLowerCase().includes('completed')).length}</span>
                        </div>
                      </div>
              </CardContent>
            </Card>
                  {/* Total Contract Value Card */}
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
                      <CardTitle className="text-sm font-medium text-foreground">Total Contract Value</CardTitle>
              </CardHeader>
                    <CardContent className="px-3 pb-3">
                <div className="text-xl font-semibold text-green-600">
                  ${(processedData.reduce((sum, p) => sum + (p.totalFee || 0), 0) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}M
                </div>
                <p className="text-xs text-muted-foreground">
                  Combined project value ({processedData.filter(p => p.totalFee > 0).length} with fees)
                </p>
                      {/* Sub-data for Active, Awaiting, Unspecified, Completed */}
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Active:</span>
                          <span className="">${processedData.filter(p => p.status?.toLowerCase().includes('active')).reduce((sum, p) => sum + (p.totalFee || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-700">Awaiting:</span>
                          <span className="">${processedData.filter(p => p.status?.toLowerCase().includes('await')).reduce((sum, p) => sum + (p.totalFee || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">Unspecified:</span>
                          <span className="">${processedData.filter(p => !p.status || (!p.status.toLowerCase().includes('active') && !p.status.toLowerCase().includes('await') && !p.status.toLowerCase().includes('completed'))).reduce((sum, p) => sum + (p.totalFee || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">Completed:</span>
                          <span className="">${processedData.filter(p => p.status?.toLowerCase().includes('completed')).reduce((sum, p) => sum + (p.totalFee || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                      </div>
                <div className="text-xs text-gray-500 mt-1">
                  Raw total: ${processedData.reduce((sum, p) => sum + (p.totalFee || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </CardContent>
            </Card>
                  {/* Average Project Size Card */}
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
                      <CardTitle className="text-sm font-medium text-foreground">Average Project Size</CardTitle>
              </CardHeader>
                    <CardContent className="px-3 pb-3">
                <div className="text-xl font-semibold text-blue-600">
                  ${(processedData.reduce((sum, p) => sum + (p.totalFee || 0), 0) / (processedData.filter(p => p.totalFee > 0).length || 1) / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K
                </div>
                <p className="text-xs text-muted-foreground">Mean contract value (excluding $0 fees)</p>
                      {/* Sub-averages for Active, Awaiting, Unspecified, Completed */}
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Active:</span>
                          <span className="">${(processedData.filter(p => p.status?.toLowerCase().includes('active')).reduce((sum, p) => sum + (p.totalFee || 0), 0) / (processedData.filter(p => p.status?.toLowerCase().includes('active') && p.totalFee > 0).length || 1) / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-700">Awaiting:</span>
                          <span className="">${(processedData.filter(p => p.status?.toLowerCase().includes('await')).reduce((sum, p) => sum + (p.totalFee || 0), 0) / (processedData.filter(p => p.status?.toLowerCase().includes('await') && p.totalFee > 0).length || 1) / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">Unspecified:</span>
                          <span className="">${(processedData.filter(p => !p.status || (!p.status.toLowerCase().includes('active') && !p.status.toLowerCase().includes('await') && !p.status.toLowerCase().includes('completed'))).reduce((sum, p) => sum + (p.totalFee || 0), 0) / (processedData.filter(p => (!p.status || (!p.status.toLowerCase().includes('active') && !p.status.toLowerCase().includes('await') && !p.status.toLowerCase().includes('completed'))) && p.totalFee > 0).length || 1) / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">Completed:</span>
                          <span className="">${(processedData.filter(p => p.status?.toLowerCase().includes('completed')).reduce((sum, p) => sum + (p.totalFee || 0), 0) / (processedData.filter(p => p.status?.toLowerCase().includes('completed') && p.totalFee > 0).length || 1) / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K</span>
                        </div>
                      </div>
              </CardContent>
            </Card>
                  {/* States Covered Card */}
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
                      <CardTitle className="text-sm font-medium text-foreground">States Covered</CardTitle>
              </CardHeader>
                    <CardContent className="px-3 pb-3">
                <div className="text-xl font-semibold text-purple-600">
                  {new Set(processedData.filter(p => p.state && p.state.trim()).map((p) => p.state)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Geographic reach ({processedData.filter(p => !p.state || !p.state.trim()).length} unknown)
                </p>
                      {/* Sub-counts for Active, Awaiting, Unspecified, Completed */}
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Active:</span>
                          <span className="">{new Set(processedData.filter(p => p.status?.toLowerCase().includes('active') && p.state && p.state.trim()).map((p) => p.state)).size}</span>
          </div>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-700">Awaiting:</span>
                          <span className="">{new Set(processedData.filter(p => p.status?.toLowerCase().includes('await') && p.state && p.state.trim()).map((p) => p.state)).size}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">Unspecified:</span>
                          <span className="">{new Set(processedData.filter(p => (!p.status || (!p.status.toLowerCase().includes('active') && !p.status.toLowerCase().includes('await') && !p.status.toLowerCase().includes('completed'))) && p.state && p.state.trim()).map((p) => p.state)).size}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">Completed:</span>
                          <span className="">{new Set(processedData.filter(p => p.status?.toLowerCase().includes('completed') && p.state && p.state.trim()).map((p) => p.state)).size}</span>
                        </div>
                </div>
              </CardContent>
            </Card>
                </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
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
                    variant={chartViewType === "map" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartViewType("map")}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Map View
                  </Button>
                </div>
                </div>


            <Card className="w-full">
              <CardHeader></CardHeader>
              <CardContent className="px-2 md:px-4 py-2 md:py-4">
                {chartViewType === "map" && (
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-4">
                      <StateMap projects={processedData} onStateClick={handleStateClick} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="w-full">
                          
                          <CardContent className="px-3 pb-3">
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
                                    <div className="font-bold">${(stateData.totalValue / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K</div>
                                    <div className="text-sm text-muted-foreground">
                                      ${(stateData.totalValue / stateData.count / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K avg
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="w-full">
                          <CardHeader>
                            <CardTitle className="text-sm font-medium text-foreground">Practice Areas</CardTitle>
                          </CardHeader>
                          <CardContent className="px-3 pb-3">
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
                                    <div className="font-bold">${(areaData.totalValue / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K</div>
                                    <div className="text-sm text-muted-foreground">
                                      ${(areaData.totalValue / areaData.count / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K avg
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="w-full">
                          <CardHeader>
                            <CardTitle className="text-sm font-medium text-foreground">Project Status</CardTitle>
                          </CardHeader>
                          <CardContent className="px-3 pb-3">
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
                                    <div className="font-bold">${(statusItem.totalValue / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K</div>
                                    <div className="text-sm text-muted-foreground">
                                      ${(statusItem.totalValue / statusItem.count / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K avg
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {studioData.length > 1 && (
                        <Card className="w-full">
                          <CardHeader>
                            <CardTitle className="text-sm font-medium text-foreground">Studio Performance</CardTitle>
                          </CardHeader>
                          <CardContent className="px-3 pb-3">
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
                                    <div className="font-bold">${(studioItem.totalValue / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K</div>
                                    <div className="text-sm text-muted-foreground">
                                      ${(studioItem.totalValue / studioItem.count / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K avg
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <div className="w-[200px] space-y-2">
                      <MultiSelectDropdown
                        options={states}
                        selected={filterState}
                        onChange={setFilterState}
                        title="States"
                      />
                      <MultiSelectDropdown
                        options={practiceAreas}
                        selected={filterPracticeArea}
                        onChange={setFilterPracticeArea}
                        title="Areas"
                      />
                      <MultiSelectDropdown options={statuses} selected={filterStatus} onChange={setFilterStatus} title="Statuses" />
                    </div>
                  </div>
                )}


                {chartViewType === "projects" && (
                  <>
                    <div className="flex gap-2 mb-4">
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
                    <div className="flex gap-4">
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
                            <XAxis 
                              dataKey="shortName" 
                              angle={-45} 
                              textAnchor="end" 
                              height={120} 
                              fontSize={12}
                            />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`} fontSize={12} />
                            <ChartTooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload
                                  return (
                                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                                      <p className="font-semibold">{data.name}</p>
                                      {data.quarterWithYear && (
                                        <p className="text-sm font-medium text-primary">Quarter: {data.quarterWithYear}</p>
                                      )}
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
                      <div className="w-[200px] space-y-2">
                        <MultiSelectDropdown
                          options={states}
                          selected={filterState}
                          onChange={setFilterState}
                          title="States"
                        />
                        <MultiSelectDropdown
                          options={practiceAreas}
                          selected={filterPracticeArea}
                          onChange={setFilterPracticeArea}
                          title="Areas"
                        />
                        <MultiSelectDropdown options={statuses} selected={filterStatus} onChange={setFilterStatus} title="Statuses" />
                      </div>
                    </div>
                  </>
                )}

                {chartViewType === "monthly" && (
                  <div className="flex gap-4">
                    <div>
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
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`} fontSize={12} />
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
                              dot={{ r: 2, fill: 'var(--color-revenue)', stroke: 'var(--color-revenue)' }}
                            />
                            {showMonthlyExpenses && (
                              <Line
                                type="monotone"
                                dataKey="expense"
                                stroke="var(--color-expense)"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={{ r: 2, fill: 'var(--color-expense)', stroke: 'var(--color-expense)' }}
                              />
                            )}
                            <Brush dataKey="month" height={30} stroke="hsl(var(--chart-3))" />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    <div className="w-[200px] space-y-2 self-center">
                      <MultiSelectDropdown
                        options={states}
                        selected={filterState}
                        onChange={setFilterState}
                        title="States"
                      />
                      <MultiSelectDropdown
                        options={practiceAreas}
                        selected={filterPracticeArea}
                        onChange={setFilterPracticeArea}
                        title="Areas"
                      />
                      <MultiSelectDropdown options={statuses} selected={filterStatus} onChange={setFilterStatus} title="Statuses" />
                    </div>
                  </div>
                )}

                {chartViewType === "quarterly" && (
                  <div className="flex gap-4">
                    <ChartContainer
                      config={{
                        active: {
                          label: "Active",
                          color: "#3b82f6",
                        },
                        awaiting: {
                          label: "Awaiting",
                          color: "#f59e42",
                        },
                        completed: {
                          label: "Completed",
                          color: "#22c55e",
                        },
                        unspecified: {
                          label: "Unspecified",
                          color: "#6b7280",
                        },
                      }}
                      className="h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={quarterlyStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                                    <p className="text-sm text-blue-500">Active: ${data.active.toLocaleString()}</p>
                                    <p className="text-sm text-orange-500">Awaiting: ${data.awaiting.toLocaleString()}</p>
                                    <p className="text-sm text-green-600">Completed: ${data.completed?.toLocaleString?.() ?? data.unspecified?.toLocaleString?.() ?? 0}</p>
                                    <p className="text-sm text-gray-700">Unspecified: ${data.unspecified?.toLocaleString?.() ?? 0}</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend />
                          <Bar dataKey="active" stackId="a" fill="#3b82f6" name="Active" />
                          <Bar dataKey="awaiting" stackId="a" fill="#f59e42" name="Awaiting" />
                          <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Completed" />
                          <Bar dataKey="unspecified" stackId="a" fill="#6b7280" name="Unspecified" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="w-[200px] space-y-2 self-center">
                      <MultiSelectDropdown
                        options={states}
                        selected={filterState}
                        onChange={setFilterState}
                        title="States"
                      />
                      <MultiSelectDropdown
                        options={practiceAreas}
                        selected={filterPracticeArea}
                        onChange={setFilterPracticeArea}
                        title="Areas"
                      />
                      <MultiSelectDropdown options={statuses} selected={filterStatus} onChange={setFilterStatus} title="Statuses" />
                    </div>
                  </div>
                )}

                {(chartViewType === "projects") && (
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
          </div>
        </TabsContent>
        )}
        {allowedTabs.includes('financial') && (
        <TabsContent value="financial">
          <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'expenses' | 'revenue' | 'cashflow' | 'overview')} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 bg-white border-b border-border h-14 min-h-[56px] px-0 mb-6 rounded-none">
                <TabsTrigger
                  value="expenses"
                  className="px-4 py-3 rounded-none font-medium h-12 flex items-center justify-center transition-all duration-200 border-b-2 border-transparent
                    data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent
                    data-[state=inactive]:text-muted-foreground hover:text-primary hover:bg-transparent"
                >
                  Expenses
                </TabsTrigger>
                <TabsTrigger
                  value="revenue"
                  className="px-4 py-3 rounded-none font-medium h-12 flex items-center justify-center transition-all duration-200 border-b-2 border-transparent
                    data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent
                    data-[state=inactive]:text-muted-foreground hover:text-primary hover:bg-transparent"
                >
                  Revenue
                </TabsTrigger>
                <TabsTrigger
                  value="cashflow"
                  className="px-4 py-3 rounded-none font-medium h-12 flex items-center justify-center transition-all duration-200 border-b-2 border-transparent
                    data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent
                    data-[state=inactive]:text-muted-foreground hover:text-primary hover:bg-transparent"
                >
                  Cash Flow
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="px-4 py-3 rounded-none font-medium h-12 flex items-center justify-center transition-all duration-200 border-b-2 border-transparent
                    data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent
                    data-[state=inactive]:text-muted-foreground hover:text-primary hover:bg-transparent"
                >
                  Overview
                </TabsTrigger>
        </TabsList>
            

        <TabsContent value="expenses" className="flex-1 overflow-auto space-y-4">
          {/* FTE Mode Toggle and Inputs (moved from Revenue) */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-6 gap-2 p-4 bg-muted rounded-lg border">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">FTE Mode:</span>
              <Button
                variant={fteMode === 'manual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFteMode('manual')}
              >
                Manual
              </Button>
              <Button
                variant={fteMode === 'growth' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFteMode('growth')}
              >
                Growth Rate
              </Button>
            </div>
            <div className="flex items-center gap-4 flex-wrap mt-2 md:mt-0">
              {fteMode === 'manual' ? (
                <React.Fragment>
                  <span className="text-xs font-medium">FTEs per year:</span>
                  {projectionYears.map((year) => (
                    <div key={year} className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground">{year}</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={manualFTEs[year] || 1}
                        onChange={e => setManualFTEs({ ...manualFTEs, [year]: Number(e.target.value) })}
                        className="w-16 px-2 py-1 border rounded text-sm text-center"
                      />
            </div>
                  ))}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span className="text-xs font-medium">Base FTE:</span>
              <input
                type="number"
                min="1"
                    max="100"
                    value={fteBase}
                    onChange={e => setFteBase(Number(e.target.value))}
                    className="w-16 px-2 py-1 border rounded text-sm text-center"
                  />
                  <span className="text-xs font-medium">Growth Rate (%/yr):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={(fteGrowth * 100).toFixed(2)}
                    onChange={e => setFteGrowth(Number(e.target.value) / 100)}
                    className="w-20 px-2 py-1 border rounded text-sm text-center"
                  />
                </React.Fragment>
              )}
            </div>
          </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                

                <Card className="w-full">
              <CardHeader>
                    <CardTitle>Expenses by Year (Breakdown)</CardTitle>
                    <CardDescription>Annual expenses by category for each year</CardDescription>
              </CardHeader>
                  <CardContent className="px-2 md:px-4 py-2 md:py-4">
                    <div className="mx-auto h-[460px]" style={{ width: 600 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={yearlyExpenseBreakdown} margin={{ top: 20, right: 10, left: 10, bottom: 80 }} barSize={40} barCategoryGap="10%" barGap={0}>
                      <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="year" 
                            fontSize={10} 
                            interval={0}
                            tick={({ x, y, payload }) => (
                              <text x={x} y={y + 15} textAnchor="middle" fontSize={12} fill="#222">{payload.value}</text>
                            )}
                          />
                          <YAxis 
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} 
                            fontSize={10}
                            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.2 / 1000) * 1000]}
                          />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg" style={{ zIndex: 9999, position: 'relative' }}>
                                    <p className="font-semibold">{label}</p>
                                    {payload.map((item, idx) => (
                                      <div key={idx} className="flex justify-between">
                                        <span>{item.name}</span>
                                        <span className="font-medium">${typeof item.value === 'number' ? item.value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : item.value}</span>
                                      </div>
                                    ))}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                          {/* Legend removed to prevent tooltip overlap */}
                          {/* Add a Bar for each new category, stacked */}
                          {[
                            { key: "Personnel Costs", color: "hsl(var(--chart-1))" },
                            { key: "Office & Facilities", color: "hsl(var(--chart-2))" },
                            { key: "Technology", color: "hsl(var(--chart-3))" },
                            { key: "Professional Services", color: "hsl(var(--chart-4))" },
                            { key: "Business Development", color: "hsl(var(--chart-5))" },
                            { key: "Financing", color: "hsl(var(--chart-6))" },
                            { key: "Other", color: "hsl(var(--chart-1))" },
                          ].map((cat: { key: string, color: string }, index: number) => (
                            <Bar
                              key={cat.key}
                              dataKey={cat.key}
                              stackId="a"
                              fill={cat.color}
                              radius={[4, 4, 0, 0]}
                              isAnimationActive={false}
                            />
                          ))}
                          {/* Add total labels as a separate transparent bar - NOT stacked */}
                          <Bar
                            dataKey="total"
                            stackId="b"
                            fill="transparent"
                            radius={[4, 4, 0, 0]}
                            isAnimationActive={false}
                          >
                            <LabelList
                              dataKey="total"
                              position="top"
                              offset={10}
                              content={({ x, y, value }) => (
                                typeof y === 'number' && typeof value === 'number' ? (
                                  <text x={x} y={y - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="#222">
                                    {`$${(value / 1000).toFixed(0)}K`}
                                  </text>
                                ) : null
                              )}
                            />
                          </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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
                  {(() => {
                    const expenses = calculateExpenses(1, selectedYear)
                    const personnelSubtotal = expenses.salaries + expenses.healthcare + expenses.payrollTaxes + expenses.unemploymentTax + expenses.workersComp + expenses.retirement
                    return (
                      <button
                        type="button"
                        className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
                        onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, personnel: !prev.personnel }))}
                      >
                        <span>Personnel Costs</span>
                        <span className="ml-auto text-xs font-normal text-blue-900">${personnelSubtotal.toLocaleString()} <span className='text-[10px]'>(per 1 FTE)</span></span>
                        <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.personnel ? 'rotate-180' : ''}`} />
                      </button>
                    )
                  })()}
                  {!expenseGroupsCollapsed.personnel && (
                    <div className="space-y-2 pl-3">
                      <label className="text-xs font-medium">Average Salary</label>
                      <input
                        type="number"
                        value={expenseParams.avgSalary}
                        onChange={(e) => updateExpenseParam("avgSalary", Number(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  )}
                  {!expenseGroupsCollapsed.personnel && (
                    <div className="space-y-2 pl-3">
                      <label className="text-xs font-medium">Healthcare per Employee</label>
                      <input
                        type="number"
                        value={expenseParams.healthcarePerEmployee}
                        onChange={(e) => updateExpenseParam("healthcarePerEmployee", Number(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  )}
                  {!expenseGroupsCollapsed.personnel && (
                    <div className="space-y-2 pl-3">
                      <label className="text-xs font-medium">Payroll Tax Rate</label>
                      <input
                        type="number"
                        step="0.001"
                        value={expenseParams.payrollTaxRate}
                        onChange={(e) => updateExpenseParam("payrollTaxRate", Number(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  )}
                  {!expenseGroupsCollapsed.personnel && (
                    <div className="space-y-2 pl-3">
                      <label className="text-xs font-medium">401k Match Rate</label>
                      <input
                        type="number"
                        step="0.01"
                        value={expenseParams.retirement401kRate}
                        onChange={(e) => updateExpenseParam("retirement401kRate", Number(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Office & Facilities */}
                <div className="space-y-3">
                  {(() => {
                    const expenses = calculateExpenses(1, selectedYear)
                    const officeSubtotal = expenses.officeRent + expenses.utilities + expenses.internetPhone
                    return (
                      <button
                        type="button"
                        className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
                        onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, office: !prev.office }))}
                      >
                        <span>Office & Facilities</span>
                        <span className="ml-auto text-xs font-normal text-blue-900">${officeSubtotal.toLocaleString()}</span>
                        <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.office ? 'rotate-180' : ''}`} />
                      </button>
                    )
                  })()}
                  {!expenseGroupsCollapsed.office && (
                    <>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Office Rent (Monthly)</label>
                        <input
                          type="number"
                          value={expenseParams.officeRentPerMonth}
                          onChange={(e) => updateExpenseParam("officeRentPerMonth", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Utilities (Monthly)</label>
                        <input
                          type="number"
                          value={expenseParams.utilitiesPerMonth}
                          onChange={(e) => updateExpenseParam("utilitiesPerMonth", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Internet/Phone (Monthly)</label>
                        <input
                          type="number"
                          value={expenseParams.internetPhonePerMonth}
                          onChange={(e) => updateExpenseParam("internetPhonePerMonth", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Technology */}
                <div className="space-y-3">
                  {(() => {
                    const expenses = calculateExpenses(1, selectedYear)
                    const techSubtotal = expenses.equipment + expenses.software + expenses.itSupport
                    return (
                      <button
                        type="button"
                        className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
                        onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, technology: !prev.technology }))}
                      >
                        <span>Technology</span>
                        <span className="ml-auto text-xs font-normal text-blue-900">${techSubtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.technology ? 'rotate-180' : ''}`} />
                      </button>
                    )
                  })()}
                  {!expenseGroupsCollapsed.technology && (
                    <>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Laptop per Employee</label>
                        <input
                          type="number"
                          value={expenseParams.laptopPerEmployee}
                          onChange={(e) => updateExpenseParam("laptopPerEmployee", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Software per Employee</label>
                        <input
                          type="number"
                          value={expenseParams.softwareLicensesPerEmployee}
                          onChange={(e) => updateExpenseParam("softwareLicensesPerEmployee", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">IT Support per Employee</label>
                        <input
                          type="number"
                          value={expenseParams.itSupportPerEmployee}
                          onChange={(e) => updateExpenseParam("itSupportPerEmployee", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Professional Services */}
                <div className="space-y-3">
                  {(() => {
                    const expenses = calculateExpenses(1, selectedYear)
                    const profSubtotal = expenseParams.freelanceAnnual + expenseParams.accountingAnnual + expenseParams.legalAnnual + expenseParams.insuranceAnnual
                    return (
                      <button
                        type="button"
                        className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
                        onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, professional: !prev.professional }))}
                      >
                        <span>Professional Services</span>
                        <span className="ml-auto text-xs font-normal text-blue-900">${profSubtotal.toLocaleString()}</span>
                        <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.professional ? 'rotate-180' : ''}`} />
                      </button>
                    )
                  })()}
                  {!expenseGroupsCollapsed.professional && (
                    <>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Freelance (Annual)</label>
                        <input
                          type="number"
                          value={expenseParams.freelanceAnnual}
                          onChange={(e) => updateExpenseParam("freelanceAnnual", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Accounting (Annual)</label>
                        <input
                          type="number"
                          value={expenseParams.accountingAnnual}
                          onChange={(e) => updateExpenseParam("accountingAnnual", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Legal (Annual)</label>
                        <input
                          type="number"
                          value={expenseParams.legalAnnual}
                          onChange={(e) => updateExpenseParam("legalAnnual", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Insurance (Annual)</label>
                        <input
                          type="number"
                          value={expenseParams.insuranceAnnual}
                          onChange={(e) => updateExpenseParam("insuranceAnnual", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Business Development */}
                <div className="space-y-3">
                  {(() => {
                    const expenses = calculateExpenses(1, selectedYear)
                    const bizSubtotal = expenseParams.marketingAnnual + expenseParams.travelPerEmployee + expenseParams.conferencesTrainingPerEmployee
                    return (
                      <button
                        type="button"
                        className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
                        onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, business: !prev.business }))}
                      >
                        <span>Business Development</span>
                        <span className="ml-auto text-xs font-normal text-blue-900">${bizSubtotal.toLocaleString()}</span>
                        <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.business ? 'rotate-180' : ''}`} />
                      </button>
                    )
                  })()}
                  {!expenseGroupsCollapsed.business && (
                    <>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Marketing (Annual)</label>
                        <input
                          type="number"
                          value={expenseParams.marketingAnnual}
                          onChange={(e) => updateExpenseParam("marketingAnnual", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Travel per Employee</label>
                        <input
                          type="number"
                          value={expenseParams.travelPerEmployee}
                          onChange={(e) => updateExpenseParam("travelPerEmployee", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Training per Employee</label>
                        <input
                          type="number"
                          value={expenseParams.conferencesTrainingPerEmployee}
                          onChange={(e) => updateExpenseParam("conferencesTrainingPerEmployee", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Financing */}
                <div className="space-y-3">
                  {(() => {
                    const expenses = calculateExpenses(1, selectedYear)
                    const financeSubtotal = expenses.loanPayment
                    return (
                      <button
                        type="button"
                        className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
                        onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, financing: !prev.financing }))}
                      >
                        <span>Financing</span>
                        <span className="ml-auto text-xs font-normal text-blue-900">${financeSubtotal.toLocaleString()}</span>
                        <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.financing ? 'rotate-180' : ''}`} />
                      </button>
                    )
                  })()}
                  {!expenseGroupsCollapsed.financing && (
                    <>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Loan Amount</label>
                        <input
                          type="number"
                          value={expenseParams.loanAmount}
                          onChange={(e) => updateExpenseParam("loanAmount", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Interest Rate</label>
                        <input
                          type="number"
                          step="0.01"
                          value={expenseParams.loanInterestRate}
                          onChange={(e) => updateExpenseParam("loanInterestRate", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2 pl-3">
                        <label className="text-xs font-medium">Term (Years)</label>
                        <input
                          type="number"
                          value={expenseParams.loanTermYears}
                          onChange={(e) => updateExpenseParam("loanTermYears", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Other */}
                <div className="space-y-3">
                  {(() => {
                    const expenses = calculateExpenses(1, selectedYear)
                    const otherSubtotal = expenses.officeSupplies + expenses.miscellaneous
                    return (
                      <button
                        type="button"
                        className="flex items-center w-full justify-between font-semibold text-sm border-b pb-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors focus:outline-none mb-1"
                        onClick={() => setExpenseGroupsCollapsed(prev => ({ ...prev, other: !prev.other }))}
                      >
                        <span>Other</span>
                        <span className="ml-auto text-xs font-normal text-blue-900">${otherSubtotal.toLocaleString()}</span>
                        <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${expenseGroupsCollapsed.other ? 'rotate-180' : ''}`} />
                      </button>
                    )
                  })()}
                  {!expenseGroupsCollapsed.other && (
                    <div className="space-y-2 pl-3">
                      <label className="text-xs font-medium">Inflation Rate</label>
                      <input
                        type="number"
                        step="0.01"
                        value={expenseParams.inflationRate}
                        onChange={(e) => updateExpenseParam("inflationRate", Number(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  )}
                </div>

                <Button variant="outline" onClick={() => setExpenseParams(defaultExpenseParams)} className="w-full">
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </div>
              
        </TabsContent>

        <TabsContent value="revenue" className="flex-1 overflow-auto space-y-4">
              
          {/* Manual Revenue Input Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Revenue Input Method</CardTitle>
              <CardDescription>Choose how to calculate revenue projections</CardDescription>
            </CardHeader>
            <CardContent className="px-2 md:px-4 py-2 md:py-4">
              <div className="space-y-4">
                {/* Toggle between methods */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="revenueMethod"
                      checked={!useManualRevenue}
                      onChange={() => setUseManualRevenue(false)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Project-based (from CSV/Project data)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="revenueMethod"
                      checked={useManualRevenue}
                      onChange={() => setUseManualRevenue(true)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Manual input</span>
                  </label>
                </div>

                {/* Manual revenue input fields */}
                {useManualRevenue && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {projectionYears.map((year) => (
                        <div key={year} className="space-y-2">
                          <label className="text-sm font-medium">{year}</label>
                          <div className="text-xs text-blue-600 font-medium">
                            ${(manualRevenue[year] || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                          <input
                            type="number"
                            value={manualRevenue[year] || 0}
                            onChange={(e) => setManualRevenue(prev => ({
                              ...prev,
                              [year]: Number(e.target.value) || 0
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Quarterly breakdown for 2026 */}
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          checked={useQuarterlyBreakdown}
                          onChange={() => setUseQuarterlyBreakdown(!useQuarterlyBreakdown)}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">Break down 2026 by quarters</span>
                      </div>
                      
                      {useQuarterlyBreakdown && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                              <div key={quarter} className="space-y-2">
                                <label className="text-sm font-medium">{quarter} 2026</label>
                                <div className="text-xs text-blue-600 font-medium">
                                  ${(quarterlyRevenue2026[quarter as keyof typeof quarterlyRevenue2026] || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </div>
                                <input
                                  type="number"
                                  value={quarterlyRevenue2026[quarter as keyof typeof quarterlyRevenue2026] || 0}
                                  onChange={(e) => setQuarterlyRevenue2026(prev => ({
                                    ...prev,
                                    [quarter]: Number(e.target.value) || 0
                                  }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="0"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Total 2026:</span>
                            <span className="font-bold text-blue-600">
                              ${(Object.values(quarterlyRevenue2026).reduce((sum, val) => sum + val, 0) / 1000000).toFixed(1)}M
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const total2026 = manualRevenue[2026] || 4100000
                                const quarterValue = total2026 / 4
                                setQuarterlyRevenue2026({
                                  Q1: quarterValue,
                                  Q2: quarterValue,
                                  Q3: quarterValue,
                                  Q4: quarterValue,
                                })
                              }}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-sm"
                            >
                              Distribute 2026 evenly
                            </button>
                            <button
                              onClick={() => {
                                const total = Object.values(quarterlyRevenue2026).reduce((sum, val) => sum + val, 0)
                                setManualRevenue(prev => ({
                                  ...prev,
                                  2026: total
                                }))
                              }}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                              Update 2026 total
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Quick actions */}
                    <div className="flex gap-2 items-center">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Start Year:</label>
                        <select
                          value={manualRevenueGrowthStartYear}
                          onChange={e => setManualRevenueGrowthStartYear(Number(e.target.value))}
                          className="w-20 px-2 py-1 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {projectionYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Growth Rate (%):</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={(manualRevenueGrowthRate * 100).toFixed(0)}
                          onChange={e => setManualRevenueGrowthRate(Number(e.target.value) / 100)}
                          className="w-16 px-2 py-1 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="20"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const baseRevenue = manualRevenue[manualRevenueGrowthStartYear] || 4100000
                          const newRevenue: { [year: number]: number } = {}
                          projectionYears.forEach(year => {
                            if (year < manualRevenueGrowthStartYear) {
                              // Keep existing values for years before the start year
                              newRevenue[year] = manualRevenue[year] || 0
                            } else {
                              // Apply growth from the start year
                              const yearsFromStart = year - manualRevenueGrowthStartYear
                              newRevenue[year] = baseRevenue * Math.pow(1 + manualRevenueGrowthRate, yearsFromStart)
                            }
                          })
                          setManualRevenue(newRevenue)
                        }}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => {
                          const newRevenue: { [year: number]: number } = {}
                          projectionYears.forEach(year => {
                            newRevenue[year] = 0
                          })
                          setManualRevenue(newRevenue)
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="w-full">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>
                  {useManualRevenue ? 'Manual revenue input' : 'Project-based revenue calculation'} from 2026-2031
                </CardDescription>
              </CardHeader>
                    <CardContent className="px-3 pb-3">
                <ChartContainer
                  config={{
                    contractRevenue: {
                      label: "Contract Revenue",
                      color: "hsl(var(--chart-1))",
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
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

                  <Card className="w-full">
              <CardHeader>
                <CardTitle>Profit Margins</CardTitle>
                <CardDescription>Net income and profit margin trends</CardDescription>
              </CardHeader>
                    <CardContent className="px-3 pb-3">
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
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={businessProjections} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

                <Card className="w-full">
            <CardHeader>
              <CardTitle>Revenue Breakdown by Year</CardTitle>
              <CardDescription>Detailed financial projections with key metrics</CardDescription>
            </CardHeader>
                  <CardContent className="px-2 md:px-4 py-2 md:py-4">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-sm md:text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Year</th>
                      <th className="text-left p-2">FTE</th>
                      <th className="text-left p-2">Contract Revenue</th>
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

        <TabsContent value="cashflow" className="flex-1 overflow-auto space-y-4">
                <Card className="w-full">
            <CardHeader>
              <CardTitle>Cash Flow Projections</CardTitle>
              <CardDescription>
                Projected cash flow from {projectionYears[0]} to {projectionYears[projectionYears.length - 1]}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm font-medium">External Equity:</label>
                <input
                  type="number"
                  value={startingCash}
                  onChange={(e) => setStartingCash(Number(e.target.value))}
                  className="w-32 px-2 py-1 border rounded text-sm"
                />
              </div>
            </CardHeader>
                  <CardContent className="px-2 md:px-4 py-2 md:py-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
                <div>
                  <div className="font-semibold">External Equity</div>
                  <div className="text-xl font-semibold text-primary">${(startingCash / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="font-semibold">Total Revenue</div>
                  <div className="text-xl font-semibold text-blue-600">
                    ${(cashFlowProjections.reduce((sum, p) => sum + p.revenue, 0) / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Total Expenses</div>
                  <div className="text-xl font-semibold text-red-600">
                    ${(cashFlowProjections.reduce((sum, p) => sum + p.expenses, 0) / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Total Cash Flow</div>
                  <div className="text-xl font-semibold text-green-600">
                    ${(cashFlowProjections.reduce((sum, p) => sum + p.cashAmount, 0) / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="font-semibold">
                    Ending Cash ({cashFlowProjections[cashFlowProjections.length - 1].year})
                  </div>
                  <div className="text-xl font-semibold text-purple-600">
                    ${(cashFlowProjections[cashFlowProjections.length - 1].cumulativeCash / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>


              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  expenses: {
                    label: "Expenses",
                    color: "hsl(var(--chart-2))",
                  },
                  cashAmount: {
                    label: "Cash Flow",
                    color: "hsl(var(--chart-3))",
                  },
                  cumulativeCash: {
                    label: "Cumulative Cash",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={cashFlowProjections} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                              <p className="font-bold" style={{ color: 'hsl(var(--chart-1))' }}>Revenue: ${data.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                              <p className="font-bold" style={{ color: 'hsl(var(--chart-2))' }}>Expenses: ${data.expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                              <p className="font-bold" style={{ color: 'hsl(var(--chart-3))' }}>Cash Flow: ${data.cashAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                              <p className="font-bold" style={{ color: 'hsl(var(--chart-4))' }}>Cumulative Cash: ${data.cumulativeCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cashAmount" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    <Line
                      type="monotone"
                      dataKey="cumulativeCash"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={3}
                      dot={{ r: 5, fill: 'hsl(var(--chart-4))', stroke: 'hsl(var(--chart-4))' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

 {/* Table for yearly breakdown */}
              <div className="overflow-x-auto w-full mb-6">
                <table className="w-full text-sm md:text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Year</th>
                      <th className="text-left p-2">Revenue</th>
                      <th className="text-left p-2">Expenses</th>
                      <th className="text-left p-2">Cash Flow</th>
                      <th className="text-left p-2">Cumulative Cash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashFlowProjections.map((proj) => (
                      <tr key={proj.year} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{proj.year}</td>
                        <td className="p-2">${proj.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className="p-2">${proj.expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className={`p-2 font-medium ${proj.cashAmount < 0 ? 'text-red-600' : 'text-black'}`}>${proj.cashAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className={`p-2 font-medium ${proj.cumulativeCash < 0 ? 'text-red-600' : 'text-black'}`}>${proj.cumulativeCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

        </TabsContent>
        <TabsContent value="overview" className="flex-1 overflow-auto space-y-4">
          {/* Growth Trend Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Revenue Growth Trend</CardTitle>
              <CardDescription>Cumulative project value over time (2023-2030)</CardDescription>
            </CardHeader>
            <CardContent>
              {growthTrendData.length > 0 && (
                <>
                  <div className="mb-4 p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-semibold">2023 Starting Value</div>
                        <div className="text-xl font-semibold text-primary">
                          ${(growthTrendData[0]?.cumulativeValue / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">Current Value (2026)</div>
                        <div className="text-xl font-semibold text-green-600">
                          $
                          {(
                            growthTrendData.find((d) => d.year === "2026" && !d.isProjected)?.cumulativeValue / 1000000 ||
                            growthTrendData[growthTrendData.findIndex((d) => d.isProjected) - 1]?.cumulativeValue /
                              1000000 ||
                            0
                          ).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                          M
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">Growth Rate (CAGR)
                          <input
                            type="number"
                            min={0}
                            max={1}
                            step={0.01}
                            value={cagr}
                            onChange={e => setCagr(Number(e.target.value))}
                            className="ml-2 w-24 px-3 py-1 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.20"
                          />
                        </div>
                        <div className="text-xl font-semibold text-blue-600">{(cagr * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="font-semibold">2030 Projection</div>
                        <div className="text-xl font-semibold text-purple-600">
                          ${(growthTrendData.find((d) => d.year === "2030")?.cumulativeValue / 1000000 || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}M
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ChartContainer
                    config={{
                      cumulativeValue: {
                        label: "Cumulative Value",
                        color: "hsl(var(--chart-1))",
                      },
                      projected: {
                        label: "Projected Value",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-72"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={growthTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" fontSize={12} />
                        <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} fontSize={12} />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              const isProjected = data.isProjected
                              return (
                                <div className="bg-background border rounded-lg p-3 shadow-lg max-w-xs">
                                  <p className="font-semibold">
                                    {data.year} {isProjected && "(Projected)"}
                                  </p>
                                  <p className="text-lg font-semibold text-primary">
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
                                key={payload.year}
                                cx={props.cx}
                                cy={props.cy}
                                r={payload?.isProjected ? 3 : 5}
                                fill={payload?.isProjected ? "hsl(var(--chart-2))" : "var(--color-cumulativeValue)"}
                                strokeWidth={payload?.isProjected ? 2 : 0}
                                stroke={payload?.isProjected ? "var(--color-cumulativeValue)" : "none"}
                                strokeDasharray={payload?.isProjected ? "4,4" : "none"}
                              />
                            )
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="w-full">
              <CardHeader>
                <CardTitle>Business Projections Summary</CardTitle>
                <CardDescription>Key financial metrics for 2026-2031</CardDescription>
              </CardHeader>
                    <CardContent className="px-3 pb-3">
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

                  <Card className="w-full">
              <CardHeader>
                <CardTitle>Project Distribution</CardTitle>
                <CardDescription>Breakdown by practice area and status</CardDescription>
              </CardHeader>
                    <CardContent className="px-3 pb-3">
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

                <Card className="w-full">
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Projects by state with total values</CardDescription>
            </CardHeader>
                  <CardContent className="px-2 md:px-4 py-2 md:py-4">
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
          </Tabs>
        </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

