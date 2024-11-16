import { cn } from "@/lib/utils";

type PaymentStatus = "paid" | "pending" | "failed";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  const statusConfig = {
    paid: {
      color: "bg-emerald-500",
      text: "text-emerald-500",
      label: "Paid",
    },
    pending: {
      color: "bg-yellow-500",
      text: "text-yellow-500",
      label: "Pending",
    },
    failed: {
      color: "bg-red-500",
      text: "text-red-500",
      label: "Failed",
    },
  } as const;

  // Add type safety and default handling
  const config = statusConfig[status] || statusConfig.failed;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("h-2 w-2 rounded-full", config.color)} />
      <span className={cn("text-xs font-medium", config.text)}>
        {config.label}
      </span>
    </div>
  );
}
