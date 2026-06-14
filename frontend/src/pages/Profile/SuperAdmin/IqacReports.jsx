import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FileBarChart, CalendarDays, Loader2, Search, Download, LayoutGrid } from 'lucide-react';
import { generateReportPdf } from './generateReportPdf';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

const monthYear = (d) =>
    new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

const DURATION_OPTIONS = [1, 2, 3, 4, 6, 12];

export default function IqacReports() {
    const now = new Date();
    const [clubs, setClubs] = useState([]);

    // ── Club (monthly) report state ──────────────────────────────
    const [clubId, setClubId] = useState('');
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);

    // ── Quarter report state ─────────────────────────────────────
    const [qMonths, setQMonths] = useState(4);
    const [qLoading, setQLoading] = useState(false);
    const [qReport, setQReport] = useState(null);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const res = await axios.get(`${API}/api/superadmin/dashboard`, { withCredentials: true });
                if (res.data?.success) {
                    const list = res.data.data.clubs || [];
                    setClubs(list);
                    if (list.length) setClubId(list[0]._id);
                }
            } catch {
                /* silent */
            }
        };
        fetchClubs();
    }, []);

    const handleGenerate = async (e) => {
        e?.preventDefault();
        if (!clubId) {
            toast.error('Please select a club');
            return;
        }
        setLoading(true);
        setReport(null);
        try {
            const res = await axios.get(`${API}/api/superadmin/generate-iqac-report`, {
                params: { clubId, month, year },
                withCredentials: true,
            });
            if (res.data?.success) {
                setReport(res.data.data);
            } else {
                toast.error(res.data?.message || 'Failed to generate report');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateQuarter = async (e) => {
        e?.preventDefault();
        setQLoading(true);
        setQReport(null);
        try {
            const res = await axios.get(`${API}/api/superadmin/generate-quarter-report`, {
                params: { months: qMonths },
                withCredentials: true,
            });
            if (res.data?.success) {
                setQReport(res.data.data);
            } else {
                toast.error(res.data?.message || 'Failed to generate quarter report');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate quarter report');
        } finally {
            setQLoading(false);
        }
    };

    const exportClubPdf = async () => {
        try {
            await generateReportPdf({
                type: 'club',
                clubName: report.club,
                durationLabel: `${MONTHS[Number(report.month) - 1]} ${report.year}`,
                events: report.events || [],
                totalEvents: report.totalEvents,
            });
        } catch (err) {
            toast.error('Failed to build PDF');
        }
    };

    const exportQuarterPdf = async () => {
        try {
            await generateReportPdf({
                type: 'quarter',
                durationLabel: `${monthYear(qReport.startDate)} – ${monthYear(qReport.endDate)} (${qReport.months} months)`,
                clubs: qReport.clubs || [],
                totalEvents: qReport.totalEvents,
            });
        } catch (err) {
            toast.error('Failed to build PDF');
        }
    };

    const years = Array.from({ length: 11 }, (_, i) => now.getFullYear() - 5 + i);

    return (
        <div className="max-w-5xl mx-auto" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
            <div className="flex items-center gap-3 mb-8">
                <div className="h-11 w-11 rounded-xl bg-gray-900 flex items-center justify-center shadow-sm">
                    <FileBarChart className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">IQAC Reports</h1>
                    <p className="text-sm text-gray-500">Generate per-club and institute-wide activity reports</p>
                </div>
            </div>

            {/* ── Club (monthly) report ─────────────────────────────── */}
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Club Report</h2>
            <form onSubmit={handleGenerate} className="rounded-2xl border border-gray-200 bg-white p-5 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Club</label>
                        <select value={clubId} onChange={(e) => setClubId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                            {clubs.length === 0 && <option value="">No clubs</option>}
                            {clubs.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                            {MONTHS.map((m, i) => (
                                <option key={m} value={i + 1}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <button type="submit" disabled={loading || !clubId} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        Generate Report
                    </button>
                </div>
            </form>

            {report && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-10">
                    <div className="flex items-start justify-between mb-6 pb-5 border-b border-gray-100">
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900">{report.club}</h2>
                            <p className="text-sm text-gray-500 mt-1">Activity Report — {MONTHS[Number(report.month) - 1]} {report.year}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black text-blue-600">{report.totalEvents}</div>
                            <div className="text-[11px] uppercase tracking-wider text-gray-400">Total Events</div>
                        </div>
                    </div>

                    {report.events?.length ? (
                        <div className="space-y-3">
                            {report.events.map((ev) => (
                                <div key={ev._id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                    <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0">
                                        <CalendarDays className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{ev.eventName || ev.name || ev.title || 'Untitled Event'}</p>
                                        {ev.venue && <p className="text-xs text-gray-500 truncate">{ev.venue}</p>}
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 shrink-0">{formatDate(ev.date)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 text-sm">No events recorded for this period.</div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <button onClick={exportClubPdf} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                            <Download className="h-4 w-4" /> Export PDF
                        </button>
                    </div>
                </div>
            )}

            {/* ── Quarter report (institute-wide) ───────────────────── */}
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Quarter Report</h2>
            <form onSubmit={handleGenerateQuarter} className="rounded-2xl border border-gray-200 bg-white p-5 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                        <select value={qMonths} onChange={(e) => setQMonths(Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                            {DURATION_OPTIONS.map((m) => (
                                <option key={m} value={m}>Last {m} month{m > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:col-span-2 flex items-end">
                        <button type="submit" disabled={qLoading} className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50">
                            {qLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LayoutGrid className="h-4 w-4" />}
                            Generate Quarter Report
                        </button>
                    </div>
                </div>
            </form>

            {qReport && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-12">
                    <div className="flex items-start justify-between mb-6 pb-5 border-b border-gray-100">
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900">Quarter Report</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {monthYear(qReport.startDate)} – {monthYear(qReport.endDate)} · {qReport.months} months
                            </p>
                        </div>
                        <div className="flex gap-6 text-right">
                            <div>
                                <div className="text-3xl font-black text-blue-600">{qReport.totalEvents}</div>
                                <div className="text-[11px] uppercase tracking-wider text-gray-400">Events</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-gray-900">{qReport.totalClubs}</div>
                                <div className="text-[11px] uppercase tracking-wider text-gray-400">Clubs</div>
                            </div>
                        </div>
                    </div>

                    {qReport.clubs?.length ? (
                        <div className="space-y-6">
                            {qReport.clubs.map((c) => (
                                <div key={c.club}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-bold text-gray-900">{c.club}</h3>
                                        <span className="text-xs font-semibold text-gray-500">{c.count} event{c.count > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {c.events.map((ev) => (
                                            <div key={ev._id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                                                <CalendarDays className="h-4 w-4 text-blue-600 shrink-0" />
                                                <span className="flex-1 min-w-0 text-sm text-gray-800 truncate">{ev.eventName || ev.name || ev.title || 'Untitled Event'}</span>
                                                <span className="text-xs text-gray-500 shrink-0">{formatDate(ev.date)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 text-sm">No events recorded in this duration.</div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <button onClick={exportQuarterPdf} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                            <Download className="h-4 w-4" /> Export PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
