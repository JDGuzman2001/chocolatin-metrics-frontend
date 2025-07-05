import { PDFGenerator } from './pdf-generator'
import { Button } from './button'
import { Download, FileText } from 'lucide-react'

export function AdvancedPDFGenerator({ 
  data, 
  title, 
  chartRefs = {}, 
  variant = "default",
  size = "default",
  className = ""
}) {
  const generateAdvancedReport = async () => {
    if (!data || data.length === 0) {
      alert('No hay datos disponibles para generar el reporte')
      return
    }

    try {
      const generator = new PDFGenerator()
      
      // Agregar título y descripción
      generator.addTitle(title)
      generator.addText(`Reporte avanzado generado automáticamente por el sistema.`)
      generator.addText(`Este reporte incluye estadísticas detalladas, tablas de datos y gráficos de las variables del sistema.`)
      generator.yPosition += 10

      // Agregar estadísticas generales
      generator.addStatistics(data)

      // Agregar análisis por tipo de variable
      generator.addSubtitle('Análisis por Tipo de Variable')
      
      const boolVariables = data.filter(v => v.data_type === 'BOOL')
      const wordVariables = data.filter(v => v.data_type === 'WORD')
      
      generator.addText(`Variables BOOL (Digitales): ${boolVariables.length}`)
      if (boolVariables.length > 0) {
        const trueCount = boolVariables.filter(v => v.value === 'True').length
        const falseCount = boolVariables.filter(v => v.value === 'False').length
        generator.addText(`  - Valores True: ${trueCount}`)
        generator.addText(`  - Valores False: ${falseCount}`)
      }
      
      generator.addText(`Variables WORD (Analógicas): ${wordVariables.length}`)
      if (wordVariables.length > 0) {
        const values = wordVariables.map(v => parseFloat(v.value) || 0)
        const min = Math.min(...values)
        const max = Math.max(...values)
        const avg = values.reduce((a, b) => a + b, 0) / values.length
        generator.addText(`  - Valor mínimo: ${min.toFixed(2)}`)
        generator.addText(`  - Valor máximo: ${max.toFixed(2)}`)
        generator.addText(`  - Valor promedio: ${avg.toFixed(2)}`)
      }

      // Agregar análisis por módulo
      generator.addSubtitle('Análisis por Módulo')
      const modules = [...new Set(data.map(v => v.module))]
      modules.forEach(module => {
        const moduleVars = data.filter(v => v.module === module)
        const boolCount = moduleVars.filter(v => v.data_type === 'BOOL').length
        const wordCount = moduleVars.filter(v => v.data_type === 'WORD').length
        generator.addText(`${module}: ${moduleVars.length} variables (${boolCount} BOOL, ${wordCount} WORD)`)
      })

      // Agregar tabla de variables
      generator.addVariablesTable(data, 'Lista Completa de Variables')

      // Intentar agregar gráficos si están disponibles
      if (Object.keys(chartRefs).length > 0) {
        generator.addSubtitle('Gráficos de Variables')
        generator.addText('Los siguientes gráficos muestran la evolución temporal de las variables:')
        
        for (const [chartName, chartRef] of Object.entries(chartRefs)) {
          if (chartRef.current) {
            try {
              await generator.addChartAsImage(chartRef.current, chartName)
            } catch (error) {
              console.error(`Error al generar gráfico ${chartName}:`, error)
              generator.addText(`Error al generar gráfico: ${chartName}`)
            }
          }
        }
      }

      // Agregar conclusiones
      generator.addSubtitle('Conclusiones')
      generator.addText(`El sistema monitorea ${data.length} variables en tiempo real.`)
      generator.addText(`Se han identificado ${modules.length} módulos diferentes en el sistema.`)
      
      if (wordVariables.length > 0) {
        generator.addText(`Las variables analógicas (WORD) muestran variaciones en sus valores, indicando actividad del sistema.`)
      }
      
      if (boolVariables.length > 0) {
        generator.addText(`Las variables digitales (BOOL) controlan estados discretos del sistema.`)
      }

      generator.generatePDF(`reporte-avanzado-${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (error) {
      console.error('Error al generar reporte avanzado:', error)
      alert('Error al generar el reporte avanzado')
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={generateAdvancedReport}
      disabled={!data || data.length === 0}
      className={`gap-2 ${className}`}
    >
      <FileText className="h-4 w-4" />
      <Download className="h-4 w-4" />
      Reporte Avanzado
    </Button>
  )
}

// Hook para crear referencias a gráficos
export const useChartRefs = () => {
  const refs = {}
  
  const createChartRef = (name) => {
    if (!refs[name]) {
      refs[name] = { current: null }
    }
    return refs[name]
  }
  
  return { refs, createChartRef }
} 