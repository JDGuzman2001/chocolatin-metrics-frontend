import { useQuery } from '@tanstack/react-query'

// Función para hacer la petición
const fetchAllVariables = async () => {
  const response = await fetch('http://localhost:8000/variables')
  return response.json()
}

const fetchVariablesByModule = async (module) => {
  const response = await fetch(`http://localhost:8000/variables/module/${module}`)
  return response.json()
}

const fetchVariablesByDate = async (start_date, end_date) => {
  // Validar que ambas fechas estén presentes
  if (!start_date || !end_date) {
    throw new Error('Se requieren fecha de inicio y fecha de fin')
  }
  
  // Si las fechas ya incluyen la hora, las usamos tal como están
  // Si solo tienen fecha, agregamos la hora por defecto
  const startParam = start_date.includes('T') ? start_date : `${start_date}T00:00:00`
  const endParam = end_date.includes('T') ? end_date : `${end_date}T23:59:59`
  
  const response = await fetch(`http://localhost:8000/variables/date-range?start_date=${startParam}&end_date=${endParam}`)
  return response.json()
}

// Hook personalizado
export function useVariables() {
  return useQuery({
    queryKey: ['variables'],
    queryFn: fetchAllVariables,
    staleTime: Infinity, // Los datos nunca se consideran stale
    refetchOnMount: false, // No refetch al montar el componente
    refetchOnWindowFocus: false, // No refetch al enfocar la ventana
    refetchOnReconnect: false, // No refetch al reconectar
  })
}

export function useVariablesByModule(module) {
  return useQuery({
    queryKey: ['variables', module],
    queryFn: () => fetchVariablesByModule(module),
    staleTime: Infinity, // Los datos nunca se consideran stale
    refetchOnMount: false, // No refetch al montar el componente
    refetchOnWindowFocus: false, // No refetch al enfocar la ventana
    refetchOnReconnect: false, // No refetch al reconectar
  })
}

export function useVariablesByDate(start_date, end_date) {
  return useQuery({
    queryKey: ['variables', 'date-range', start_date, end_date],
    queryFn: () => fetchVariablesByDate(start_date, end_date),
    enabled: !!(start_date && end_date), // Solo ejecutar si ambas fechas están presentes
    staleTime: Infinity, // Los datos nunca se consideran stale
    refetchOnMount: false, // No refetch al montar el componente
    refetchOnWindowFocus: false, // No refetch al enfocar la ventana
    refetchOnReconnect: false, // No refetch al reconectar
    gcTime: 1000 * 60 * 60 * 24, // Mantener en cache por 24 horas
    retry: 1, // Solo reintentar una vez en caso de error
  })
}