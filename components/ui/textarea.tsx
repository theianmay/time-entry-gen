import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-lg border-2 bg-transparent px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-ring/50 hover:shadow-md",
        "focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-4 focus-visible:shadow-lg",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
