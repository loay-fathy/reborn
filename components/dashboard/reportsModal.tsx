"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FileText, Download, X, Loader2, CalendarIcon, Filter, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { getAuthToken } from "@/lib/auth"

type ReportType = "DailySummary" | "MonthlySummary" | "ProductPerformance"

interface Report {
    id: number
    generatedAt: string
    type: string
}

interface ReportsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ReportsModal({ isOpen, onClose }: ReportsModalProps) {
    const [reports, setReports] = useState<Report[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [date, setDate] = useState<string>("")
    const [reportType, setReportType] = useState<string>("all")
    const [pageNumber, setPageNumber] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const observerTarget = useRef<HTMLDivElement>(null)
    const token = getAuthToken()

    // Reset state when modal opens or filters change
    useEffect(() => {
        if (isOpen) {
            setReports([])
            setPageNumber(1)
            setHasMore(true)
        }
    }, [isOpen, date, reportType])

    const fetchReports = useCallback(async () => {
        if (isLoading || !hasMore) return
        setIsLoading(true)

        try {
            const params = new URLSearchParams({
                pageNumber: pageNumber.toString(),
                pageSize: "10",
            })

            if (reportType !== "all") {
                params.append("type", reportType)
            }
            if (date) {
                params.append("date", date)
            }

            const res = await fetch(`/api/reports?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) throw new Error("Failed to fetch reports")

            const data = await res.json()

            if (data.data && Array.isArray(data.data)) {
                setReports((prev) => {
                    // Filter out duplicates based on ID
                    const newReports = data.data.filter((newReport: Report) =>
                        !prev.some((existing) => existing.id === newReport.id)
                    )
                    return pageNumber === 1 ? data.data : [...prev, ...newReports]
                })
                setHasMore(pageNumber < data.totalPages)
                if (pageNumber < data.totalPages) {
                    setPageNumber(prev => prev + 1)
                } else {
                    setHasMore(false)
                }
            } else {
                setHasMore(false)
            }

        } catch (error) {
            console.error("Error fetching reports:", error)
        } finally {
            setIsLoading(false)
        }
    }, [pageNumber, reportType, date, token, hasMore, isLoading])

    // Initial load and infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMore) {
                    fetchReports()
                }
            },
            { threshold: 0.1 }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current)
            }
        }
    }, [fetchReports, isLoading, hasMore])

    // Trigger initial fetch when filters change (reset handled in other effect)
    useEffect(() => {
        if (isOpen && pageNumber === 1 && !isLoading) {
            fetchReports()
        }
    }, [isOpen, date, reportType])


    const handleDownload = async (id: number, title: string) => {
        try {
            const res = await fetch(`/api/reports/${id}/download`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) throw new Error("Failed to download report")

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${title}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error("Error downloading report:", error)
            alert("Failed to download report")
        }
    }

    const formatReportTitle = (type: string, dateStr: string) => {
        const formattedDate = format(new Date(dateStr), "MMM dd, yyyy")
        return `${type.replace(/([A-Z])/g, " $1").trim()} - ${formattedDate}`
    }

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
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="w-full h-10 pl-9 pr-8 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 appearance-none cursor-pointer"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="DailySummary">Daily Summary</option>
                                        <option value="MonthlySummary">Monthly Summary</option>
                                        <option value="ProductPerformance">Product Performance</option>
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
                                    reports.map((report, index) => {
                                        const title = formatReportTitle(report.type, report.generatedAt)
                                        return (
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
                                                        <h3 className="font-medium text-zinc-900">{title}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                                                            <span className="font-medium text-zinc-600">
                                                                {report.type.replace(/([A-Z])/g, " $1").trim()}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{format(new Date(report.generatedAt), "MMM dd, yyyy HH:mm")}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDownload(report.id, title)}
                                                    className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        )
                                    })
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

