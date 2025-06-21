import { useState } from "react"
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
import { useVariablesByModule } from "@/hooks/variables-hook"

const MODULE_TYPES = [
  "DI16xDC24V",
  "DO8xDC24V_2A", 
  "AI8x13Bit"
]

export default function ModuleVariablesTable() {
  const [selectedModule, setSelectedModule] = useState(MODULE_TYPES[0])
  
  const { data, isLoading, error } = useVariablesByModule(selectedModule)

  const handleModuleSelect = (module) => {
    setSelectedModule(module)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Módulo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {MODULE_TYPES.map((module) => (
              <Button
                key={module}
                variant={selectedModule === module ? "default" : "outline"}
                onClick={() => handleModuleSelect(module)}
                className="flex-1"
              >
                {module}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variables del Módulo: {selectedModule}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-center py-4">Cargando variables...</div>}
          
          {error && (
            <div className="text-center py-4 text-red-600">
              Error: {error.message}
            </div>
          )}
          
          {data && data.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No se encontraron variables para el módulo {selectedModule}
            </div>
          )}
          
          {data && data.length > 0 && (
            <Table>
              <TableCaption>
                Variables del módulo {selectedModule} ({data.length} variables)
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Timestamp</TableHead>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
