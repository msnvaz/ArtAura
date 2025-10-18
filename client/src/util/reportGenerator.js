import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to format currency (LKR by default)
const formatCurrency = (n, currency = 'LKR') => {
  try {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency }).format(Number(n || 0));
  } catch {
    return `LKR ${Number(n || 0).toFixed(2)}`;
  }
};

export function generateMonthlyReportPDF({
  monthLabel,
  generatedAt,
  overview,
  payments,
  delivery,
  verification,
  fileName,
}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ArtAura Monthly Admin Report', pageWidth / 2, 40, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Period: ${monthLabel}`, 40, 70);
  doc.text(`Generated: ${generatedAt}`, 40, 88);

  // Overview table
  autoTable(doc, {
    startY: 110,
    theme: 'striped',
    head: [['Overview Metric', 'Value']],
    body: [
      ['Total Users', (overview?.totalUsers ?? 0).toLocaleString()],
      ['Total Artists', (overview?.totalArtists ?? 0).toLocaleString()],
      ['Active Artists', (overview?.activeArtists ?? 0).toLocaleString()],
      ['Platform Fees (all-time)', formatCurrency(overview?.platformFees ?? 0)],
      ['Total Transactions (all-time)', (overview?.totalTransactions ?? 0).toLocaleString()],
      ['Pending Payments (now)', (overview?.pendingPayments ?? 0).toLocaleString()],
    ],
    styles: { cellPadding: 6, fontSize: 10 },
    headStyles: { fillColor: [216, 124, 90] },
  });

  const afterOverviewY = doc.lastAutoTable.finalY + 20;

  // Payments summary for the month
  const monthlyPaid = (payments?.filtered || []).filter(p => p.status === 'paid');
  const monthlyEscrow = (payments?.filtered || []).filter(p => p.status === 'escrow');
  const totalPaidAmount = monthlyPaid.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  autoTable(doc, {
    startY: afterOverviewY,
    theme: 'striped',
    head: [[`Payments Summary (${monthLabel})`, 'Value']],
    body: [
      ['Payments (all)', (payments?.filtered?.length || 0).toLocaleString()],
      ['Paid count', monthlyPaid.length.toLocaleString()],
      ['Escrow count', monthlyEscrow.length.toLocaleString()],
      ['Total Paid Amount', formatCurrency(totalPaidAmount)],
    ],
    styles: { cellPadding: 6, fontSize: 10 },
    headStyles: { fillColor: [93, 58, 0] },
  });

  // Payments table (top 15)
  const afterPaySummaryY = doc.lastAutoTable.finalY + 12;
  const topPayments = (payments?.filtered || []).slice(0, 15);
  autoTable(doc, {
    startY: afterPaySummaryY,
    theme: 'grid',
    head: [['Date', 'Type', 'Buyer', 'Artist', 'Status', 'Amount']],
    body: topPayments.map(p => [
      new Date(p.createdAt).toLocaleString(),
      (p.paymentType || '-'),
      (p.buyerName || '-'),
      (p.artistName || '-'),
      (p.status || '-'),
      formatCurrency(p.amount),
    ]),
    styles: { cellPadding: 4, fontSize: 9 },
    headStyles: { fillColor: [255, 217, 90] },
    didDrawPage: (data) => {
      // Footer with page number
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(9);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth - 60, doc.internal.pageSize.getHeight() - 10);
    },
  });

  // Delivery summary
  const afterPaymentsTableY = doc.lastAutoTable.finalY + 20;
  const deliveries = Array.isArray(delivery?.items) ? delivery.items : [];

  // Normalize various backend/frontend status shapes to a small set
  const pickRawStatus = (d) => {
    return (
      d?.status ??
      d?.deliveryStatus ??
      d?.delivery_status ??
      d?.currentStatus ??
      ''
    );
  };

  const normalizeStatus = (raw) => {
    const s = String(raw || '')
      .toLowerCase()
      .replace(/\s|_|-/g, ''); // remove spaces, underscores, hyphens

    if (!s) return '';

    // Delivered
    if (s === 'delivered' || s.endsWith('delivered')) return 'delivered';

    // In transit / out for delivery
    if (s === 'intransit' || s === 'outfordelivery' || s.includes('outfordelivery') || s.includes('transit')) {
      return 'in_transit';
    }

    // Pending / requested / pending requests / pending_assignment
    if (
      s.startsWith('pend') ||
      s.includes('request') ||
      s === 'pendingrequests' ||
      s === 'pendingassignment'
    ) {
      return 'pending';
    }

    // Accepted (not counted separately here, but keep mapping consistent)
    if (s.includes('accept')) return 'accepted';

    // Cancelled
    if (s.includes('cancel')) return 'cancelled';

    return s; // fallback
  };

  const statuses = deliveries.map((d) => normalizeStatus(pickRawStatus(d)));
  const delivered = statuses.filter((s) => s === 'delivered').length;
  const inTransit = statuses.filter((s) => s === 'in_transit').length;
  const pending = statuses.filter((s) => s === 'pending').length;

  autoTable(doc, {
    startY: afterPaymentsTableY,
    theme: 'striped',
    head: [[`Delivery Summary (${monthLabel})`, 'Value']],
    body: [
      ['Total Deliveries', deliveries.length.toLocaleString()],
  ['Delivered', delivered.toLocaleString()],
  ['Out for Delivery', inTransit.toLocaleString()],
      ['Pending/Requested', pending.toLocaleString()],
    ],
    styles: { cellPadding: 6, fontSize: 10 },
    headStyles: { fillColor: [216, 124, 90] },
  });

  // Verification summary
  const afterDeliveryY = doc.lastAutoTable.finalY + 20;
  autoTable(doc, {
    startY: afterDeliveryY,
    theme: 'striped',
    head: [[`Verification Summary (${monthLabel})`, 'Value']],
    body: [
      ['Total', (verification?.total || 0).toLocaleString()],
      ['Pending', (verification?.pending || 0).toLocaleString()],
      ['Verified', (verification?.verified || 0).toLocaleString()],
      ['Rejected', (verification?.rejected || 0).toLocaleString()],
    ],
    styles: { cellPadding: 6, fontSize: 10 },
    headStyles: { fillColor: [93, 58, 0] },
  });

  // Delivery requests table (first column Date, last column Status)
  const afterVerificationY = doc.lastAutoTable.finalY + 12;
  const pickDateRaw = (d) => d?.orderDate || d?.createdDate || d?.created_at || d?.createdAt || d?.date || '';
  const parseDate = (val) => {
    try {
      if (!val) return '';
      const dt = new Date(val);
      if (isNaN(dt.getTime())) return '';
      // Format YYYY-MM-DD to mirror DeliveryManagement table
      return dt.toISOString().slice(0, 10);
    } catch {
      return '';
    }
  };
  const pickRequestId = (d) => {
    if (d?.requestId) return String(d.requestId);
    const type = (d?.requestType || '').toString().toUpperCase();
    const id = d?.id || d?.request_id || d?.requestId || '';
    return (type && id) ? `${type}-${id}` : (id ? String(id) : '-');
  };
  const displayStatus = (raw) => {
    const n = normalizeStatus(raw);
    switch (n) {
      case 'delivered': return 'Delivered';
      case 'in_transit': return 'Out for Delivery';
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'cancelled': return 'Cancelled';
      default:
        return n ? n : '-';
    }
  };
  const topDeliveries = deliveries.slice(0, 15);
  autoTable(doc, {
    startY: afterVerificationY,
    theme: 'grid',
    head: [['Date', 'Request ID', 'Status']],
    body: topDeliveries.map(d => [
      parseDate(pickDateRaw(d)) || '-',
      pickRequestId(d),
      displayStatus(pickRawStatus(d)),
    ]),
    styles: { cellPadding: 4, fontSize: 9 },
    headStyles: { fillColor: [255, 217, 90] },
  });

  // Save
  doc.save(fileName || `artaura-monthly-report.pdf`);
}
