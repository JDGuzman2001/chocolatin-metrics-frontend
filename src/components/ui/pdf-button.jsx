import { Button } from "./button"
import { Download, FileText, BarChart3, Calendar, Database } from "lucide-react"
import { usePDFGenerator } from "./pdf-generator"

export function PDFButton({ 
  data, 
  title, 
  variant = "default", 
  size = "default",
  type = "table",
  className = "",
  disabled = false 
}) {
  const { generateReport, generateTableReport } = usePDFGenerator()

  const handleGeneratePDF = async () => {
    if (!data || data.length === 0) {
      alert('No hay datos disponibles para generar el reporte')
      return
    }

    try {
      switch (type) {
        case 'table':
          generateTableReport(data, title)
          break
        case 'complete':
          generateReport(data, title, { includeCharts: false })
          break
        case 'charts':
          // Para gráficos necesitaríamos referencias a los elementos DOM
          alert('Generación de gráficos requiere implementación adicional')
          break
        default:
          generateTableReport(data, title)
      }
    } catch (error) {
      console.error('Error al generar PDF:', error)
      alert('Error al generar el reporte PDF')
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'table':
        return <Database className="h-4 w-4" />
      case 'charts':
        return <BarChart3 className="h-4 w-4" />
      case 'date':
        return <Calendar className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGeneratePDF}
      disabled={disabled || !data || data.length === 0}
      className={`gap-2 ${className}`}
    >
      {getIcon()}
      <Download className="h-4 w-4" />
      Generar PDF
    </Button>
  )
}

// Componente específico para reporte de tabla
export function TablePDFButton({ data, title, ...props }) {
  return (
    <PDFButton
      data={data}
      title={title}
      type="table"
      {...props}
    />
  )
}

// Componente específico para reporte completo
export function CompletePDFButton({ data, title, ...props }) {
  return (
    <PDFButton
      data={data}
      title={title}
      type="complete"
      {...props}
    />
  )
}

// Componente específico para reporte de gráficos
export function ChartsPDFButton({ data, title, ...props }) {
  return (
    <PDFButton
      data={data}
      title={title}
      type="charts"
      {...props}
    />
  )
} 