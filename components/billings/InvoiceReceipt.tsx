import { format } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceGenerator } from "./InvoiceGenerator";

interface InvoiceReceiptProps {
  payment: {
    id: string;
    date: string;
    invoice: string;
    planType: string;
    planName: string;
    amount: string;
    status: string;
  };
  trigger?: React.ReactNode;
}

export function InvoiceReceipt({ payment, trigger }: InvoiceReceiptProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View Receipt
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Invoice Receipt</DialogTitle>
          <DialogDescription>Invoice #{payment.invoice}</DialogDescription>
        </DialogHeader>
        <div className="space-y-8">
          {/* Company Info */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-xl mb-1">On Track</h3>
              <p className="text-sm text-muted-foreground">
                123 Habit Street
                <br />
                San Francisco, CA 94105
                <br />
                United States
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium mb-1">Invoice Date</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(payment.date), "MMMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="space-y-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium">{payment.planName}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.planType === "yearly"
                            ? "Annual Subscription"
                            : "Monthly Subscription"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {payment.amount}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <div className="w-[200px] space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{payment.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total</span>
                  <span>{payment.amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-8 text-center space-y-2">
            <p className="text-sm font-medium">Thank you for your business!</p>
            <p className="text-xs text-muted-foreground">
              If you have any questions, please contact support@ontrack.com
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => InvoiceGenerator.downloadInvoice(payment)}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
