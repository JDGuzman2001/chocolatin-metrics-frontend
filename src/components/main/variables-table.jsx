import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useVariables } from "@/hooks/variables-hook"

export default function VariablesTable() {
  const { data, isLoading, error } = useVariables()
  console.log(data)
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <Table>
        <TableCaption>A list of all variables.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>Module</TableHead>
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
                <TableCell>{variable.module}</TableCell>
                <TableCell>{variable.symbol}</TableCell>
                <TableCell>{variable.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}