import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { InvoiceReceipt } from "./InvoiceReceipt";
import { CreditCard } from "lucide-react";

interface Payment {
  id: string;
  date: string;
  invoice: string;
  planType: string;
  planName: string;
  amount: string;
  status: "paid" | "pending" | "failed";
}

interface InvoiceTableProps {
  payments: Payment[];
}

export function InvoiceTable({ payments }: InvoiceTableProps) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CreditCard className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm font-medium mb-1">No payment history</p>
        <p className="text-sm text-muted-foreground">
          Your payment history will appear here
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Receipt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id} className="group">
              <TableCell className="font-medium">
                {format(new Date(payment.date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{payment.invoice}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {payment.planType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {payment.planName}
                  </span>
                </div>
              </TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>
                <PaymentStatusBadge status={payment.status} />
              </TableCell>
              <TableCell className="text-right">
                <InvoiceReceipt payment={payment} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
