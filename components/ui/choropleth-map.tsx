import React, { useMemo } from 'react'

interface ChoroplethMapProps {
  projects: any[]
  onStateClick: (state: string) => void
}

// More accurate state coordinates for better visualization
const STATE_COORDINATES = {
  'CA': { name: 'California', x: 15, y: 35, width: 8, height: 12 },
  'TX': { name: 'Texas', x: 55, y: 40, width: 12, height: 10 },
  'FL': { name: 'Florida', x: 80, y: 50, width: 8, height: 8 },
  'NY': { name: 'New York', x: 85, y: 20, width: 6, height: 8 },
  'PA': { name: 'Pennsylvania', x: 80, y: 25, width: 8, height: 8 },
  'IL': { name: 'Illinois', x: 70, y: 30, width: 8, height: 6 },
  'OH': { name: 'Ohio', x: 80, y: 30, width: 6, height: 6 },
  'GA': { name: 'Georgia', x: 75, y: 40, width: 8, height: 8 },
  'NC': { name: 'North Carolina', x: 80, y: 35, width: 8, height: 8 },
  'MI': { name: 'Michigan', x: 75, y: 20, width: 8, height: 8 },
  'NJ': { name: 'New Jersey', x: 87, y: 28, width: 4, height: 4 },
  'VA': { name: 'Virginia', x: 80, y: 30, width: 8, height: 8 },
  'WA': { name: 'Washington', x: 15, y: 15, width: 8, height: 8 },
  'AZ': { name: 'Arizona', x: 20, y: 35, width: 8, height: 8 },
  'MA': { name: 'Massachusetts', x: 90, y: 20, width: 4, height: 4 },
  'TN': { name: 'Tennessee', x: 75, y: 35, width: 8, height: 8 },
  'IN': { name: 'Indiana', x: 75, y: 30, width: 8, height: 6 },
  'MO': { name: 'Missouri', x: 65, y: 35, width: 8, height: 6 },
  'MD': { name: 'Maryland', x: 85, y: 30, width: 4, height: 4 },
  'CO': { name: 'Colorado', x: 40, y: 30, width: 8, height: 8 },
  'MN': { name: 'Minnesota', x: 65, y: 15, width: 8, height: 8 },
  'WI': { name: 'Wisconsin', x: 70, y: 20, width: 8, height: 8 },
  'LA': { name: 'Louisiana', x: 70, y: 45, width: 8, height: 6 },
  'AL': { name: 'Alabama', x: 80, y: 45, width: 8, height: 8 },
  'SC': { name: 'South Carolina', x: 80, y: 40, width: 6, height: 8 },
  'KY': { name: 'Kentucky', x: 75, y: 35, width: 8, height: 6 },
  'OR': { name: 'Oregon', x: 15, y: 20, width: 8, height: 8 },
  'OK': { name: 'Oklahoma', x: 60, y: 40, width: 8, height: 6 },
  'CT': { name: 'Connecticut', x: 92, y: 25, width: 4, height: 4 },
  'IA': { name: 'Iowa', x: 65, y: 25, width: 8, height: 8 },
  'MS': { name: 'Mississippi', x: 70, y: 45, width: 8, height: 6 },
  'AR': { name: 'Arkansas', x: 70, y: 40, width: 8, height: 8 },
  'KS': { name: 'Kansas', x: 60, y: 35, width: 8, height: 6 },
  'UT': { name: 'Utah', x: 30, y: 30, width: 8, height: 8 },
  'NV': { name: 'Nevada', x: 20, y: 25, width: 8, height: 8 },
  'NM': { name: 'New Mexico', x: 35, y: 40, width: 8, height: 6 },
  'WV': { name: 'West Virginia', x: 80, y: 30, width: 6, height: 6 },
  'NE': { name: 'Nebraska', x: 55, y: 25, width: 8, height: 8 },
  'ID': { name: 'Idaho', x: 25, y: 20, width: 8, height: 8 },
  'HI': { name: 'Hawaii', x: 20, y: 55, width: 8, height: 4 },
  'NH': { name: 'New Hampshire', x: 90, y: 15, width: 4, height: 4 },
  'ME': { name: 'Maine', x: 92, y: 10, width: 6, height: 8 },
  'RI': { name: 'Rhode Island', x: 91, y: 28, width: 2, height: 2 },
  'MT': { name: 'Montana', x: 35, y: 15, width: 8, height: 8 },
  'DE': { name: 'Delaware', x: 87, y: 30, width: 3, height: 3 },
  'SD': { name: 'South Dakota', x: 55, y: 20, width: 8, height: 8 },
  'ND': { name: 'North Dakota', x: 55, y: 15, width: 8, height: 8 },
  'AK': { name: 'Alaska', x: 10, y: 5, width: 12, height: 12 },
  'VT': { name: 'Vermont', x: 87, y: 15, width: 4, height: 4 },
  'WY': { name: 'Wyoming', x: 40, y: 20, width: 8, height: 8 },
  'DC': { name: 'District of Columbia', x: 85, y: 32, width: 1, height: 1 },
}

export const ChoroplethMap: React.FC<ChoroplethMapProps> = ({ projects, onStateClick }) => {
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

  // Calculate color intensity based on total value
  const getColorIntensity = (totalValue: number) => {
    const maxValue = Math.max(...Array.from(stateData.values()).map(d => d.totalValue))
    if (maxValue === 0) return 0
    return Math.min(0.9, (totalValue / maxValue) * 0.8 + 0.1) // 0.1 to 0.9 range
  }

  // Get color for state based on value
  const getStateColor = (totalValue: number) => {
    if (totalValue === 0) return '#e5e7eb' // Gray for no projects
    
    const intensity = getColorIntensity(totalValue)
    if (intensity < 0.3) return '#bbf7d0' // Light green
    if (intensity < 0.5) return '#86efac' // Medium green
    if (intensity < 0.7) return '#4ade80' // Green
    if (intensity < 0.9) return '#22c55e' // Dark green
    return '#16a34a' // Very dark green
  }

  const totalValue = Array.from(stateData.values()).reduce((sum, d) => sum + d.totalValue, 0)
  const statesWithProjects = Array.from(stateData.values()).filter(d => d.totalValue > 0).length
  const highestValueState = Array.from(stateData.entries()).sort((a, b) => b[1].totalValue - a[1].totalValue)[0]?.[0]

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">Geographic Distribution by State</h3>
        <div className="relative">
          <svg width="100%" height="600" viewBox="0 0 100 65" className="border rounded bg-gray-50">
            {/* Background */}
            <rect width="100" height="65" fill="#f8fafc" />
            
            {/* State rectangles */}
            {Object.entries(STATE_COORDINATES).map(([stateCode, coords]) => {
              const stateDataInfo = stateData.get(stateCode)
              const totalValue = stateDataInfo?.totalValue || 0
              const count = stateDataInfo?.count || 0
              const color = getStateColor(totalValue)
              const textColor = totalValue > 0 ? "#ffffff" : "#6b7280"
              
              return (
                <g key={stateCode}>
                  <rect
                    x={coords.x}
                    y={coords.y}
                    width={coords.width}
                    height={coords.height}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="0.2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onStateClick(stateCode)}
                  />
                  <title>{`${coords.name}: $${totalValue.toLocaleString()} (${count} projects)`}</title>
                  <text
                    x={coords.x + coords.width / 2}
                    y={coords.y + coords.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="1.2"
                    fill={textColor}
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {stateCode}
                  </text>
                </g>
              )
            })}
          </svg>
          
          {/* Enhanced Legend */}
          <div className="mt-4 flex items-center justify-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded border"></div>
              <span>No Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span>Low Value</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-300 rounded"></div>
              <span>Medium Value</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>High Value</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-700 rounded"></div>
              <span>Very High Value</span>
            </div>
          </div>
          
          {/* State Summary */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <div className="font-semibold mb-2">Summary:</div>
              <div>States with projects: {statesWithProjects}</div>
              <div>Total value across all states: ${totalValue.toLocaleString()}</div>
              <div>Highest value state: {highestValueState && STATE_COORDINATES[highestValueState as keyof typeof STATE_COORDINATES]?.name || 'None'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 