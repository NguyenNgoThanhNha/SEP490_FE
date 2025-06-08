import { Info } from "lucide-react"

export function RoutineEmptyState() {
  return (
    <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
      <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium">No steps found</h3>
      <p className="text-muted-foreground">No steps match your current filters or search criteria</p>
    </div>
  )
}
