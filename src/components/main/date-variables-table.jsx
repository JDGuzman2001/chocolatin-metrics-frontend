import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TablePDFButton } from "@/components/ui/pdf-button"
import { useVariablesByDate } from "@/hooks/variables-hook"
import { 
  Calendar, 
  Clock, 
  Search, 
  RotateCcw, 
  AlertCircle, 
  Loader2, 
  Database,
  CheckCircle,
  XCircle
} from "lucide-react"

export default function DateVariablesTable() {
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("00:00")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("23:59")
  const [isSearching, setIsSearching] = useState(false)
  const [lastSearchParams, setLastSearchParams] = useState({ start: "", end: "" })
  
  // Combinar fecha y hora para crear el timestamp completo
  const startDateTime = startDate && startTime ? `${startDate}T${startTime}:00` : ""
  const endDateTime = endDate && endTime ? `${endDate}T${endTime}:59` : ""
  
  // Usar los parámetros de la última búsqueda exitosa para mantener los datos
  const searchStartDate = isSearching ? startDateTime : lastSearchParams.start
  const searchEndDate = isSearching ? endDateTime : lastSearchParams.end
  
  const { data, isLoading, error, refetch } = useVariablesByDate(searchStartDate, searchEndDate)

  const handleSearch = () => {
    if (startDate && endDate && startDateTime && endDateTime) {
      setIsSearching(true)
      setLastSearchParams({ start: startDateTime, end: endDateTime })
      refetch()
    }
  }

  const handleReset = () => {
    setStartDate("")
    setStartTime("00:00")
    setEndDate("")
    setEndTime("23:59")
    setIsSearching(false)
    setLastSearchParams({ start: "", end: "" })
  }

  // Restaurar el estado de búsqueda si hay datos previos
  useEffect(() => {
    if (data && data.length > 0 && lastSearchParams.start && lastSearchParams.end) {
      setIsSearching(true)
    }
  }, [data, lastSearchParams])

  const formatDateTime = (dateTime) => {
    if (!dateTime) return ""
    const date = new Date(dateTime)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selection */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-900 dark:text-white">
            <Calendar className="h-5 w-5 mr-2" />
            Seleccionar Rango de Fechas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha y hora de inicio */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Fecha y hora de fin */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Fecha de Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mt-6">
            <Button 
              onClick={handleSearch}
              disabled={!startDate || !endDate}
              className="flex items-center space-x-2 flex-1"
            >
              <Search className="h-4 w-4" />
              <span>Buscar Variables</span>
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex items-center space-x-2 flex-1"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Limpiar</span>
            </Button>
          </div>

          {/* Información del rango seleccionado */}
          {(startDateTime && endDateTime) && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Rango seleccionado:</strong><br />
                Desde: {formatDateTime(startDateTime)}<br />
                Hasta: {formatDateTime(endDateTime)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Table */}
      {(isSearching || (data && data.length > 0)) && (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-500">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900 dark:text-white">
                    Variables en el Rango de Fechas
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {data ? `${data.length} variables encontradas` : 'Buscando...'}
                    {lastSearchParams.start && (
                      <span className="ml-2">
                        • {formatDateTime(lastSearchParams.start)} - {formatDateTime(lastSearchParams.end)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <TablePDFButton 
                data={data} 
                title={`Reporte - Variables por Fecha (${formatDateTime(lastSearchParams.start)} - ${formatDateTime(lastSearchParams.end)})`}
                variant="outline"
                size="sm"
                disabled={isLoading || !data || data.length === 0}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Buscando variables...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 dark:text-red-400">Error: {error.message}</p>
                </div>
              </div>
            )}
            
            {data && data.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Database className="h-8 w-8 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No se encontraron variables en el rango de fechas seleccionado
                  </p>
                </div>
              </div>
            )}
            
            {data && data.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption className="text-slate-600 dark:text-slate-400">
                    Variables encontradas: {data.length} registros
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="border-slate-200 dark:border-slate-700">
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Dirección</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Comentario</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Tipo de Dato</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Valor</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Símbolo</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Timestamp</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Módulo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((variable, index) => (
                      <TableRow 
                        key={variable.id || index}
                        className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <TableCell className="font-mono text-sm text-slate-900 dark:text-white">
                          {variable.address}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">
                          {variable.comment || '-'}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            variable.data_type === 'BOOL' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : variable.data_type === 'WORD'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                          }`}>
                            {variable.data_type}
                          </span>
                        </TableCell>
                        <TableCell>
                          {variable.data_type === 'BOOL' ? (
                            <span className={`inline-flex items-center space-x-1 ${
                              variable.value === "True" 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {variable.value === "True" ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              <span className="font-medium">{variable.value}</span>
                            </span>
                          ) : (
                            <span className="font-medium text-slate-900 dark:text-white">
                              {variable.value}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 dark:text-white">
                          {variable.symbol || '-'}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                          {new Date(variable.timestamp).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">
                          {variable.module}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
