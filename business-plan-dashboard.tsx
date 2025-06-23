"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useMemo, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, MapPin, ChevronsUpDown } from "lucide-react"
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
import * as d3 from 'd3'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// Set Mapbox access token
d3.select("svg").attr("width", "100%").attr("height", "100%")

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

  const input = str.toString().trim().toLowerCase()
  
  // Handle common text formats that should be converted to dollar values
  const textToValueMap: { [key: string]: number } = {
    // Common fee ranges
    "number": 500000, // Default medium project
    "general": 750000, // Default large project
    "accounting": 300000, // Default small project
    "small": 250000,
    "medium": 500000,
    "large": 1000000,
    "extra large": 2000000,
    "xl": 2000000,
    "xxl": 3000000,
    
    // Common project types
    "k12": 400000,
    "higher education": 750000,
    "university": 800000,
    "school district": 450000,
    "public school": 400000,
    "private school": 350000,
    "college": 600000,
    "community college": 300000,
    
    // Common fee descriptions
    "standard": 500000,
    "premium": 1000000,
    "basic": 300000,
    "comprehensive": 1200000,
    "full service": 900000,
    "consulting": 400000,
    "design": 600000,
    "planning": 350000,
    "architecture": 700000,
    "engineering": 500000,
    
    // Common abbreviations
    "std": 500000,
    "prem": 1000000,
    "comp": 1200000,
    "full": 900000,
    "cons": 400000,
    "arch": 700000,
    "eng": 500000,
  }

  // Check if the input matches any text format
  for (const [text, value] of Object.entries(textToValueMap)) {
    if (input === text || input.includes(text)) {
      return value
    }
  }

  // Handle currency symbols and common formatting
  let cleaned = input
  
  // Remove currency symbols and common prefixes/suffixes
  cleaned = cleaned.replace(/[\$€£¥₹]/g, '') // Remove currency symbols
  cleaned = cleaned.replace(/k\b/gi, '000') // Convert K to thousands
  cleaned = cleaned.replace(/m\b/gi, '000000') // Convert M to millions
  cleaned = cleaned.replace(/b\b/gi, '000000000') // Convert B to billions
  cleaned = cleaned.replace(/thousand/gi, '000')
  cleaned = cleaned.replace(/million/gi, '000000')
  cleaned = cleaned.replace(/billion/gi, '000000000')
  
  // Handle various number formats
  // Remove spaces, commas, and other separators
  cleaned = cleaned.replace(/[\s,]/g, '')
  
  // Handle parentheses (negative numbers)
  if (cleaned.includes('(') && cleaned.includes(')')) {
    cleaned = '-' + cleaned.replace(/[()]/g, '')
  }
  
  // Handle different decimal separators (comma vs period)
  if (cleaned.includes(',') && !cleaned.includes('.')) {
    // If there's a comma but no period, it might be a decimal separator
    cleaned = cleaned.replace(',', '.')
  }
  
  // Remove all non-numeric characters except decimal points and negative signs
  cleaned = cleaned.replace(/[^\d.-]/g, "")

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

// Original project data for charts tab - using actual CSV data
const aggregateProjectData = () => {
  const projects = [
    {
      Start_Date: "8/12/2023",
      Completion_Date: "6/7/2024",
      "Practice Area": "K12 Education",
      Status: "Active",
      Project_Name: "BPS Capital Advisory Services",
      City: "Roxbury",
      State: "MA",
      Date_Awarded: "10/2/2023",
      detail_Name: "BPS Capital Advisory Services",
      Studio: "Austin Studio 01",
      Fee: 141500,
      Reimbursables: "",
    },
    {
      Start_Date: "2/27/2024",
      Completion_Date: "9/19/2025",
      "Practice Area": "K12 Education",
      Status: "Active",
      Project_Name: "East Side Union HSD Master Plan",
      City: "San Jose",
      State: "CA",
      Date_Awarded: "2/12/2024",
      detail_Name: "East Side Union HSD Master Plan",
      Studio: "San Francisco Studio 01",
      Fee: 348000,
      Reimbursables: "",
    },
    {
      Start_Date: "2/17/2024",
      Completion_Date: "10/31/2025",
      "Practice Area": "K12 Education",
      Status: "Active",
      Project_Name: "MPS Long Range Facilities Master Plan",
      City: "Milwaukee",
      State: "WI",
      Date_Awarded: "3/4/2024",
      detail_Name: "MPS Long Range Facilities Master Plan",
      Studio: "Austin Studio 01",
      Fee: 933028.85,
      Reimbursables: "$15,000.00",
    },
    {
      Start_Date: "6/26/2024",
      Completion_Date: "10/31/2025",
      "Practice Area": "K12 Education",
      Status: "Active",
      Project_Name: "OUSD Facilities Master Planning Services",
      City: "Oakland",
      State: "CA",
      Date_Awarded: "8/2/2024",
      detail_Name: "OUSD Facilities Master Planning Services",
      Studio: "San Francisco Studio 01",
      Fee: 626189.75,
      Reimbursables: "$122,985.00",
    },
    {
      Start_Date: "11/9/2024",
      Completion_Date: "12/31/2025",
      "Practice Area": "K12 Education",
      Status: "Active",
      Project_Name: "BPS: Long-Term Facilties Plan",
      City: "Roxbury",
      State: "MA",
      Date_Awarded: "10/7/2024",
      detail_Name: "BPS: Long-Term Facilties Plan",
      Studio: "Austin Studio 01",
      Fee: 200000,
      Reimbursables: "$10,000.00",
    },
    {
      Start_Date: "8/17/2024",
      Completion_Date: "8/7/2027",
      "Practice Area": "K12 Education",
      Status: "Active",
      Project_Name: "Colorado Springs D11: Palmer High School",
      City: "Colorado Springs",
      State: "CO",
      Date_Awarded: "8/5/2024",
      detail_Name: "Colorado Springs D11: Palmer High School",
      Studio: "Austin Studio 01",
      Fee: 976137.4,
      Reimbursables: "",
    },
    {
      Start_Date: "2/1/2025",
      Completion_Date: "7/17/2026",
      "Practice Area": "K12 Education",
      Status: "Active",
      Project_Name: "Jeffco Public Schools: Capital MP",
      City: "Golden",
      State: "CO",
      Date_Awarded: "",
      detail_Name: "Jeffco Public Schools: Capital MP",
      Studio: "Austin Studio 01",
      Fee: 774900.33,
      Reimbursables: "",
    },
    {
      Start_Date: "7/17/2025",
      Completion_Date: "12/17/2025",
      "Practice Area": "K12 Education",
      Status: "Awaiting",
      Project_Name: "Asheville City Schools",
      City: "Asheville",
      State: "NC",
      Date_Awarded: "",
      detail_Name: "Asheville City Schools",
      Studio: "Raleigh Charlotte Studio 01",
      Fee: 300000,
      Reimbursables: "",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "K12 Education",
      Status: "Active",
      Project_Name: "Syracuse: Staffing and Utilization",
      City: "Syracuse",
      State: "NY",
      Date_Awarded: "",
      detail_Name: "Syracuse: Staffing and Utilization",
      Studio: "Austin Studio 01",
      Fee: 0,
      Reimbursables: "",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "K12 Education",
      Status: "Active",
      Project_Name: "MCPS_Facilities Master Plan",
      City: "Rockville",
      State: "MD",
      Date_Awarded: "",
      detail_Name: "MCPS_Facilities Master Plan",
      Studio: "Austin Studio 01",
      Fee: 0,
      Reimbursables: "",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "Mixed Use + Retail",
      Status: "Awaiting",
      Project_Name: "Brevard County_ Ed Facilities Planning",
      City: "Viera",
      State: "FL",
      Date_Awarded: "",
      detail_Name: "Brevard County_ Ed Facilities Planning",
      Studio: "Austin Studio 01",
      Fee: 0,
      Reimbursables: "",
    },
    {
      Start_Date: "3/25/2025",
      Completion_Date: "7/17/2025",
      "Practice Area": "K12 Education",
      Status: "Active",
      Project_Name: "NHPS",
      City: "New Haven",
      State: "CT",
      Date_Awarded: "3/1/2025",
      detail_Name: "NHPS",
      Studio: "Stamford Studio 01",
      Fee: 99000,
      Reimbursables: "",
    },
    {
      Start_Date: "7/17/2025",
      Completion_Date: "12/31/2025",
      "Practice Area": "K12 Education",
      Status: "Awaiting",
      Project_Name: "Fairfax County Public Schools",
      City: "Faifax",
      State: "MD",
      Date_Awarded: "6/1/2025",
      detail_Name: "Fairfax County Public Schools",
      Studio: "Austin Studio 01",
      Fee: 700000,
      Reimbursables: "",
    },
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
      Fee: 400000,
      Reimbursables: "",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "DCPS Capital FY25",
      City: "Washington",
      State: "DC",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "200,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "DCPS Capital FY 26",
      City: "Washington",
      State: "DC",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "220,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "DCPS Capital Fy27",
      City: "Washington",
      State: "DC",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "165,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "KIPP DC Capital",
      City: "Washington",
      State: "DC",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "95,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "KIPP DC Advisory",
      City: "Washington",
      State: "DC",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "35,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "El Monte High School District",
      City: "El Monte",
      State: "CA",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "202,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "Eden ROP",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "56,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "Burbank USd",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "350,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "Colorado Springs D11",
      City: "",
      State: "CO",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "650,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "DC Public Schools Boundary Study",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "540,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "DC Puliblic Schools MFP",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "540,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "Stockton USD",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "450,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "Pomona USD",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "400,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "El Monte City Schools",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "250,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "Sonoma County USD",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "150,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "Anne Arundel County",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "650,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "DC International School",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "30,000",
    },
    {
      Start_Date: "",
      Completion_Date: "",
      "Practice Area": "",
      Status: "Active",
      Project_Name: "KIPP Texas",
      City: "",
      State: "",
      Date_Awarded: "",
      detail_Name: "",
      Studio: "",
      Fee: 0,
      Reimbursables: "40,000",
    },
  ]

  return projects.map((row) => ({
    name: row.Project_Name || row.detail_Name || "Unknown Project",
    totalFee: cleanFee(row.Fee || row.Reimbursables),
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

    let durationMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1
    if (durationMonths <= 0) {
      durationMonths = 1
    }
    
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
    // More robust CSV parsing that handles quoted values with commas
    const values: string[] = []
    let current = ""
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    values.push(current.trim()) // Add the last value
    
    const row: any = {}

    headers.forEach((header, index) => {
      const value = values[index] || ""
      row[header] = value.replace(/"/g, "") // Remove any remaining quotes
    })

    return row
  })

  // Transform the data to match our expected format - now with enhanced parsing and flexible field handling
  const transformedData = data
    .map((row, index) => {
      // Get project name from various possible column names
      const projectName = row.Project_Name || row.detail_Name || row.Name || row.Project || row.ProjectName || `Project ${index + 1}`
      
      // Get fee from various possible column names - check both Fee and Reimbursables columns
      let feeValue = row.Fee || row.fee || row.Value || row.value || row.Amount || row.amount || row.Contract_Value || row.ContractValue || 0
      
      // If fee is 0 or empty, check if there's a value in Reimbursables that looks like a fee
      if (!feeValue || feeValue === "0" || feeValue === "") {
        const reimbursablesValue = row.Reimbursables || row.reimbursables || row.Reimbursable || row.reimbursable || ""
        // If reimbursables looks like a fee (contains numbers and possibly commas), use it
        if (reimbursablesValue && /[\d,]/.test(reimbursablesValue)) {
          feeValue = reimbursablesValue
        }
      }
      
      // Get other fields with fallbacks
      const state = row.State || row.state || row.ST || row.st || ""
      const city = row.City || row.city || ""
      const startDate = row.Start_Date || row.StartDate || row.start_date || row.startdate || ""
      const endDate = row.Completion_Date || row.EndDate || row.end_date || row.enddate || row.CompletionDate || ""
      const dateAwarded = row.Date_Awarded || row.DateAwarded || row.date_awarded || row.dateawarded || startDate || ""
      const status = row.Status || row.status || "Active"
      const practiceArea = row["Practice Area"] || row.PracticeArea || row.practice_area || row.practicearea || ""
      const reimbursables = row.Reimbursables || row.reimbursables || row.Reimbursable || row.reimbursable || 0
      const studio = row.Studio || row.studio || ""

      return {
        name: projectName,
        totalFee: cleanFee(feeValue),
        state: state,
        city: city,
        startDate: startDate,
        endDate: endDate,
        dateAwarded: dateAwarded,
        status: status,
        practiceArea: practiceArea,
        reimbursables: cleanFee(reimbursables),
        studio: studio,
      }
    })
    .filter((project) => {
      // Only require project name and a valid fee value
      return project.name && 
             project.name !== "Unknown Project" && 
             project.totalFee > 0
    })

  // Aggregate by project name to eliminate duplicates
  const aggregatedData = new Map()
  
  transformedData.forEach((project) => {
    const key = project.name
    if (!aggregatedData.has(key)) {
      aggregatedData.set(key, {
        ...project,
        totalFee: 0,
        reimbursables: 0,
      })
    }
    
    const existing = aggregatedData.get(key)
    existing.totalFee += project.totalFee
    existing.reimbursables += project.reimbursables
  })

  return Array.from(aggregatedData.values())
}

// Remove the old MapboxMap component and replace with StateMap
const StateMap = ({ projects, onStateClick }: { projects: any[]; onStateClick: (state: string) => void }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  // Aggregate projects by state
  const stateData = useMemo(() => {
    const data = new Map<string, { count: number; totalValue: number; projects: any[] }>()
    projects.forEach((project) => {
      const state = project.state
      if (!data.has(state)) {
        data.set(state, { count: 0, totalValue: 0, projects: [] })
      }
      const existing = data.get(state)!
      existing.count += 1
      existing.totalValue += project.totalFee
      existing.projects.push(project)
    })
    return data
  }, [projects])

  useEffect(() => {
    if (!mapContainer.current) return

    const loadMap = () => {
      try {
        // Clear previous content
        d3.select(mapContainer.current).selectAll("*").remove()

        // Set up the map dimensions
        const width = mapContainer.current?.clientWidth || 800
        const height = 500

        // Create SVG
        const svg = d3.select(mapContainer.current)
          .append("svg")
          .attr("width", width)
          .attr("height", height)

        // Create color scale
        const maxValue = Math.max(...Array.from(stateData.values()).map(d => d.totalValue), 1)
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
          .domain([0, maxValue])

        // Create a simple state grid layout
        const statesWithData = Array.from(stateData.entries())
          .sort((a, b) => b[1].totalValue - a[1].totalValue)
          .slice(0, 50) // Show top 50 states

        const cols = Math.ceil(Math.sqrt(statesWithData.length))
        const rows = Math.ceil(statesWithData.length / cols)
        const cellWidth = width / cols
        const cellHeight = height / rows

        // Draw state rectangles
        svg.selectAll("rect")
          .data(statesWithData)
          .enter()
          .append("rect")
          .attr("x", (d, i) => (i % cols) * cellWidth)
          .attr("y", (d, i) => Math.floor(i / cols) * cellHeight)
          .attr("width", cellWidth - 2)
          .attr("height", cellHeight - 2)
          .attr("fill", (d) => colorScale(d[1].totalValue))
          .attr("stroke", "#fff")
          .attr("stroke-width", 1)
          .attr("cursor", "pointer")
          .on("click", (event, d) => onStateClick(d[0]))
          .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke-width", 3).attr("stroke", "#000")
            
            const tooltip = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("position", "absolute")
              .style("background", "rgba(0,0,0,0.8)")
              .style("color", "white")
              .style("padding", "8px")
              .style("border-radius", "4px")
              .style("font-size", "12px")
              .style("pointer-events", "none")
              .style("z-index", "1000")
            
            tooltip.html(`
              <strong>${stateCoordinates[d[0]]?.name || d[0]}</strong><br/>
              Projects: ${d[1].count}<br/>
              Total Value: $${(d[1].totalValue / 1000).toFixed(0)}K
            `)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 10) + "px")
          })
          .on("mouseout", function() {
            d3.select(this).attr("stroke-width", 1).attr("stroke", "#fff")
            d3.selectAll(".tooltip").remove()
          })

        // Add state labels
        svg.selectAll("text")
          .data(statesWithData)
          .enter()
          .append("text")
          .attr("x", (d, i) => (i % cols) * cellWidth + cellWidth / 2)
          .attr("y", (d, i) => Math.floor(i / cols) * cellHeight + cellHeight / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", "10px")
          .attr("fill", "white")
          .attr("pointer-events", "none")
          .text((d) => stateCoordinates[d[0]]?.name || d[0])

        // Add title
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", 20)
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .attr("font-weight", "bold")
          .text("State Project Distribution")

      } catch (error) {
        console.error('Error creating map:', error)
        setMapError(`Failed to create map: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    loadMap()
  }, [stateData, onStateClick])

  return (
    <div className="w-full">
      {mapError ? (
        <div className="w-full h-[500px] rounded-lg border shadow-sm bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 font-semibold mb-2">Map Error</div>
            <div className="text-sm text-gray-600">{mapError}</div>
          </div>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-[500px] rounded-lg border shadow-sm" />
      )}

      {/* Enhanced Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded border"></div>
          <span>No Projects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded"></div>
          <span>Low Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300 rounded"></div>
          <span>Medium Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>High Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-700 rounded"></div>
          <span>Very High Value</span>
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

const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  title,
}: {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  title: string
}) => {
  const handleSelect = (option: string) => {
    let newSelected: string[]

    if (option === "all") {
      newSelected = ["all"]
    } else {
      newSelected = selected.includes("all") ? [option] : [...selected, option]
    }

    onChange(newSelected)
  }

  const handleDeselect = (option: string) => {
    let newSelected = selected.filter((item) => item !== option)
    if (newSelected.length === 0) {
      newSelected = ["all"]
    }
    onChange(newSelected)
  }

  const getButtonText = () => {
    if (selected.includes("all") || selected.length === 0) {
      return `All ${title}`
    }
    if (selected.length === 1) {
      return selected[0]
    }
    return `${selected.length} ${title} selected`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between text-left font-normal">
          <span>{getButtonText()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" align="start">
        <DropdownMenuCheckboxItem checked={selected.includes("all")} onSelect={() => onChange(["all"])}>
          All {title}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {options
          .filter((o) => o !== "all")
          .map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={selected.includes(option)}
              onSelect={() => {
                if (selected.includes(option)) {
                  handleDeselect(option)
                } else {
                  handleSelect(option)
                }
              }}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function BusinessPlanDashboard() {
  const [mainTab, setMainTab] = useState<'financial' | 'strategy'>('financial')
  const [viewType, setViewType] = useState<'charts' | 'expenses' | 'revenue' | 'cashflow' | 'overview'>('charts')
  const [strategyTab, setStrategyTab] = useState<'case' | 'proscons'>('case')
  const [selectedYear, setSelectedYear] = useState(2026)
  const [customFTE, setCustomFTE] = useState(3) // Manual FTE override
  const [expenseParams, setExpenseParams] = useState(defaultExpenseParams)
  const [csvData, setCsvData] = useState<any[]>([])
  const [isUsingCsvData, setIsUsingCsvData] = useState(false)
  const [showMonthlyExpenses, setShowMonthlyExpenses] = useState(false)
  const [startingCash, setStartingCash] = useState(50000)

  // Password protection state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(true)

  // Original chart states
  const [sortBy, setSortBy] = useState<"fee" | "date" | "name">("fee")
  const [sortReverse, setSortReverse] = useState(false)
  const [filterState, setFilterState] = useState<string[]>(["all"])
  const [filterPracticeArea, setFilterPracticeArea] = useState<string[]>(["all"])
  const [filterStatus, setFilterStatus] = useState<string[]>(["all"])
  const [chartViewType, setChartViewType] = useState<"projects" | "monthly" | "quarterly" | "growth" | "map">("projects")

  // Add state for CAGR
  const [cagr, setCagr] = useState(0.10)

  // Add state for FTE mode, manual FTEs, and FTE growth rate
  const [fteMode, setFteMode] = useState<'manual' | 'growth'>('manual')
  const [manualFTEs, setManualFTEs] = useState<{ [year: number]: number }>({
    2025: 1,
    2026: 2,
    2027: 3,
    2028: 3,
    2029: 3,
    2030: 3,
  })
  const [fteBase, setFteBase] = useState(1)
  const [fteGrowth, setFteGrowth] = useState(0.10)

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
  }, [processedData, cagr])

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

  // Helper to get FTE for a year
  const getFTE = (year: number) => {
    if (fteMode === 'manual') {
      return manualFTEs[year] || 1
    } else {
      // Growth mode: FTE = base * (1 + growth)^(year - 2025)
      return Math.round(fteBase * Math.pow(1 + fteGrowth, year - 2025))
    }
  }

  // In businessProjections, use getFTE(year) instead of hardcoded FTEs
  const businessProjections = useMemo(() => {
    return projectionYears.map((year) => {
      const fteForYear = getFTE(year)
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
  }, [expenseParams, fteMode, manualFTEs, fteBase, fteGrowth])

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
    setFilterState([state])
    setChartViewType("projects")
  }

  // Password validation function
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // You can change this password to whatever you want
    const correctPassword = '12'
    
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setShowPasswordModal(false)
      setPasswordError('')
    } else {
      setPasswordError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  // If not authenticated, show password modal
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Plan Dashboard</h2>
            <p className="text-gray-600">Please enter the password to access the dashboard</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
            
            {passwordError && (
              <div className="text-red-600 text-sm">{passwordError}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Contact your administrator for access credentials
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full space-y-4">
      <Tabs value={mainTab} onValueChange={(value) => setMainTab(value as 'financial' | 'strategy')} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="strategy">Company Strategy</TabsTrigger>
          <TabsTrigger value="financial">Financial Overview and Returns</TabsTrigger>
        </TabsList>
        <TabsContent value="strategy">
          <Tabs value={strategyTab} onValueChange={(value) => setStrategyTab(value as 'case' | 'proscons')} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="case">A Case for...</TabsTrigger>
              <TabsTrigger value="proscons">Business Model Comparison</TabsTrigger>
            </TabsList>
            <TabsContent value="case">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pros: ...Becoming Independent? */}
                  <div className="bg-white rounded-lg shadow p-6 border">
                    <h3 className="text-lg font-bold mb-4 text-center border-b pb-2">...Becoming Independent?</h3>
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
                  <div className="bg-white rounded-lg shadow p-6 border">
                    <h3 className="text-lg font-bold mb-4 text-center border-b pb-2">...not Becoming Independent</h3>
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
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Affiliate Model */}
                  <div className="bg-white rounded-lg shadow p-6 border">
                    <h3 className="text-lg font-bold mb-4 text-center border-b pb-2">Affiliate Model</h3>
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
                  <div className="bg-white rounded-lg shadow p-6 border">
                    <h3 className="text-lg font-bold mb-4 text-center border-b pb-2">Independent Model</h3>
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
        <TabsContent value="financial">
          <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'charts' | 'expenses' | 'revenue' | 'cashflow' | 'overview')} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="charts">Project Performance</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
            <div className="flex justify-between items-center">
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
          </div>
                </div>

        <TabsContent value="charts" className="flex-1 overflow-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{processedData.length}</div>
                <p className="text-xs text-muted-foreground">Active projects in pipeline</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contract Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${(processedData.reduce((sum, p) => sum + (p.totalFee || 0), 0) / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  Combined project value ({processedData.filter(p => p.totalFee > 0).length} with fees)
                </p>
                {/* Debug info */}
                <div className="text-xs text-gray-500 mt-1">
                  Raw total: ${processedData.reduce((sum, p) => sum + (p.totalFee || 0), 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Project Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ${(processedData.reduce((sum, p) => sum + (p.totalFee || 0), 0) / (processedData.filter(p => p.totalFee > 0).length || 1) / 1000).toFixed(0)}K
                </div>
                <p className="text-xs text-muted-foreground">Mean contract value (excluding $0 fees)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">States Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(processedData.filter(p => p.state && p.state.trim()).map((p) => p.state)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Geographic reach ({processedData.filter(p => !p.state || !p.state.trim()).length} unknown)
                </p>
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
                </div>
          <Card>
            <CardHeader></CardHeader>
            <CardContent>
              {chartViewType === "map" && (
                <div className="flex gap-4">
                  <div className="flex-1 space-y-4">
                    <StateMap projects={processedData} onStateClick={handleStateClick} />
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
                      <div className="font-semibold flex items-center gap-2">Growth Rate (CAGR)
                        <input
                          type="number"
                          min={0}
                          max={1}
                          step={0.01}
                          value={cagr}
                          onChange={e => setCagr(Number(e.target.value))}
                          className="ml-2 w-20 px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{(cagr * 100).toFixed(1)}%</div>
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

              {chartViewType !== "growth" && chartViewType !== "map" && <div className="mb-4 p-4 bg-muted rounded-lg" />}

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

              {chartViewType === "growth" && (
                <div className="flex gap-4">
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
                                key={payload.year}
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
                      />
                    </LineChart>
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
                    <MultiSelectDropdown
                      options={statuses}
                      selected={filterStatus}
                      onChange={setFilterStatus}
                      title="Statuses"
                    />
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
        </TabsContent>

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
              <span className="text-xs font-medium">Year:</span>
              {projectionYears.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Button>
              ))}
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

        <TabsContent value="revenue" className="flex-1 overflow-auto space-y-4">
          {/* FTE Mode Toggle and Inputs */}
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

        <TabsContent value="cashflow" className="flex-1 overflow-auto space-y-4">
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
        <TabsContent value="overview" className="flex-1 overflow-auto space-y-4">
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
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
