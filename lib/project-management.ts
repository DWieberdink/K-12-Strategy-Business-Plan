import { parseCSV, cleanFee } from "./data-processing"

export const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setProjects: (projects: any[]) => void) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    if (text) {
      const parsedData = parseCSV(text)
      
      // Transform the CSV data into the expected format
      const processedData = parsedData.map((row: any) => ({
        name: row.Project_Name || row.detail_Name || row.Name || row.Project || row.ProjectName || "Unknown Project",
        totalFee: cleanFee(row.Fee || row.fee || row.Value || row.value || row.Amount || row.amount || row.Contract_Value || row.ContractValue || 0),
        state: row.State || row.state || row.ST || row.st || "",
        city: row.City || row.city || "",
        startDate: row.Start_Date || row.StartDate || row.start_date || row.startdate || "",
        endDate: row.Completion_Date || row.EndDate || row.end_date || row.enddate || row.CompletionDate || "",
        dateAwarded: row.Date_Awarded || row.DateAwarded || row.date_awarded || row.dateawarded || row.Start_Date || "",
        status: row.Status || row.status || "Active",
        practiceArea: row["Practice Area"] || row.PracticeArea || row.practice_area || row.practicearea || "",
        reimbursables: cleanFee(row.Reimbursables || row.reimbursables || row.Reimbursable || row.reimbursable || 0),
        studio: row.Studio || row.studio || "",
      }))
      
      setProjects(processedData)
    }
  }
  reader.readAsText(file)
}

export const getQuarterStatus = (projects: any[]) => {
  const currentYear = new Date().getFullYear()
  const quarters = ["Q1", "Q2", "Q3", "Q4"]
  
  return quarters.map(quarter => {
    const quarterProjects = projects.filter((project: any) => {
      const projectDate = new Date(project.Date || project.date || Date.now())
      const projectYear = projectDate.getFullYear()
      const projectMonth = projectDate.getMonth()
      
      if (projectYear !== currentYear) return false
      
      switch (quarter) {
        case "Q1": return projectMonth < 3
        case "Q2": return projectMonth >= 3 && projectMonth < 6
        case "Q3": return projectMonth >= 6 && projectMonth < 9
        case "Q4": return projectMonth >= 9
        default: return false
      }
    })
    
    const totalValue = quarterProjects.reduce((sum: number, project: any) => {
      return sum + (project.Fee || project.fee || 0)
    }, 0)
    
    return {
      quarter,
      count: quarterProjects.length,
      totalValue,
      projects: quarterProjects
    }
  })
}

export const filterProjects = (
  projects: any[], 
  filters: {
    selectedStates: string[]
    selectedStudios: string[]
    selectedStatuses: string[]
    selectedTypes: string[]
  }
) => {
  return projects.filter((project: any) => {
    const state = project.State || project.state || ""
    const studio = project.Studio || project.studio || ""
    const status = project.Status || project.status || ""
    const type = project.Type || project.type || ""
    
    const stateMatch = filters.selectedStates.length === 0 || filters.selectedStates.includes(state)
    const studioMatch = filters.selectedStudios.length === 0 || filters.selectedStudios.includes(studio)
    const statusMatch = filters.selectedStatuses.length === 0 || filters.selectedStatuses.includes(status)
    const typeMatch = filters.selectedTypes.length === 0 || filters.selectedTypes.includes(type)
    
    return stateMatch && studioMatch && statusMatch && typeMatch
  })
}

export const aggregateProjectData = (projects: any[]) => {
  // Aggregate by state
  const stateData = projects.reduce((acc: any, project: any) => {
    const state = project.State || project.state || "Unknown"
    if (!acc[state]) {
      acc[state] = { count: 0, totalValue: 0, projects: [] }
    }
    acc[state].count++
    acc[state].totalValue += project.Fee || project.fee || 0
    acc[state].projects.push(project)
    return acc
  }, {})

  // Aggregate by studio
  const studioData = projects.reduce((acc: any, project: any) => {
    const studio = project.Studio || project.studio || "Unknown"
    if (!acc[studio]) {
      acc[studio] = { count: 0, totalValue: 0, projects: [] }
    }
    acc[studio].count++
    acc[studio].totalValue += project.Fee || project.fee || 0
    acc[studio].projects.push(project)
    return acc
  }, {})

  // Aggregate by status
  const statusData = projects.reduce((acc: any, project: any) => {
    const status = project.Status || project.status || "Unknown"
    if (!acc[status]) {
      acc[status] = { count: 0, totalValue: 0, projects: [] }
    }
    acc[status].count++
    acc[status].totalValue += project.Fee || project.fee || 0
    acc[status].projects.push(project)
    return acc
  }, {})

  return {
    stateData: Object.entries(stateData).map(([state, data]: [string, any]) => ({
      state,
      ...data
    })),
    studioData: Object.entries(studioData).map(([studio, data]: [string, any]) => ({
      studio,
      ...data
    })),
    statusData: Object.entries(statusData).map(([status, data]: [string, any]) => ({
      status,
      ...data
    }))
  }
} 