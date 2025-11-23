"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FileText, Download, X, Loader2, CalendarIcon, Filter, ChevronDown } from "lucide-react"
import { format } from "date-fns"

type ReportType = "DailySummary" | "MonthlySummary" | "ProductPerformance"

interface Report {
    id: string
    title: string
    date: string
    size: string
    type: ReportType
}

const reportTypes: ReportType[] = ["DailySummary", "MonthlySummary", "ProductPerformance"]

const initialReports: Report[] = [
    { id: "1", title: "Q4 Financial Overview", date: "Dec 2024", size: "2.4 MB", type: "MonthlySummary" },
    { id: "2", title: "Annual Marketing Strategy", date: "Jan 2025", size: "1.8 MB", type: "ProductPerformance" },
    { id: "3", title: "User Growth Analysis", date: "Feb 2025", size: "3.2 MB", type: "DailySummary" },
    { id: "4", title: "Technical Infrastructure Audit", date: "Mar 2025", size: "4.5 MB", type: "MonthlySummary" },
    { id: "5", title: "Q1 Executive Summary", date: "Apr 2025", size: "1.2 MB", type: "DailySummary" },
]

interface ReportsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ReportsModal({ isOpen, onClose }: ReportsModalProps) {
    const [reports, setReports] = useState<Report[]>(initialReports)
    const [isLoading, setIsLoading] = useState(false)
    const [date, setDate] = useState<string>("")
    const [reportType, setReportType] = useState<ReportType | "all">("all")
    const observerTarget = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            setReports(initialReports)
            setDate("")
            setReportType("all")
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            setReports([])
        }
    }, [date, reportType, isOpen])

    const loadMoreReports = useCallback(async () => {
        if (isLoading) return
        setIsLoading(true)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const nextId = reports.length + 1
        const newReports: Report[] = Array.from({ length: 5 }).map((_, i) => {
            const type = reportType === "all" ? reportTypes[Math.floor(Math.random() * reportTypes.length)] : reportType
            const reportDate = date ? format(new Date(date), "MMM yyyy") : `Archive ${2024 - Math.floor((nextId + i) / 5)}`

            return {
                id: `${nextId + i}-${Date.now()}`,
                title: `${type.replace(/([A-Z])/g, " $1").trim()} - ${reportDate}`,
                date: reportDate,
                size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
                type: type,
            }
        })

        setReports((prev) => [...prev, ...newReports])
        setIsLoading(false)
    }, [reports.length, isLoading, date, reportType])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    loadMoreReports()
                }
            },
            { threshold: 0.1 },
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current)
            }
        }
    }, [loadMoreReports, isLoading])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-white/10 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
                    >
                        <div className="bg-white  rounded-2xl shadow-xl overflow-hidden border border-zinc-200 flex flex-col max-h-[85vh]">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-zinc-100 shrink-0">
                                <h2 className="text-xl font-semibold text-zinc-900">Available Reports</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="p-4 border-b border-zinc-100 grid grid-cols-2 gap-4 shrink-0">
                                {/* Date Picker */}
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                        <CalendarIcon className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full h-10 pl-9 pr-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 placeholder-zinc-500 appearance-none"
                                    />
                                </div>

                                {/* Report Type Select */}
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                        <Filter className="w-4 h-4" />
                                    </div>
                                    <select
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value as ReportType | "all")}
                                        className="w-full h-10 pl-9 pr-8 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 appearance-none cursor-pointer"
                                    >
                                        <option value="all">All Types</option>
                                        {reportTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type.replace(/([A-Z])/g, " $1").trim()}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* List */}
                            <div className="overflow-y-auto p-4 space-y-2 flex-1 min-h-[300px]">
                                {reports.length === 0 && !isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                                        <p>No reports found matching your filters</p>
                                    </div>
                                ) : (
                                    reports.map((report, index) => (
                                        <motion.div
                                            key={report.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index < 5 ? index * 0.05 : 0 }}
                                            className="group flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-zinc-900">{report.title}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                                                        <span className="font-medium text-zinc-600">
                                                            {report.type.replace(/([A-Z])/g, " $1").trim()}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{report.date}</span>
                                                        <span>•</span>
                                                        <span>{report.size}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))
                                )}

                                {/* Loading Sentinel */}
                                <div ref={observerTarget} className="h-10 flex items-center justify-center w-full shrink-0">
                                    {isLoading && (
                                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Loading more reports...</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center shrink-0">
                                <p className="text-xs text-zinc-500">
                                    Need access to older archives?{" "}
                                    <a href="#" className="text-blue-600 hover:underline font-medium">
                                        Contact Support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
