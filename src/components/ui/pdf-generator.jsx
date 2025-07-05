import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export class PDFGenerator {
  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4')
    this.pageWidth = this.pdf.internal.pageSize.getWidth()
    this.pageHeight = this.pdf.internal.pageSize.getHeight()
    this.margin = 20
    this.yPosition = this.margin
    this.lineHeight = 7
  }

  // Método para agregar título principal
  addTitle(title, fontSize = 20) {
    this.pdf.setFontSize(fontSize)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(title, this.pageWidth / 2, this.yPosition, { align: 'center' })
    this.yPosition += this.lineHeight * 2
  }

  // Método para agregar subtítulo
  addSubtitle(subtitle, fontSize = 14) {
    this.pdf.setFontSize(fontSize)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(subtitle, this.margin, this.yPosition)
    this.yPosition += this.lineHeight * 1.5
  }

  // Método para agregar texto normal
  addText(text, fontSize = 12) {
    this.pdf.setFontSize(fontSize)
    this.pdf.setFont('helvetica', 'normal')
    
    // Dividir texto en líneas si es muy largo
    const maxWidth = this.pageWidth - (this.margin * 2)
    const lines = this.pdf.splitTextToSize(text, maxWidth)
    
    lines.forEach(line => {
      if (this.yPosition > this.pageHeight - this.margin) {
        this.addNewPage()
      }
      this.pdf.text(line, this.margin, this.yPosition)
      this.yPosition += this.lineHeight
    })
  }

  // Método para agregar tabla de variables
  addVariablesTable(variables, title = 'Variables') {
    this.addSubtitle(title)
    
    if (!variables || variables.length === 0) {
      this.addText('No hay variables disponibles')
      return
    }

    // Definir columnas compactas
    const columns = [
      { header: 'Address', key: 'address', width: 22 },
      { header: 'Symbol', key: 'symbol', width: 28 },
      { header: 'Data Type', key: 'data_type', width: 18 },
      { header: 'Value', key: 'value', width: 18 },
      { header: 'Module', key: 'module', width: 28 },
      { header: 'Timestamp', key: 'timestamp', width: 36 }
    ]

    // Calcular posiciones
    let xPosition = this.margin
    const startY = this.yPosition

    // Dibujar encabezados
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.setFillColor(240, 240, 240)
    
    columns.forEach(column => {
      this.pdf.setFillColor(240, 240, 240)
      this.pdf.rect(xPosition, startY - 5, column.width, 8, 'F')
      this.pdf.setTextColor(0, 0, 0)
      let headerText = column.header
      const maxChars = Math.floor((column.width - 2) / 2.2)
      if (headerText.length > maxChars) {
        headerText = headerText.substring(0, maxChars - 3) + '...'
      }
      this.pdf.text(headerText, xPosition + 2, startY)
      xPosition += column.width
    })
    this.pdf.setTextColor(0, 0, 0)

    this.yPosition += 8

    // Dibujar datos
    this.pdf.setFontSize(9)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.setFillColor(255, 255, 255)

    variables.forEach((variable) => {
      // Verificar si necesitamos nueva página
      if (this.yPosition > this.pageHeight - this.margin - 10) {
        this.addNewPage()
        this.yPosition = this.margin + 10
      }

      xPosition = this.margin
      
      columns.forEach(column => {
        let value = variable[column.key] != null ? variable[column.key] : ''
        // Formatear timestamp
        if (column.key === 'timestamp' && value) {
          const date = new Date(value)
          value = date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
        // Formatear valor según tipo de dato
        if (column.key === 'value') {
          if (variable.data_type === 'BOOL') {
            value = value === 'True' ? 'True' : 'False'
          } else if (variable.data_type === 'WORD') {
            value = parseFloat(value).toFixed(2)
          }
        }
        // Truncar texto según ancho de columna
        if (typeof value === 'string') {
          // Aproximación: 1 caracter ~2.2mm a fontSize 9
          const maxChars = Math.floor((column.width - 2) / 2.2)
          if (value.length > maxChars) {
            value = value.substring(0, maxChars - 3) + '...'
          }
        }
        this.pdf.setFillColor(255, 255, 255)
        this.pdf.rect(xPosition, this.yPosition - 5, column.width, 6, 'F')
        this.pdf.text(value.toString(), xPosition + 1, this.yPosition)
        xPosition += column.width
      })

      this.yPosition += 6
    })

    this.yPosition += 10
  }

  // Método para agregar estadísticas
  addStatistics(variables) {
    if (!variables || variables.length === 0) return

    this.addSubtitle('Estadísticas Generales')
    
    const totalVariables = variables.length
    const boolVariables = variables.filter(v => v.data_type === 'BOOL').length
    const wordVariables = variables.filter(v => v.data_type === 'WORD').length
    const modules = [...new Set(variables.map(v => v.module))]
    
    this.addText(`Total de variables: ${totalVariables}`)
    this.addText(`Variables BOOL: ${boolVariables}`)
    this.addText(`Variables WORD: ${wordVariables}`)
    this.addText(`Módulos únicos: ${modules.length}`)
    this.addText(`Módulos: ${modules.join(', ')}`)
    
    // Estadísticas por módulo
    this.addSubtitle('Variables por Módulo')
    const moduleStats = modules.map(module => {
      const moduleVars = variables.filter(v => v.module === module)
      return `${module}: ${moduleVars.length} variables`
    })
    
    moduleStats.forEach(stat => {
      this.addText(stat)
    })
  }

  // Método para agregar gráfico como imagen
  async addChartAsImage(chartElement, title) {
    if (!chartElement) return

    try {
      this.addSubtitle(title)
      
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = this.pageWidth - (this.margin * 2)
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Verificar si la imagen cabe en la página actual
      if (this.yPosition + imgHeight > this.pageHeight - this.margin) {
        this.addNewPage()
      }

      this.pdf.addImage(imgData, 'PNG', this.margin, this.yPosition, imgWidth, imgHeight)
      this.yPosition += imgHeight + 10
    } catch (error) {
      console.error('Error al generar imagen del gráfico:', error)
      this.addText('Error al generar gráfico')
    }
  }

  // Método para agregar nueva página
  addNewPage() {
    this.pdf.addPage()
    this.yPosition = this.margin
  }

  // Método para agregar pie de página
  addFooter() {
    const footerText = `Generado el ${new Date().toLocaleString('es-ES')} - Metrics`
    this.pdf.setFontSize(8)
    this.pdf.setFont('helvetica', 'italic')
    this.pdf.text(footerText, this.pageWidth / 2, this.pageHeight - 10, { align: 'center' })
  }

  // Método para generar y descargar el PDF
  generatePDF(filename = 'reporte.pdf') {
    this.addFooter()
    this.pdf.save(filename)
  }

  // Método para generar reporte completo
  async generateCompleteReport(data, title, includeCharts = false) {
    this.addTitle(title)
    this.addText(`Reporte generado automáticamente por el sistema.`)
    this.yPosition += 10

    // Agregar estadísticas
    this.addStatistics(data)

    // Agregar tabla de variables
    this.addVariablesTable(data, 'Lista de Variables')

    // Si se incluyen gráficos, se pueden agregar aquí
    if (includeCharts) {
      this.addText('Nota: Los gráficos se pueden incluir como imágenes si es necesario.')
    }

    this.generatePDF()
  }
}

// Hook personalizado para usar el generador de PDF
export const usePDFGenerator = () => {
  return {
    generateReport: (data, title, options = {}) => {
      const generator = new PDFGenerator()
      return generator.generateCompleteReport(data, title, options.includeCharts)
    },
    
    generateTableReport: (data, title) => {
      const generator = new PDFGenerator()
      generator.addTitle(title)
      generator.addVariablesTable(data)
      generator.generatePDF()
    },
    
    generateChartReport: async (chartElements, title) => {
      const generator = new PDFGenerator()
      generator.addTitle(title)
      
      for (const [chartTitle, element] of Object.entries(chartElements)) {
        await generator.addChartAsImage(element, chartTitle)
      }
      
      generator.generatePDF()
    }
  }
} 