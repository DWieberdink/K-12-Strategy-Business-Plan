import React, { useEffect, useRef, useState } from "react"
import * as d3 from 'd3'
import { stateCoordinates } from "@/lib/data-processing"
import { Spinner } from "@/components/ui/spinner"

interface StateMapProps {
  projects: any[]
  onStateClick: (state: string) => void
}

export const StateMap = ({ projects, onStateClick }: StateMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMap = () => {
      if (!mapRef.current) return

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      setIsLoading(true)
      setError(null)

      // Clear previous content
      d3.select(mapRef.current).selectAll("*").remove()

      // Set up dimensions
      const width = mapRef.current.clientWidth
      const height = 400

      // Create SVG
      const svg = d3.select(mapRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)

      // Create projection
      const projection = d3.geoAlbersUsa()

      // Load US states GeoJSON with timeout
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        setError("Map loading timeout. Please refresh the page.")
        timeoutRef.current = null
      }, 10000) // 10 second timeout

      fetch('/USStates1.geojson')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load map data: ${response.status}`)
          }
          return response.json()
        })
        .then(usStates => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          // Clear any error state since fetch succeeded
          setError(null)
          // Fit the projection to the actual features
          projection.fitSize([width, height], usStates)

          // DEBUG: Log incoming projects
          console.log('StateMap projects:', projects)
          // Process project data by state
          const stateData = projects.reduce((acc: any, project: any) => {
            const state = project.state // always lowercase 'state' in processedData
            if (state && stateCoordinates[state]) {
              if (!acc[state]) {
                acc[state] = { count: 0, totalValue: 0, projects: [] }
              }
              acc[state].count++
              acc[state].totalValue += project.totalFee || 0 // use totalFee, not Fee
              acc[state].projects.push(project)
            }
            return acc
          }, {})

          // Create color scale
          const maxValue = Math.max(...Object.values(stateData).map((d: any) => d.totalValue), 1)
          const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, maxValue])

          // Create path generator
          const path = d3.geoPath().projection(projection)

          // Draw states
          svg.selectAll("path")
            .data(usStates.features)
            .enter()
            .append("path")
            .attr("d", (d: any) => path(d) || "")
            .attr("fill", (d: any) => {
              const stateCode = d.properties.STUSPS
              const data = stateData[stateCode]
              return data ? colorScale(data.totalValue) : "#f0f0f0"
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .style("cursor", "pointer")
            .on("click", function(event, d: any) {
              const stateCode = d.properties.STUSPS
              if (stateData[stateCode]) {
                onStateClick(stateCode)
              }
            })
            .on("mouseover", function(event, d: any) {
              const stateCode = d.properties.STUSPS
              const data = stateData[stateCode]
              if (data) {
                d3.select(this).attr("stroke", "#000").attr("stroke-width", 2)
                
                // Show tooltip
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
                  <strong>${d.properties.STATE_NAME}</strong><br/>
                  Projects: ${data.count}<br/>
                  Total Value: $${(data.totalValue / 1000).toFixed(0)}K
                `)
                  .style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 10) + "px")
              }
            })
            .on("mouseout", function() {
              d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.5)
              d3.selectAll(".tooltip").remove()
            })

          // Add legend
          const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - 100}, 20)`)

          const legendData = [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue]

          legend.selectAll("rect")
            .data(legendData.slice(0, -1))
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * 20)
            .attr("width", 20)
            .attr("height", 18)
            .attr("fill", (d) => colorScale(d))

          legend.selectAll("text")
            .data(legendData)
            .enter()
            .append("text")
            .attr("x", 25)
            .attr("y", (d, i) => i * 20 + 9)
            .attr("dy", "0.35em")
            .style("font-size", "10px")
            .text((d) => `$${(d / 1000).toFixed(0)}K`)

          setIsLoading(false)
        })
        .catch(error => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          console.error("Error loading map data:", error)
          setError("Failed to load map data. Please refresh the page.")
          setIsLoading(false)
        })
    }

    loadMap()

    // Handle resize
    const handleResize = () => {
      if (mapRef.current) {
        loadMap()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [projects, onStateClick])

  return (
    <div className="w-full h-96 border rounded-lg overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <Spinner className="h-8 w-8" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

// Helper function to clean fee values (imported from data-processing)
const cleanFee = (str: string | number) => {
  if (!str) return 0
  if (typeof str === "number") return str

  const input = str.toString().trim().toLowerCase()
  
  // Handle common text formats that should be converted to dollar values
  const textToValueMap: { [key: string]: number } = {
    "number": 500000,
    "general": 750000,
    "accounting": 300000,
    "small": 250000,
    "medium": 500000,
    "large": 1000000,
    "extra large": 2000000,
    "xl": 2000000,
    "xxl": 3000000,
    "k12": 400000,
    "higher education": 750000,
    "university": 800000,
    "school district": 450000,
    "public school": 400000,
    "private school": 350000,
    "college": 600000,
    "community college": 300000,
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
  cleaned = cleaned.replace(/[\$€£¥₹]/g, '')
  cleaned = cleaned.replace(/k\b/gi, '000')
  cleaned = cleaned.replace(/m\b/gi, '000000')
  cleaned = cleaned.replace(/b\b/gi, '000000000')
  cleaned = cleaned.replace(/thousand/gi, '000')
  cleaned = cleaned.replace(/million/gi, '000000')
  cleaned = cleaned.replace(/billion/gi, '000000000')
  
  // Handle various number formats
  cleaned = cleaned.replace(/[\s,]/g, '')
  
  // Handle parentheses (negative numbers)
  if (cleaned.includes('(') && cleaned.includes(')')) {
    cleaned = '-' + cleaned.replace(/[()]/g, '')
  }
  
  // Handle different decimal separators (comma vs period)
  if (cleaned.includes(',') && !cleaned.includes('.')) {
    cleaned = cleaned.replace(',', '.')
  }
  
  // Remove all non-numeric characters except decimal points and negative signs
  cleaned = cleaned.replace(/[^\d.-]/g, "")

  // Handle cases where there might be multiple decimal points
  const parts = cleaned.split(".")
  if (parts.length > 2) {
    cleaned = parts.slice(0, -1).join("") + "." + parts[parts.length - 1]
  }

  // Parse the cleaned string
  const parsed = Number.parseFloat(cleaned)

  // Return 0 if parsing failed, otherwise return the parsed number
  return isNaN(parsed) ? 0 : parsed
} 