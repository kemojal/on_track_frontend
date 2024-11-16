import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceGenerator } from "./InvoiceGenerator";
import { useBillingStore } from "@/lib/store";

export function PaymentHistoryCard() {
  const { paymentHistory } = useBillingStore();

  const handleExportAll = () => {
    InvoiceGenerator.downloadAllInvoices(paymentHistory);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              View your past payments and download invoices
            </CardDescription>
          </div>
          {paymentHistory.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleExportAll}
            >
              <Download className="w-3 h-3 mr-1" />
              Export All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <InvoiceTable payments={paymentHistory} />
      </CardContent>
    </Card>
  );
}
