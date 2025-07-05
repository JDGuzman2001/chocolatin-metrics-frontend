import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import VariablesTable from "./components/main/variables-table"
import VariablesCharts from "./components/main/variables-charts"
import ModuleVariablesTable from "./components/main/module-variables-table"
import DateVariablesTable from "./components/main/date-variables-table"
import { PDFExample } from "./components/ui/pdf-example"
import { useVariables } from "./hooks/variables-hook"
import { Activity, BarChart3, Database, FileText, TrendingUp, Users, Zap } from "lucide-react"

function App() {
  const { data: allVariables, isLoading } = useVariables()

  console.log('allVariables', allVariables)

  // Calculate dashboard statistics
  const uniqueVariables = allVariables ? 
    allVariables.reduce((acc, variable) => {
      // Si ya existe una variable con el mismo nombre, no la agregamos
      if (!acc.find(v => v.symbol === variable.symbol)) {
        acc.push(variable);
      }
      return acc;
    }, []) : [];

  const totalVariables = uniqueVariables.length;
  const uniqueModules = uniqueVariables.length > 0 ? new Set(uniqueVariables.map(v => v.module)).size : 0;
  const booleanVariables = uniqueVariables.filter(v => v.data_type === 'BOOL').length;
  const numericVariables = uniqueVariables.filter(v => v.data_type === 'WORD').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Metrics</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sistema de Monitoreo Industrial</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard</h2>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Variables
                </CardTitle>
                <Database className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoading ? "..." : totalVariables}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Variables monitoreadas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Módulos Activos
                </CardTitle>
                <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoading ? "..." : uniqueModules}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Módulos en operación
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Variables Booleanas
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoading ? "..." : booleanVariables}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Estados digitales
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Variables Numéricas
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoading ? "..." : numericVariables}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Valores analógicos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* PDF Generator Section */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900 dark:text-white">
                <FileText className="h-5 w-5 mr-2" />
                Generador de Reportes PDF
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Crea reportes profesionales con los datos del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PDFExample 
                data={allVariables} 
                title="Sistema de Metrics" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Data Visualization Tabs */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border-0 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Visualización de Datos
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Explora y analiza las variables del sistema de diferentes maneras
            </p>
          </div>
          
          <Tabs defaultValue="charts" className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800">
                <TabsTrigger value="charts" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Gráficos</span>
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Todas</span>
                </TabsTrigger>
                {/* <TabsTrigger value="module" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Por Módulo</span>
                </TabsTrigger> */}
                <TabsTrigger value="date" className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Por Fecha</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="charts" className="mt-0">
                <VariablesCharts />
              </TabsContent>
              <TabsContent value="all" className="mt-0">
                <VariablesTable />
              </TabsContent>
              {/* <TabsContent value="module" className="mt-0">
                <ModuleVariablesTable />
              </TabsContent> */}
              <TabsContent value="date" className="mt-0">
                <DateVariablesTable />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/60 backdrop-blur-sm dark:bg-slate-900/60 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 Metrics. Sistema de monitoreo industrial.
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <span>Estado: <span className="text-green-600 dark:text-green-400 font-medium">Operativo</span></span>
              <span>Última actualización: {new Date().toLocaleString('es-ES')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App