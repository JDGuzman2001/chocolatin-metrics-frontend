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
import { TablePDFButton } from "@/components/ui/pdf-button"
import { useVariablesByModule } from "@/hooks/variables-hook"
import { 
  Database, 
  AlertCircle, 
  Loader2, 
  Cpu, 
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react"

const MODULE_TYPES = [
  "DI16xDC24V",
  "DO8xDC24V_2A", 
  "AI8x13Bit"
]

const MODULE_ICONS = {
  "DI16xDC24V": Database,
  "DO8xDC24V_2A": Zap,
  "AI8x13Bit": Cpu
}

export default function ModuleVariablesTable() {
  const [selectedModule, setSelectedModule] = useState(MODULE_TYPES[0])
  
  const { data, isLoading, error } = useVariablesByModule(selectedModule)

  const handleModuleSelect = (module) => {
    setSelectedModule(module)
  }

  const ModuleIcon = MODULE_ICONS[selectedModule] || Database

  return (
    <div className="space-y-6">
      {/* Module Selection */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-900 dark:text-white">
            <Cpu className="h-5 w-5 mr-2" />
            Seleccionar Módulo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MODULE_TYPES.map((module) => {
              const Icon = MODULE_ICONS[module] || Database
              return (
                <Button
                  key={module}
                  variant={selectedModule === module ? "default" : "outline"}
                  onClick={() => handleModuleSelect(module)}
                  className="flex items-center justify-center space-x-2 h-auto p-4"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{module}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Variables Table */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                <ModuleIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-slate-900 dark:text-white">
                  Variables del Módulo: {selectedModule}
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {data ? `${data.length} variables encontradas` : 'Cargando...'}
                </p>
              </div>
            </div>
            <TablePDFButton 
              data={data} 
              title={`Reporte - Variables del Módulo ${selectedModule}`}
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
                <p className="text-slate-600 dark:text-slate-400">Cargando variables del módulo...</p>
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
                  No se encontraron variables para el módulo {selectedModule}
                </p>
              </div>
            </div>
          )}
          
          {data && data.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption className="text-slate-600 dark:text-slate-400">
                  Variables del módulo {selectedModule} ({data.length} variables)
                </TableCaption>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700">
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Dirección</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Comentario</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Tipo de Dato</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Valor</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Símbolo</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Última Actualización</TableHead>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
