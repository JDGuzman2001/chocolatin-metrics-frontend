"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, YAxis } from "recharts"
import { useVariables } from "@/hooks/variables-hook"
import { ChartsPDFButton } from "@/components/ui/pdf-button"

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

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Cargando gráficos...</p>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-600 dark:text-red-400">Error al cargar los gráficos: {error.message}</p>
      </div>
    </div>
  )
  
  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-slate-400 mb-4">📊</div>
        <p className="text-slate-600 dark:text-slate-400">No hay datos disponibles para mostrar</p>
      </div>
    </div>
  )

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
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm text-slate-900 dark:text-white">{data.displayTimestamp}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Valor: <span className="font-medium text-slate-900 dark:text-white">{data.originalValue}</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {data.module} • {data.dataType}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header with PDF button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Gráficos de Variables
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Visualización temporal de {Object.keys(variablesBySymbol).length} variables del sistema
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(variablesBySymbol).map(([symbol, chartData]) => {
          const config = createChartConfig(symbol)
          const sortedData = chartData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          const latestValue = sortedData[sortedData.length - 1]?.value || 0
          const previousValue = sortedData[sortedData.length - 2]?.value || 0
          const isBoolean = chartData[0]?.dataType === 'BOOL'
          
          // Calculate trend only for non-boolean values
          let trend = "stable"
          let trendPercentage = 0
          let trendIcon = <Minus className="h-4 w-4 text-slate-500" />
          let trendColor = "text-slate-500"
          
          if (!isBoolean && previousValue !== 0) {
            trend = latestValue > previousValue ? "up" : latestValue < previousValue ? "down" : "stable"
            trendPercentage = ((latestValue - previousValue) / previousValue * 100).toFixed(1)
            
            if (trend === "up") {
              trendIcon = <TrendingUp className="h-4 w-4 text-green-600" />
              trendColor = "text-green-600"
            } else if (trend === "down") {
              trendIcon = <TrendingDown className="h-4 w-4 text-red-600" />
              trendColor = "text-red-600"
            }
          }

          // Format latest value display
          const formatLatestValue = (value, dataType) => {
            if (dataType === 'BOOL') {
              return value === 1 ? 'True' : 'False'
            }
            return value
          }

          return (
            <Card key={symbol} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white truncate">
                      {symbol}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                      {chartData[0]?.module} • {chartData[0]?.dataType}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {formatLatestValue(latestValue, chartData[0]?.dataType)}
                    </div>
                    {!isBoolean && trend !== "stable" && (
                      <div className={`flex items-center text-xs ${trendColor}`}>
                        {trendIcon}
                        <span className="ml-1">{Math.abs(trendPercentage)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ChartContainer config={config} className="h-[200px]">
                  {isBoolean ? (
                    <BarChart accessibilityLayer data={sortedData}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
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
                        height={60}
                        fontSize={11}
                        tick={{ fill: 'rgb(148, 163, 184)' }}
                      />
                      <YAxis 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => value === 1 ? 'True' : 'False'}
                        domain={[0, 1]}
                        fontSize={11}
                        tick={{ fill: 'rgb(148, 163, 184)' }}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<CustomTooltip />}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="var(--chart-1)" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  ) : (
                    <LineChart accessibilityLayer data={sortedData}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
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
                        height={60}
                        fontSize={11}
                        tick={{ fill: 'rgb(148, 163, 184)' }}
                      />
                      <YAxis 
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                        tick={{ fill: 'rgb(148, 163, 184)' }}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<CustomTooltip />}
                      />
                      <Line 
                        dataKey="value" 
                        fill="var(--chart-1)" 
                        stroke="var(--chart-1)"
                        strokeWidth={2}
                        dot={{ fill: "var(--chart-1)", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: "var(--chart-1)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  )}
                </ChartContainer>
              </CardContent>
              
              <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between w-full text-xs text-slate-600 dark:text-slate-400">
                  <span>Address: {chartData[0]?.address}</span>
                  <span>{sortedData.length} registros</span>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 