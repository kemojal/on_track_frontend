import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface InvoiceData {
  id: string;
  date: string;
  invoice: string;
  planType: string;
  planName: string;
  amount: string;
  status: string;
}

export class InvoiceGenerator {
  private static companyInfo = {
    name: "On Track",
    address: "123 Habit Street",
    city: "San Francisco, CA 94105",
    country: "United States",
    email: "support@ontrack.com",
  };

  static generateInvoicePDF(payment: InvoiceData): jsPDF {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Add logo and company info
    doc.setFontSize(24);
    doc.text("On Track", 20, 20);

    doc.setFontSize(10);
    doc.text(this.companyInfo.address, 20, 30);
    doc.text(this.companyInfo.city, 20, 35);
    doc.text(this.companyInfo.country, 20, 40);

    // Add invoice details
    doc.setFontSize(12);
    doc.text("INVOICE", pageWidth - 20, 20, { align: "right" });
    doc.setFontSize(10);
    doc.text(`Invoice #: ${payment.invoice}`, pageWidth - 20, 30, {
      align: "right",
    });
    doc.text(
      `Date: ${format(new Date(payment.date), "MMMM d, yyyy")}`,
      pageWidth - 20,
      35,
      { align: "right" }
    );

    // Add payment details table
    autoTable(doc, {
      startY: 60,
      head: [["Description", "Amount"]],
      body: [
        [
          {
            content: `${payment.planName}\n${
              payment.planType === "yearly" ? "Annual" : "Monthly"
            } Subscription`,
            styles: { cellWidth: "auto" },
          },
          { content: payment.amount, styles: { halign: "right" } },
        ],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [94, 53, 177] },
    });

    // Add total
    const finalY = (doc as any).lastAutoTable.finalY || 60;
    doc.setFontSize(10);
    doc.text("Subtotal:", pageWidth - 80, finalY + 20);
    doc.text(payment.amount, pageWidth - 20, finalY + 20, { align: "right" });

    doc.text("Tax:", pageWidth - 80, finalY + 27);
    doc.text("$0.00", pageWidth - 20, finalY + 27, { align: "right" });

    doc.setFontSize(11);
    doc.text("Total:", pageWidth - 80, finalY + 37);
    doc.text(payment.amount, pageWidth - 20, finalY + 37, { align: "right" });

    // Add footer
    doc.setFontSize(10);
    const footerText = "Thank you for your business!";
    doc.text(footerText, pageWidth / 2, finalY + 60, { align: "center" });

    const supportText =
      "If you have any questions, please contact support@ontrack.com";
    doc.setFontSize(8);
    doc.text(supportText, pageWidth / 2, finalY + 67, { align: "center" });

    return doc;
  }

  static downloadInvoice(payment: InvoiceData) {
    const doc = this.generateInvoicePDF(payment);
    doc.save(`invoice-${payment.invoice}.pdf`);
  }

  static downloadAllInvoices(payments: InvoiceData[]) {
    const doc = new jsPDF();
    let currentPage = 1;

    payments.forEach((payment, index) => {
      if (index > 0) {
        doc.addPage();
        currentPage++;
      }

      const singleInvoice = this.generateInvoicePDF(payment);
      const pageContent = singleInvoice.output("arraybuffer");

      if (currentPage === 1) {
        doc.setPage(currentPage);
      }

      doc.addPage();
      doc.addFileToVFS(`invoice-${payment.invoice}.pdf`, pageContent);
    });

    doc.save("all-invoices.pdf");
  }
}
