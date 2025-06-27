// State coordinates for mapping
export const stateCoordinates: { [key: string]: { lat: number; lng: number; name: string } } = {
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
export const cleanFee = (str: string | number) => {
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

export const aggregateProjectData = () => {
  // Original project data for charts tab - using actual CSV data
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

export const calculateMonthlyRevenue = (projects: any[]) => {
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

export const getQuarter = (dateString: string) => {
  const date = new Date(dateString)
  const month = date.getMonth()
  if (month < 3) return "Q1"
  if (month < 6) return "Q2"
  if (month < 9) return "Q3"
  return "Q4"
}

export const parseCSV = (csvText: string) => {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const data = lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    
    // Transform the CSV row to match the expected project structure
    return {
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
    }
  })
  return data
} 