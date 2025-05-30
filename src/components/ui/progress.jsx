import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "../../lib/utils"

function Progress({
  className,
  value,
  style,
  ...props
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full"
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full transition-all", className)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)`, ...style }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress }
