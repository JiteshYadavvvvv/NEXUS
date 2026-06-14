import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const LOGO_SRC = '/aitpune.jpg';

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const eventName = (e) => e.eventName || e.name || e.title || 'Untitled Event';

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null); // fail gracefully — PDF still renders
        img.src = src;
    });
}

/**
 * Build and download a standardised report PDF.
 *
 * @param {Object} opts
 * @param {'club'|'quarter'} opts.type
 * @param {string}  [opts.clubName]      - required for club reports
 * @param {string}  opts.durationLabel   - e.g. "April 2026" or "Mar 2026 – Jun 2026"
 * @param {Array}   [opts.events]        - club report rows
 * @param {Array}   [opts.clubs]         - quarter report groups [{ club, count, events }]
 * @param {number}  [opts.totalEvents]
 */
export async function generateReportPdf(opts) {
    const { type, clubName, durationLabel, events = [], clubs = [], totalEvents } = opts;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const center = pageWidth / 2;
    const marginX = 40;

    let y = 36;

    // ── Logo (centered) ──────────────────────────────────────────────
    const img = await loadImage(LOGO_SRC);
    if (img && img.naturalWidth) {
        const h = 60;
        const w = (img.naturalWidth / img.naturalHeight) * h;
        try {
            doc.addImage(img, 'JPEG', center - w / 2, y, w, h);
        } catch (_) { /* ignore bad image */ }
        y += h + 16;
    } else {
        y += 8;
    }

    // ── Main heading ─────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(17, 24, 39);
    doc.text('Army Institute of Technology, Pune', center, y, { align: 'center' });
    y += 24;

    // ── Secondary heading ────────────────────────────────────────────
    doc.setFontSize(13);
    doc.setTextColor(29, 78, 216);
    const secondary = type === 'quarter' ? 'Quarter Report' : `${clubName} Report`;
    doc.text(secondary, center, y, { align: 'center' });
    y += 18;

    // ── Time duration (top) ──────────────────────────────────────────
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(`Duration: ${durationLabel}`, center, y, { align: 'center' });
    y += 10;

    const tableStyles = {
        styles: { font: 'helvetica', fontSize: 9, cellPadding: 5, overflow: 'linebreak' },
        headStyles: { fillColor: [17, 24, 39], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 246, 248] },
        margin: { left: marginX, right: marginX },
        theme: 'grid',
    };

    if (type === 'quarter') {
        // Summary table: Club | No. of Events
        autoTable(doc, {
            ...tableStyles,
            startY: y + 8,
            head: [['Club', 'No. of Events']],
            body: clubs.map((c) => [c.club, String(c.count)]),
            columnStyles: { 1: { halign: 'center', cellWidth: 100 } },
        });
        y = doc.lastAutoTable.finalY + 18;

        // Detailed table: # | Club | Event | Date | Venue
        const rows = [];
        clubs.forEach((c) => {
            c.events.forEach((e) => {
                rows.push([c.club, eventName(e), fmtDate(e.date), e.venue || '—']);
            });
        });
        const numbered = rows
            .sort((a, b) => new Date(a[2]) - new Date(b[2]))
            .map((r, i) => [String(i + 1), ...r]);

        autoTable(doc, {
            ...tableStyles,
            startY: y,
            head: [['#', 'Club', 'Event', 'Date', 'Venue']],
            body: numbered,
            columnStyles: {
                0: { cellWidth: 28, halign: 'center' },
                2: { cellWidth: 170 },
                3: { cellWidth: 80 },
            },
        });
    } else {
        // Club report: # | Event | Date | Time | Venue
        const body = events.map((e, i) => [
            String(i + 1),
            eventName(e),
            fmtDate(e.date),
            e.time || '—',
            e.venue || '—',
        ]);

        autoTable(doc, {
            ...tableStyles,
            startY: y + 8,
            head: [['#', 'Event', 'Date', 'Time', 'Venue']],
            body: body.length ? body : [['—', 'No events recorded for this period.', '', '', '']],
            columnStyles: {
                0: { cellWidth: 28, halign: 'center' },
                1: { cellWidth: 200 },
                2: { cellWidth: 85 },
                3: { cellWidth: 70 },
            },
        });
    }

    // ── Total + duration at the very bottom of the last page ─────────
    const pageCount = doc.internal.getNumberOfPages();
    doc.setPage(pageCount);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    const total = totalEvents ?? events.length;
    doc.text(`Total events: ${total}`, marginX, pageHeight - 30);
    doc.text(`Time duration selected: ${durationLabel}`, pageWidth - marginX, pageHeight - 30, { align: 'right' });

    const safe = (type === 'quarter' ? 'Quarter' : (clubName || 'Club')).replace(/[^a-z0-9]+/gi, '_');
    doc.save(`${safe}_Report.pdf`);
}

export default generateReportPdf;
