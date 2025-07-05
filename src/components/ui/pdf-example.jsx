import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { TablePDFButton, CompletePDFButton, ChartsPDFButton } from "./pdf-button"
import { AdvancedPDFGenerator } from "./advanced-pdf-generator"

export function PDFExample({ data, title = "Ejemplo de Reportes" }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generadores de PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay datos disponibles para generar reportes</p>
        </CardContent>
      </Card>
    )
  }

  const uniqueVariables = data.reduce((acc, variable) => {
    if (!acc.find(v => v.symbol === variable.symbol)) {
      acc.push(variable);
    }
    return acc;
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generadores de PDF - {title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Reporte de Tabla Simple */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Reporte de Tabla</h4>
            <p className="text-xs text-muted-foreground">
              Tabla simple con todas las variables
            </p>
            <TablePDFButton 
              data={data} 
              title={`Reporte Tabla - ${title}`}
              variant="outline"
              size="sm"
            />
          </div>

          {/* Reporte Completo */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Reporte Completo</h4>
            <p className="text-xs text-muted-foreground">
              Incluye estadísticas y análisis
            </p>
            <CompletePDFButton 
              data={data} 
              title={`Reporte Completo - ${title}`}
              variant="outline"
              size="sm"
            />
          </div>

          {/* Reporte Avanzado */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Reporte Avanzado</h4>
            <p className="text-xs text-muted-foreground">
              Análisis detallado con conclusiones
            </p>
            <AdvancedPDFGenerator 
              data={data} 
              title={`Reporte Avanzado - ${title}`}
              variant="outline"
              size="sm"
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Tipos de Reportes Disponibles:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>Reporte de Tabla:</strong> Lista simple de variables con sus valores</li>
            <li><strong>Reporte Completo:</strong> Incluye estadísticas generales y análisis por tipo de variable</li>
            <li><strong>Reporte Avanzado:</strong> Análisis completo con conclusiones y recomendaciones</li>
          </ul>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{uniqueVariables.length}</div>
            <div className="text-xs text-gray-600">Total Variables</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {uniqueVariables.filter(v => v.data_type === 'BOOL').length}
            </div>
            <div className="text-xs text-gray-600">Variables BOOL</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {uniqueVariables.filter(v => v.data_type === 'WORD').length}
            </div>
            <div className="text-xs text-gray-600">Variables WORD</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {[...new Set(uniqueVariables.map(v => v.module))].length}
            </div>
            <div className="text-xs text-gray-600">Módulos Únicos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 