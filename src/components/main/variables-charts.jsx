"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, YAxis } from "recharts"
import { useVariables } from "@/hooks/variables-hook"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function VariablesCharts() {
  const { data, isLoading, error } = useVariables()

  if (isLoading) return <div>Loading charts...</div>
  if (error) return <div>Error loading charts: {error.message}</div>
  if (!data || data.length === 0) return <div>No data available</div>

  // Group data by variable symbol to create individual charts
  const variablesBySymbol = data.reduce((acc, variable) => {
    const symbol = variable.symbol || 'Unknown'
    if (!acc[symbol]) {
      acc[symbol] = []
    }
    
    // Handle different data types properly
    let displayValue = variable.value
    if (variable.data_type === 'BOOL') {
      // BOOL values come as strings "True" or "False"
      displayValue = variable.value === "True" ? 1 : 0
    } else if (variable.data_type === 'WORD') {
      // WORD values come as strings that need to be converted to numbers
      displayValue = parseFloat(variable.value) || 0
    } else {
      // Fallback for any other types
      displayValue = typeof variable.value === 'number' ? variable.value : 0
    }

    acc[symbol].push({
      timestamp: variable.timestamp, // Keep original timestamp
      displayTimestamp: new Date(variable.timestamp).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
      }),
      value: displayValue,
      originalValue: variable.value, // Keep original value for tooltip
      address: variable.address,
      module: variable.module,
      dataType: variable.data_type
    })
    return acc
  }, {})

  // Create chart configuration for each variable
  const createChartConfig = (symbol) => ({
    value: {
      label: symbol,
      color: "var(--chart-1)",
    },
  })

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{data.displayTimestamp}</p>
          <p className="text-sm text-muted-foreground">
            Valor: <span className="font-medium">{data.originalValue}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {data.module} • {data.dataType}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {Object.entries(variablesBySymbol).map(([symbol, chartData]) => {
        const config = createChartConfig(symbol)
        const sortedData = chartData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        const latestValue = sortedData[sortedData.length - 1]?.value || 0
        const previousValue = sortedData[sortedData.length - 2]?.value || 0
        const isBoolean = chartData[0]?.dataType === 'BOOL'
        
        // Calculate trend only for non-boolean values
        let trend = "stable"
        let trendPercentage = 0
        if (!isBoolean && previousValue !== 0) {
          trend = latestValue > previousValue ? "up" : latestValue < previousValue ? "down" : "stable"
          trendPercentage = ((latestValue - previousValue) / previousValue * 100).toFixed(1)
        }

        // Format latest value display
        const formatLatestValue = (value, dataType) => {
          if (dataType === 'BOOL') {
            return value === 1 ? 'True' : 'False'
          }
          return value
        }

        return (
          <Card key={symbol} className="w-full">
            <CardHeader>
              <CardTitle className="text-sm font-medium truncate">{symbol}</CardTitle>
              <CardDescription className="text-xs">
                {chartData[0]?.module} • {chartData[0]?.dataType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={config} className="h-[250px]">
                {isBoolean ? (
                  <BarChart accessibilityLayer data={sortedData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="timestamp"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')}`
                      }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value === 1 ? 'True' : 'False'}
                      domain={[0, 1]}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<CustomTooltip />}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="var(--color-value)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart accessibilityLayer data={sortedData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="timestamp"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')}`
                      }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<CustomTooltip />}
                    />
                    <Line 
                      dataKey="value" 
                      fill="var(--color-value)" 
                      stroke="var(--color-value)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-value)", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "var(--color-value)", strokeWidth: 2 }}
                    />
                  </LineChart>
                )}
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              {!isBoolean && (
                <div className="flex gap-2 leading-none font-medium">
                  {trend === "up" ? "Trending up" : trend === "down" ? "Trending down" : "Stable"} 
                  {trend !== "stable" && ` by ${Math.abs(trendPercentage)}%`}
                  {trend !== "stable" && <TrendingUp className={`h-4 w-4 ${trend === "down" ? "rotate-180" : ""}`} />}
                </div>
              )}
              <div className="text-muted-foreground leading-none text-xs">
                Address: {chartData[0]?.address}
              </div>
              <div className="text-muted-foreground leading-none text-xs">
                Latest value: {formatLatestValue(latestValue, chartData[0]?.dataType)}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
} 