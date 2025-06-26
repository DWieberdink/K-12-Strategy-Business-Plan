"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"

// Aggregate project data by project name
const aggregateProjectData = () => {
  // Sample aggregated data based on the updated sheet
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

// Calculate monthly revenue distribution
const calculateMonthlyRevenue = (projects: any[]) => {
  const monthlyData = new Map()

  projects.forEach((project) => {
    const startDate = new Date(project.startDate)
    const endDate = new Date(project.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return

    // Calculate project duration in months
    const durationMonths = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)),
    )
    const monthlyRevenue = project.totalFee / durationMonths

    // Distribute revenue across project timeline
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

  // Sort by month
  return Array.from(monthlyData.values()).sort((a, b) => a.month.localeCompare(b.month))
}

// Function to get quarter from date
const getQuarter = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const quarter = Math.ceil(month / 3)
  return `Q${quarter} ${year}`
}

export default function ProjectSalesChart() {
  const [sortBy, setSortBy] = useState<"fee" | "date" | "name">("fee")
  const [filterState, setFilterState] = useState<string>("all")
  const [viewType, setViewType] = useState<"projects" | "monthly" | "quarterly" | "growth">("projects")

  const projectData = useMemo(() => aggregateProjectData(), [])

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

    // Sort quarters chronologically
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
    // Create cumulative growth data by award date
    const sortedProjects = [...projectData]
      .filter((p) => p.dateAwarded)
      .sort((a, b) => new Date(a.dateAwarded).getTime() - new Date(b.dateAwarded).getTime())

    const cumulativeData = []
    let runningTotal = 0

    // Group by year for cleaner visualization
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

    // Convert to cumulative array
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

    // Use fixed 30% CAGR for projection
    const cagr = 0.3 // 30% annual growth rate

    if (cumulativeData.length >= 1) {
      const lastYear = cumulativeData[cumulativeData.length - 1]
      const currentYear = Number.parseInt(lastYear.year)

      // Project to 2030 using 30% CAGR
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

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Project Revenue Analysis</CardTitle>
          <CardDescription>
            Educational facility projects showing revenue distribution across {processedData.length} active projects
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="flex gap-2">
              <Button
                variant={viewType === "projects" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("projects")}
              >
                By Project
              </Button>
              <Button
                variant={viewType === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("monthly")}
              >
                Monthly Revenue
              </Button>
              <Button
                variant={viewType === "quarterly" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("quarterly")}
              >
                Quarterly Awards
              </Button>
              <Button
                variant={viewType === "growth" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("growth")}
              >
                Growth Trend
              </Button>
            </div>
            {viewType === "projects" && (
              <>
                <div className="flex gap-2">
                  <Button variant={sortBy === "fee" ? "default" : "outline"} size="sm" onClick={() => setSortBy("fee")}>
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
          {viewType === "growth" && growthTrendData.length > 0 && (
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
                      growthTrendData[growthTrendData.findIndex((d) => d.isProjected) - 1]?.cumulativeValue / 1000000 ||
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

          {viewType !== "growth" && (
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

          {viewType === "projects" && (
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

          {viewType === "monthly" && (
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

          {viewType === "quarterly" && (
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

          {viewType === "growth" && (
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
                            <p className="text-lg font-bold text-primary">${data.cumulativeValue.toLocaleString()}</p>
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
                                <p className="text-sm text-muted-foreground mt-2">Projects ({data.projects.length}):</p>
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
    </div>
  )
}
