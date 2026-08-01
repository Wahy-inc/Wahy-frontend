import { Badge } from "@/components/ui/badge";
import type {
	AttendanceStatus,
	InvoiceStatus,
	ResetRequestStatus,
	StudentStatus,
	WirdAssignmentStatus,
} from "@/lib/data-contracts";
import type { ReactNode } from "react";
import { useLocalization } from "@/lib/localization-context";

export type BadgeVariant =
	| "default"
	| "secondary"
	| "destructive"
	| "outline"
	| "success"
	| "warning";

const variantClass: Record<BadgeVariant, string> = {
	default: "bg-primary text-primary-foreground",
	secondary: "bg-secondary text-secondary-foreground",
	destructive: "bg-destructive text-white",
	outline: "border-border text-foreground",
	success: "bg-success text-white",
	warning: "bg-warning text-black",
};

interface StatusBadgeProps {
	variant: BadgeVariant;
	children: ReactNode;
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
	return (
		<Badge className={variantClass[variant]} data-status={variant}>
			{children}
		</Badge>
	);
}

const attendanceVariant: Record<AttendanceStatus, BadgeVariant> = {
	present: "success",
	late: "warning",
	absent: "destructive",
	excused: "secondary",
};

const attendanceLabelKey: Record<AttendanceStatus, string> = {
	present: "lessons.present",
	late: "lessons.late",
	absent: "lessons.absent",
	excused: "lessons.excused",
};

export function AttendanceBadge({
	status,
}: {
	status: AttendanceStatus | null;
}) {
	const { t } = useLocalization();
	if (status === null) {
		return <StatusBadge variant="outline">{t("classes.not_held")}</StatusBadge>;
	}
	return (
		<StatusBadge variant={attendanceVariant[status]}>
			{t(attendanceLabelKey[status])}
		</StatusBadge>
	);
}

const invoiceVariant: Record<InvoiceStatus, BadgeVariant> = {
	generated: "secondary",
	sent: "default",
	paid: "success",
	overdue: "destructive",
	cancelled: "outline",
};

const invoiceLabelKey: Record<InvoiceStatus, string> = {
	generated: "invoices.generated_label",
	sent: "invoices.sent",
	paid: "invoices.paid",
	overdue: "invoices.overdue",
	cancelled: "invoices.cancelled",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
	const { t } = useLocalization();
	return (
		<StatusBadge variant={invoiceVariant[status]}>
			{t(invoiceLabelKey[status])}
		</StatusBadge>
	);
}

const wirdVariant: Record<WirdAssignmentStatus, BadgeVariant> = {
	assigned: "secondary",
	completed_by_student: "default",
	verified_by_sheikh: "success",
	needs_retry: "warning",
	cancelled: "outline",
};

const wirdLabelKey: Record<WirdAssignmentStatus, string> = {
	assigned: "wird.assigned",
	completed_by_student: "wird.completed",
	verified_by_sheikh: "wird.verified",
	needs_retry: "wird.needs_retry",
	cancelled: "wird.cancelled",
};

export function WirdStatusBadge({ status }: { status: WirdAssignmentStatus }) {
	const { t } = useLocalization();
	return (
		<StatusBadge variant={wirdVariant[status]}>
			{t(wirdLabelKey[status])}
		</StatusBadge>
	);
}

const studentVariant: Record<StudentStatus, BadgeVariant> = {
	active: "success",
	on_hold: "warning",
	graduated: "default",
	inactive: "secondary",
};

const studentLabelKey: Record<StudentStatus, string> = {
	active: "schedules.active",
	on_hold: "students.status_on_hold",
	graduated: "students.status_graduated",
	inactive: "schedules.inactive",
};

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
	const { t } = useLocalization();
	return (
		<StatusBadge variant={studentVariant[status]}>
			{t(studentLabelKey[status])}
		</StatusBadge>
	);
}

const resetVariant: Record<ResetRequestStatus, BadgeVariant> = {
	pending: "warning",
	approved: "default",
	rejected: "destructive",
	completed: "success",
	expired: "outline",
};

const resetLabelKey: Record<ResetRequestStatus, string> = {
	pending: "reset_requests.pending",
	approved: "reset_requests.approved",
	rejected: "reset_requests.rejected",
	completed: "reset_requests.completed",
	expired: "reset_requests.expired",
};

export function ResetRequestStatusBadge({
	status,
}: {
	status: ResetRequestStatus;
}) {
	const { t } = useLocalization();
	return (
		<StatusBadge variant={resetVariant[status]}>
			{t(resetLabelKey[status])}
		</StatusBadge>
	);
}
