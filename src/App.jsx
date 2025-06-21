import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VariablesTable from "./components/main/variables-table"
import VariablesCharts from "./components/main/variables-charts"
import ModuleVariablesTable from "./components/main/module-variables-table"
import DateVariablesTable from "./components/main/date-variables-table"

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center m-4">
      <h1 className="text-2xl font-bold">Chocolatin</h1>
      <Tabs defaultValue="all" className="w-full items-center p-4">
        <TabsList>
          <TabsTrigger value="all">Todas las variables</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="module">Variables por modulo</TabsTrigger>
          <TabsTrigger value="date">Variables por fecha</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <VariablesTable />
        </TabsContent>
        <TabsContent value="charts">
          <VariablesCharts />
        </TabsContent>
        <TabsContent value="module">
          <ModuleVariablesTable />
        </TabsContent>
        <TabsContent value="date">
          <DateVariablesTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App