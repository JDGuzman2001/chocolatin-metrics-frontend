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
import { TablePDFButton } from "@/components/ui/pdf-button"
import { useVariables } from "@/hooks/variables-hook"
import { Database, AlertCircle, Loader2 } from "lucide-react"

export default function VariablesTable() {
  const { data, isLoading, error } = useVariables()

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Cargando variables...</p>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400">Error al cargar las variables: {error.message}</p>
      </div>
    </div>
  )

  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Database className="h-8 w-8 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">No hay variables disponibles</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Todas las Variables
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Lista completa de {data.length} variables del sistema
          </p>
        </div>
        <TablePDFButton 
          data={data} 
          title="Reporte - Todas las Variables"
          variant="outline"
          size="sm"
        />
      </div>

      {/* Table */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableCaption className="text-slate-600 dark:text-slate-400">
                Lista completa de variables del sistema
              </TableCaption>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="font-semibold text-slate-900 dark:text-white">Dirección</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-white">Comentario</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-white">Tipo de Dato</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-white">Módulo</TableHead>
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
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      {variable.module}
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
        </CardContent>
      </Card>
    </div>
  )
}