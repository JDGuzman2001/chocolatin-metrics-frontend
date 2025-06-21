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
import { useVariablesByDate } from "@/hooks/variables-hook"

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Rango de Fechas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha y hora de inicio */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fecha y hora de fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleSearch}
              disabled={!startDate || !endDate}
              className="flex-1"
            >
              Buscar Variables
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Limpiar
            </Button>
          </div>

          {/* Información del rango seleccionado */}
          {(startDateTime && endDateTime) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Rango seleccionado:</strong><br />
                Desde: {formatDateTime(startDateTime)}<br />
                Hasta: {formatDateTime(endDateTime)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla de resultados */}
      {(isSearching || (data && data.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle>
              Variables en el Rango de Fechas
              {lastSearchParams.start && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (Última búsqueda: {formatDateTime(lastSearchParams.start)} - {formatDateTime(lastSearchParams.end)})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <div className="text-center py-4">Buscando variables...</div>}
            
            {error && (
              <div className="text-center py-4 text-red-600">
                Error: {error.message}
              </div>
            )}
            
            {data && data.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No se encontraron variables en el rango de fechas seleccionado
              </div>
            )}
            
            {data && data.length > 0 && (
              <Table>
                <TableCaption>
                  Variables encontradas: {data.length} registros
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Module</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((variable) => (
                    <TableRow key={variable.id}>
                      <TableCell className="font-medium">{variable.address}</TableCell>
                      <TableCell>{variable.comment}</TableCell>
                      <TableCell>{variable.data_type}</TableCell>
                      <TableCell>{variable.value}</TableCell>
                      <TableCell>{variable.symbol}</TableCell>
                      <TableCell>{variable.timestamp}</TableCell>
                      <TableCell>{variable.module}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
