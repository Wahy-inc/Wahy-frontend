import { api } from "./client";
import type {
	AttendanceAnalytics,
	FinancialAnalytics,
	OperationalAnalytics,
	PerformanceAnalytics,
} from "../data-contracts";

export function getAttendanceAnalytics(options?: {
	startDate?: string;
	endDate?: string;
}): Promise<AttendanceAnalytics> {
	return api<AttendanceAnalytics>("/api/v1/analytics/attendance", {
		query: { start_date: options?.startDate, end_date: options?.endDate },
	});
}

export function getPerformanceAnalytics(options?: {
	startDate?: string;
	endDate?: string;
}): Promise<PerformanceAnalytics> {
	return api<PerformanceAnalytics>("/api/v1/analytics/performance", {
		query: { start_date: options?.startDate, end_date: options?.endDate },
	});
}

export function getFinancialAnalytics(options?: {
	startDate?: string;
	endDate?: string;
}): Promise<FinancialAnalytics> {
	return api<FinancialAnalytics>("/api/v1/analytics/financial", {
		query: { start_date: options?.startDate, end_date: options?.endDate },
	});
}

export function getOperationalAnalytics(options?: {
	startDate?: string;
	endDate?: string;
}): Promise<OperationalAnalytics> {
	return api<OperationalAnalytics>("/api/v1/analytics/operational", {
		query: { start_date: options?.startDate, end_date: options?.endDate },
	});
}
