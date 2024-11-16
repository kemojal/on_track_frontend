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
    tagline: "Your Journey to Better Habits",
    address: "123 Innovation Way",
    city: "San Francisco, CA 94105",
    country: "United States",
    email: "support@ontrack.com",
    website: "www.ontrack.com",
    logo: {
      text: "ON TRACK",
      subText: "HABIT TRACKER",
    },
  };

  private static colors = {
    primary: [94, 53, 177], // Purple
    secondary: [149, 117, 205], // Light purple
    text: [51, 51, 51], // Dark gray
    lightGray: [241, 241, 241], // Background gray
    success: [34, 197, 94], // Green for paid status
  };

  private static addGradientHeader(doc: jsPDF) {
    const pageWidth = doc.internal.pageSize.width;
    const headerHeight = 60;

    // Add modern gradient header
    for (let i = 0; i < headerHeight; i++) {
      const alpha = 1 - (i / headerHeight) * 0.9;
      doc.setFillColor(...this.colors.primary, alpha);
      doc.rect(0, i, pageWidth, 1, "F");
    }
  }

  private static addLogo(doc: jsPDF) {
    const pageWidth = doc.internal.pageSize.width;

    // Add stylized logo
    doc.setFillColor(...this.colors.primary);
    doc.roundedRect(20, 15, 50, 30, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(this.companyInfo.logo.text, 45, 30, { align: "center" });

    doc.setFontSize(8);
    doc.text(this.companyInfo.logo.subText, 45, 38, { align: "center" });
  }

  private static addCompanyInfo(doc: jsPDF) {
    const pageWidth = doc.internal.pageSize.width;

    // Company info with modern typography
    doc.setTextColor(...this.colors.text);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const companyInfoY = 60;
    doc.text(this.companyInfo.address, 20, companyInfoY);
    doc.text(this.companyInfo.city, 20, companyInfoY + 5);
    doc.text(this.companyInfo.country, 20, companyInfoY + 10);
    doc.text(this.companyInfo.email, 20, companyInfoY + 15);
    doc.text(this.companyInfo.website, 20, companyInfoY + 20);
  }

  private static addInvoiceDetails(doc: jsPDF, payment: InvoiceData) {
    const pageWidth = doc.internal.pageSize.width;

    // Modern invoice header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...this.colors.primary);
    doc.text("INVOICE", pageWidth - 20, 30, { align: "right" });

    // Invoice info with clean typography
    doc.setTextColor(...this.colors.text);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const invoiceDetails = [
      { label: "Invoice No:", value: payment.invoice },
      { label: "Date:", value: format(new Date(payment.date), "MMMM d, yyyy") },
      { label: "Status:", value: payment.status.toUpperCase() },
    ];

    invoiceDetails.forEach((detail, index) => {
      doc.text(detail.label, pageWidth - 90, 45 + index * 7);
      doc.setFont("helvetica", "bold");
      doc.text(detail.value, pageWidth - 20, 45 + index * 7, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");
    });
  }

  static generateInvoicePDF(payment: InvoiceData): jsPDF {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Add premium design elements
    this.addGradientHeader(doc);
    this.addLogo(doc);
    this.addCompanyInfo(doc);
    this.addInvoiceDetails(doc, payment);

    // Add stylish payment details table
    autoTable(doc, {
      startY: 100,
      head: [["Description", "Details", "Amount"]],
      body: [
        [
          {
            content: payment.planName,
            styles: { fontStyle: "bold" },
          },
          {
            content: `${
              payment.planType === "yearly" ? "Annual" : "Monthly"
            } Subscription\nBilling Period: ${format(
              new Date(payment.date),
              "MMM d, yyyy"
            )}`,
          },
          {
            content: payment.amount,
            styles: { halign: "right", fontStyle: "bold" },
          },
        ],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 8,
      },
      headStyles: {
        fillColor: this.colors.primary,
        fontSize: 10,
        fontStyle: "bold",
        halign: "left",
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 50 },
      },
      alternateRowStyles: {
        fillColor: this.colors.lightGray,
      },
    });

    // Add professional summary section
    const finalY = (doc as any).lastAutoTable.finalY || 100;

    // Add subtle separator line
    doc.setDrawColor(...this.colors.secondary);
    doc.setLineWidth(0.1);
    doc.line(pageWidth - 100, finalY + 10, pageWidth - 20, finalY + 10);

    // Add total section with modern typography
    doc.setFontSize(10);
    doc.setTextColor(...this.colors.text);

    const summaryItems = [
      { label: "Subtotal:", value: payment.amount },
      { label: "Tax:", value: "$0.00" },
      { label: "Total:", value: payment.amount, bold: true },
    ];

    summaryItems.forEach((item, index) => {
      if (item.bold) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
      }
      doc.text(item.label, pageWidth - 80, finalY + 20 + index * 10);
      doc.text(item.value, pageWidth - 20, finalY + 20 + index * 10, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
    });

    // Add premium footer
    const footerY = finalY + 70;

    // Add payment status indicator
    const statusColor =
      payment.status === "paid" ? this.colors.success : this.colors.primary;
    doc.setFillColor(...statusColor);
    doc.circle(pageWidth / 2 - 50, footerY, 3, "F");
    doc.setTextColor(...statusColor);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(payment.status.toUpperCase(), pageWidth / 2 - 40, footerY + 1);

    // Add footer text
    doc.setTextColor(...this.colors.text);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const footerText = "Thank you for choosing On Track!";
    doc.text(footerText, pageWidth / 2, footerY + 20, { align: "center" });

    // Add support info with icon-like bullet
    doc.setFontSize(8);
    doc.setTextColor(...this.colors.secondary);
    const supportText = "Questions? Contact us at support@ontrack.com";
    doc.text(supportText, pageWidth / 2, footerY + 30, { align: "center" });

    // Add modern bottom border
    doc.setDrawColor(...this.colors.primary);
    doc.setLineWidth(0.5);
    doc.line(
      0,
      doc.internal.pageSize.height - 10,
      pageWidth,
      doc.internal.pageSize.height - 10
    );

    return doc;
  }

  static downloadInvoice(payment: InvoiceData) {
    const doc = this.generateInvoicePDF(payment);
    doc.save(`OnTrack-Invoice-${payment.invoice}.pdf`);
  }

  static previewInvoice(payment: InvoiceData): string {
    const doc = this.generateInvoicePDF(payment);
    return doc.output("datauristring");
  }

  static downloadAllInvoices(payments: InvoiceData[]) {
    const doc = new jsPDF();

    payments.forEach((payment, index) => {
      if (index > 0) {
        doc.addPage();
      }

      const singleInvoice = this.generateInvoicePDF(payment);
      doc.setPage(index + 1);
      doc.addFileToVFS(
        `invoice-${payment.invoice}.pdf`,
        singleInvoice.output("arraybuffer")
      );
    });

    doc.save("OnTrack-Invoices.pdf");
  }
}
