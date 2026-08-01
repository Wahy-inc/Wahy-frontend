/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** WirdAssignmentStatus */
export enum WirdAssignmentStatus {
	Assigned = "assigned",
	CompletedByStudent = "completed_by_student",
	VerifiedBySheikh = "verified_by_sheikh",
	NeedsRetry = "needs_retry",
	Cancelled = "cancelled",
}

/** StudentStatus */
export enum StudentStatus {
	Active = "active",
	OnHold = "on_hold",
	Graduated = "graduated",
	Inactive = "inactive",
}

/** ResetRequestStatus */
export enum ResetRequestStatus {
	Pending = "pending",
	Approved = "approved",
	Rejected = "rejected",
	Completed = "completed",
	Expired = "expired",
}

/** NotificationType */
export enum NotificationType {
	UpcomingSession = "upcoming_session",
	ScheduleReminder = "schedule_reminder",
	System = "system",
}

/** LibraryAccessLevel */
export enum LibraryAccessLevel {
	AllStudents = "all_students",
	SpecificStudents = "specific_students",
	Groups = "groups",
}

/** InvoiceStatus */
export enum InvoiceStatus {
	Generated = "generated",
	Sent = "sent",
	Paid = "paid",
	Overdue = "overdue",
	Cancelled = "cancelled",
}

/**
 * DayOfWeek
 * Day of week enumeration for backward compatibility.
 */
export enum DayOfWeek {
	Value1 = 1,
	Value2 = 2,
	Value3 = 3,
	Value4 = 4,
	Value5 = 5,
	Value6 = 6,
	Value7 = 7,
}

/** AttendanceStatus */
export enum AttendanceStatus {
	Present = "present",
	Absent = "absent",
	Late = "late",
	Excused = "excused",
}

/** ActivateRequest */
export interface ActivateRequest {
	/**
	 * Code
	 * One-time activation code (XXXX-XXXX format).
	 * @minLength 7
	 * @maxLength 16
	 */
	code: string;
	/**
	 * New Password
	 * New password. Minimum 8 characters.
	 * @minLength 8
	 * @maxLength 128
	 */
	new_password: string;
}

/**
 * AdminSignupRequest
 * Request body for the initial sheikh admin account creation.
 *
 * Only succeeds when no sheikh exists in the system yet.
 */
export interface AdminSignupRequest {
	/**
	 * Email
	 * Sheikh's email address. Must be unique across all users.
	 * @format email
	 */
	email: string;
	/**
	 * Password
	 * Account password. Minimum 8 characters.
	 * @minLength 8
	 */
	password: string;
}

/**
 * AttendanceAnalytics
 * Attendance KPI summary for a given date range.
 *
 * Returned by ``GET /analytics/attendance``.
 * All counts are scoped to the sheikh's students.
 */
export interface AttendanceAnalytics {
	/**
	 * Period Start
	 * Start of the reporting period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_start: string;
	/**
	 * Period End
	 * End of the reporting period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_end: string;
	/**
	 * Total Lessons
	 * Total number of lesson records within the period.
	 */
	total_lessons: number;
	/**
	 * Present Count
	 * Number of lessons where attendance was ``present``.
	 */
	present_count: number;
	/**
	 * Late Count
	 * Number of lessons where attendance was ``late``.
	 */
	late_count: number;
	/**
	 * Absent Count
	 * Number of lessons where attendance was ``absent``.
	 */
	absent_count: number;
	/**
	 * Excused Count
	 * Number of lessons where attendance was ``excused``.
	 */
	excused_count: number;
	/**
	 * Attendance Rate
	 * Fraction of lessons where the student was present or late (i.e. physically attended). Formula: ``(present_count + late_count) / total_lessons``. Range: 0.0 - 1.0.
	 */
	attendance_rate: number;
}

/** Body_create_api_v1_library_post */
export interface BodyCreateApiV1LibraryPost {
	/** Title */
	title: string;
	/**
	 * External Url
	 * @format uri
	 * @minLength 1
	 * @maxLength 2083
	 */
	external_url: string;
	/** Description */
	description?: string | null;
	/** Category */
	category?: string | null;
	/** Tags */
	tags?: string[] | null;
	/** @default "all_students" */
	access_level?: LibraryAccessLevel;
	/** Thumbnail */
	thumbnail?: File | null;
	/** Student Ids */
	student_ids?: number[] | null;
}

/** Body_upload_class_file_api_v2_class_files__schedule_id__files_post */
export interface BodyUploadClassFileApiV2ClassFilesScheduleIdFilesPost {
	/**
	 * File
	 * File to upload.
	 * @format binary
	 */
	file: File;
}

/** Body_upload_library_file_api_v1_library__item_id__files_post */
export interface BodyUploadLibraryFileApiV1LibraryItemIdFilesPost {
	/**
	 * File
	 * File to upload.
	 * @format binary
	 */
	file: File;
}

/**
 * CalendarFeedRead
 * Calendar feed status and metadata returned by feed info endpoints.
 *
 * Returned by ``GET /calendar/feed`` and ``PATCH /calendar/feed``.
 * The ``feed_url`` is a fully-qualified URL that any calendar client
 * (Google Calendar, Apple Calendar, Outlook, etc.) can subscribe to.
 * The URL includes a secret token; rotate it via
 * ``POST /calendar/feed/rotate`` to invalidate existing subscriptions.
 */
export interface CalendarFeedRead {
	/**
	 * Is Enabled
	 * ``true`` if the ICS feed is currently active and accessible by external calendar clients. ``false`` if the feed has been disabled by the sheikh.
	 */
	is_enabled: boolean;
	/**
	 * Feed Url
	 * Fully-qualified public URL for the ICS feed, including the secret token path segment. Format: ``https://<host>/api/v2/calendar/feed/<token>.ics``. Subscribe this URL in any iCalendar-compatible client. Rotate the token via ``POST /calendar/feed/rotate`` to invalidate existing subscriptions.
	 */
	feed_url: string;
	/**
	 * Last Rotated At
	 * UTC timestamp of the most recent token rotation, or ``null`` if the token has never been rotated since the feed was first created.
	 */
	last_rotated_at: string | null;
	/**
	 * Last Accessed At
	 * UTC timestamp of the most recent ICS feed download by an external calendar client, or ``null`` if the feed has never been accessed. Useful for detecting stale subscriptions.
	 */
	last_accessed_at: string | null;
}

/**
 * CalendarFeedRotateRead
 * Response body for ``POST /calendar/feed/rotate``.
 *
 * Returns the new feed URL after the secret token has been rotated.
 * All previous feed URLs containing the old token are immediately
 * invalidated and will return **404 Not Found**.
 *
 * Subscribers must update their calendar client to use the new
 * ``feed_url`` - the sheikh should distribute the new URL manually
 * (e.g. via WhatsApp or email).
 */
export interface CalendarFeedRotateRead {
	/**
	 * Feed Url
	 * The new fully-qualified ICS feed URL containing the rotated secret token. Distribute this URL to all calendar subscribers to restore their sync. The previous URL is now permanently invalidated.
	 */
	feed_url: string;
	/**
	 * Rotated At
	 * UTC timestamp when the token rotation was performed. Corresponds to the ``last_rotated_at`` field on the feed record.
	 * @format date-time
	 */
	rotated_at: string;
}

/**
 * CalendarFeedUpdate
 * Request body for ``PATCH /calendar/feed`` (sheikh-only).
 *
 * Enables or disables the public ICS calendar feed. When disabled,
 * attempts to access the feed URL return **404 Not Found** so that
 * subscribed calendar clients gracefully stop syncing.
 */
export interface CalendarFeedUpdate {
	/**
	 * Is Enabled
	 * **Required.** ``true`` to activate the ICS feed and allow external calendar clients to subscribe. ``false`` to deactivate the feed - the feed URL will return 404 until re-enabled.
	 */
	is_enabled: boolean;
}

/** CalendarGridResponse */
export interface CalendarGridResponse {
	/** Slots */
	slots: CalendarSlotItem[];
}

/** CalendarSlotItem */
export interface CalendarSlotItem {
	/**
	 * Date
	 * Date of this calendar slot (YYYY-MM-DD).
	 * @format date
	 */
	date: string;
	/**
	 * Start Time
	 * Lesson start time in UTC.
	 * @format time
	 */
	start_time: string;
	/**
	 * End Time
	 * Lesson end time in UTC.
	 * @format time
	 */
	end_time: string;
	/**
	 * Schedule Id
	 * ID of the schedule.
	 */
	schedule_id: number;
	/**
	 * Student Id
	 * ID of the student.
	 */
	student_id: number;
	/**
	 * Student Name En
	 * Student name in English.
	 */
	student_name_en: string;
	/**
	 * Student Name Ar
	 * Student name in Arabic.
	 */
	student_name_ar: string;
	/** Recorded lesson for this slot, or null if not yet recorded. */
	lesson_data?: LessonRead | null;
}

/** ChildCreate */
export interface ChildCreate {
	/**
	 * Full Name Arabic
	 * @minLength 1
	 * @maxLength 255
	 */
	full_name_arabic: string;
	/**
	 * Full Name English
	 * @minLength 1
	 * @maxLength 255
	 */
	full_name_english: string;
	/** Date Of Birth */
	date_of_birth?: string | null;
	/**
	 * Timezone
	 * @maxLength 64
	 * @default "UTC"
	 */
	timezone?: string;
	/** Base Rate */
	base_rate?: number | null;
	/**
	 * Lessons Per Week
	 * @min 1
	 * @max 14
	 * @default 2
	 */
	lessons_per_week?: number;
	/** Private Notes */
	private_notes?: string | null;
	/** Special Notes */
	special_notes?: string | null;
}

/** ChildRead */
export interface ChildRead {
	/** Id */
	id: number;
	/** Full Name Arabic */
	full_name_arabic: string;
	/** Full Name English */
	full_name_english: string;
	/** Date Of Birth */
	date_of_birth: string | null;
	/** Timezone */
	timezone: string;
	/** Status */
	status: string;
	/** Lessons Per Week */
	lessons_per_week: number;
	/** Base Rate */
	base_rate: number | null;
	/** Private Notes */
	private_notes: string | null;
	/** Special Notes */
	special_notes: string | null;
}

/** ClassAttendanceSummary */
export interface ClassAttendanceSummary {
	/** Schedule Id */
	schedule_id: number;
	/** Student Name En */
	student_name_en: string;
	/** Student Name Ar */
	student_name_ar: string;
	/**
	 * Period Start
	 * @format date
	 */
	period_start: string;
	/**
	 * Period End
	 * @format date
	 */
	period_end: string;
	/**
	 * Expected Sessions
	 * Number of scheduled sessions in the period.
	 */
	expected_sessions: number;
	/**
	 * Attended Sessions
	 * Sessions attended (present or late).
	 */
	attended_sessions: number;
	/**
	 * Absent Sessions
	 * Sessions missed (absent).
	 */
	absent_sessions: number;
	/**
	 * Attendance Rate
	 * Fraction of sessions attended. Range 0.0 - 1.0.
	 */
	attendance_rate: number;
}

/** ClassFileRead */
export interface ClassFileRead {
	/**
	 * Id
	 * Auto-generated file ID.
	 */
	id: number;
	/**
	 * Schedule Id
	 * ID of the schedule (class group).
	 */
	schedule_id: number;
	/**
	 * Sheikh Id
	 * ID of the owning sheikh.
	 */
	sheikh_id: number;
	/**
	 * Original Filename
	 * Original uploaded filename.
	 */
	original_filename: string;
	/**
	 * Stored Filename
	 * Server-side stored filename.
	 */
	stored_filename: string;
	/**
	 * File Path
	 * Server-side file path.
	 */
	file_path: string;
	/**
	 * File Size Bytes
	 * File size in bytes.
	 */
	file_size_bytes: number;
	/**
	 * Mime Type
	 * MIME type of the file.
	 */
	mime_type: string;
	/**
	 * Download Count
	 * Number of times the file has been downloaded.
	 */
	download_count: number;
	/**
	 * Created At
	 * @format date-time
	 */
	created_at: string;
	/**
	 * Updated At
	 * @format date-time
	 */
	updated_at: string;
}

/** ClassGroupItem */
export interface ClassGroupItem {
	/**
	 * Schedule Id
	 * ID of the schedule representing this class group.
	 */
	schedule_id: number;
	/**
	 * Student Id
	 * ID of the student.
	 */
	student_id: number;
	/**
	 * Student Name En
	 * Student name in English.
	 */
	student_name_en: string;
	/**
	 * Student Name Ar
	 * Student name in Arabic.
	 */
	student_name_ar: string;
	/**
	 * Day Label
	 * Human-readable day label (e.g. 'Monday', 'Friday').
	 */
	day_label: string;
	/**
	 * Day Of Week
	 * Day of the week. Values: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 7=Sunday.
	 */
	day_of_week: number;
	/**
	 * Start Time
	 * Lesson start time in UTC.
	 * @format time
	 */
	start_time: string;
	/**
	 * End Time
	 * Lesson end time in UTC.
	 * @format time
	 */
	end_time: string;
	/**
	 * Effective From
	 * Start date of the schedule.
	 * @format date
	 */
	effective_from: string;
	/**
	 * Next Occurrence
	 * Next upcoming date for this class, or null.
	 */
	next_occurrence: string | null;
	/**
	 * Total Lessons
	 * Total lessons recorded for this class.
	 */
	total_lessons: number;
	/**
	 * Is Active
	 * Whether the schedule is active.
	 */
	is_active: boolean;
}

/** ClassGroupListResponse */
export interface ClassGroupListResponse {
	/** Classes */
	classes: ClassGroupItem[];
}

/** ClassHistoryResponse */
export interface ClassHistoryResponse {
	/** Lessons */
	lessons: LessonRead[];
	/** Total */
	total: number;
}

/** ConflictItem */
export interface ConflictItem {
	/** Kind */
	kind: "lesson" | "schedule_occurrence";
	/** Lesson Id */
	lesson_id?: number | null;
	/** Schedule Id */
	schedule_id?: number | null;
	/** Student Id */
	student_id?: number | null;
	/**
	 * Student Name
	 * @default ""
	 */
	student_name?: string;
	/**
	 * Start
	 * @format date-time
	 */
	start: string;
	/**
	 * End
	 * @format date-time
	 */
	end: string;
}

/**
 * FinancialAnalytics
 * Financial KPI summary for a given date range.
 *
 * Returned by ``GET /analytics/financial``.
 * Covers all invoices generated within the period for the sheikh's students.
 */
export interface FinancialAnalytics {
	/**
	 * Period Start
	 * Start of the reporting period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_start: string;
	/**
	 * Period End
	 * End of the reporting period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_end: string;
	/**
	 * Total Revenue
	 * Sum of ``total_amount`` across all invoices with status ``paid`` that were generated within the period.
	 */
	total_revenue: number;
	/**
	 * Invoice Count
	 * Total number of invoices generated within the period.
	 */
	invoice_count: number;
	/**
	 * Overdue Count
	 * Number of invoices whose ``due_date`` is in the past and whose status is still ``generated`` or ``sent`` (i.e. unpaid and overdue).
	 */
	overdue_count: number;
	/**
	 * Revenue Per Student
	 * Per-student revenue breakdown for the period. Only students with at least one paid invoice are included.
	 */
	revenue_per_student: RevenuePerParent[];
}

/** HTTPValidationError */
export interface HTTPValidationError {
	/** Detail */
	detail?: ValidationError[];
}

/** InviteCodeRead */
export interface InviteCodeRead {
	/** Invite Code */
	invite_code: string;
	/**
	 * Invite Expires At
	 * @format date-time
	 */
	invite_expires_at: string;
}

/**
 * InvoiceItemOverrideRequest
 * Request body for ``POST /invoices/{id}/overrides`` (sheikh-only).
 *
 * Changes the ``billable`` flag on a single invoice item and records a
 * mandatory reason in the audit trail.
 *
 * **Billing rules:**
 *
 * * ``present`` → already billable by default; can be set to ``false``.
 * * ``late`` / ``excused`` → non-billable by default; can be set to ``true``.
 * * ``absent`` → **cannot** be overridden to ``true``; the service will
 *   raise a 400 error.
 */
export interface InvoiceItemOverrideRequest {
	/**
	 * Item Id
	 * **Required.** ID of the ``InvoiceItem`` to override. Must belong to the specified invoice.
	 */
	item_id: number;
	/**
	 * Billable
	 * **Required.** New billable flag. ``true`` = include in invoice total; ``false`` = exclude. Cannot be set to ``true`` when the underlying lesson attendance is ``absent``.
	 */
	billable: boolean;
	/**
	 * Override Reason
	 * **Required.** Reason for the override. Minimum 3 characters, maximum 255. Recorded in the activity audit log.
	 * @minLength 3
	 * @maxLength 255
	 */
	override_reason: string;
}

/**
 * InvoiceItemRead
 * A single line-item within an invoice.
 */
export interface InvoiceItemRead {
	/**
	 * Id
	 * Auto-generated invoice item ID.
	 */
	id: number;
	/**
	 * Invoice Id
	 * ID of the parent invoice.
	 */
	invoice_id: number;
	/**
	 * Student Id
	 * ID of the student this line item belongs to.
	 */
	student_id: number | null;
	/**
	 * Lesson Id
	 * ID of the lesson this item was generated from, or ``null`` for manually added items.
	 */
	lesson_id: number | null;
	/**
	 * Description
	 * Human-readable line-item description (e.g. lesson date and type).
	 */
	description: string;
	/**
	 * Rate
	 * Per-unit billing rate applied to this item.
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	rate: string;
	/**
	 * Quantity
	 * Number of units (typically ``1`` per lesson).
	 */
	quantity: number;
	/**
	 * Amount
	 * Total line-item amount: ``rate x quantity``.
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	amount: string;
	/**
	 * Billable
	 * Whether this item is included in the invoice total. Defaults to ``true`` for ``present`` attendance and ``false`` otherwise. Can be overridden via ``POST /invoices/{id}/overrides``.
	 */
	billable: boolean;
	/**
	 * Override Reason
	 * Reason provided when the sheikh manually changed ``billable``, or ``null`` if no override was applied.
	 */
	override_reason: string | null;
}

/**
 * InvoicePaidRequest
 * Request body for ``PATCH /invoices/{id}/paid`` (sheikh-only).
 *
 * Records payment details and transitions the invoice status to ``paid``.
 * Only ``paid_date`` is required; all other fields are optional but
 * recommended for accurate financial records.
 */
export interface InvoicePaidRequest {
	/**
	 * Paid Date
	 * **Required.** Date payment was received (ISO 8601, YYYY-MM-DD).
	 * @format date
	 */
	paid_date: string;
	/**
	 * Payment Method
	 * **Optional.** Payment method used. Free-text; common values: ``cash``, ``bank_transfer``, ``credit_card``, ``paypal``.
	 */
	payment_method?: string | null;
	/**
	 * Payment Reference
	 * **Optional.** Transaction ID, cheque number, or any other payment reference for reconciliation.
	 */
	payment_reference?: string | null;
	/**
	 * Payment Notes
	 * **Optional.** Free-text notes about the payment (e.g. partial payment arrangements, late-fee waiver).
	 */
	payment_notes?: string | null;
}

/**
 * InvoiceRead
 * Invoice summary record (without line items).
 *
 * Use ``InvoiceWithItemsRead`` (returned by ``GET /invoices/{id}`` and
 * ``POST /invoices/generate``) to include line items.
 */
export interface InvoiceRead {
	/**
	 * Id
	 * Auto-generated invoice ID.
	 */
	id: number;
	/**
	 * Parent Id
	 * ID of the parent account.
	 */
	parent_id: number;
	/**
	 * Sheikh Id
	 * ID of the owning sheikh.
	 */
	sheikh_id: number;
	/**
	 * Invoice Number
	 * Unique human-readable invoice reference (e.g. ``INV-2026-0042``).
	 */
	invoice_number: string;
	/**
	 * Period From
	 * Start of the billing period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_from: string;
	/**
	 * Period To
	 * End of the billing period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_to: string;
	/**
	 * Total Amount
	 * Sum of all **billable** line items. Recalculated whenever an override changes a line item's ``billable`` flag.
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	total_amount: string;
	/**
	 * Currency
	 * ISO 4217 currency code (e.g. ``USD``, ``SAR``). Defaults to ``USD``.
	 */
	currency: string;
	/** Invoice lifecycle status. Values: ``generated`` · ``sent`` · ``paid`` · ``overdue`` · ``cancelled``. */
	status: InvoiceStatus;
	/**
	 * Generated Date
	 * Date the invoice was first generated (YYYY-MM-DD).
	 * @format date
	 */
	generated_date: string;
	/**
	 * Due Date
	 * Payment due date (YYYY-MM-DD).
	 * @format date
	 */
	due_date: string;
	/**
	 * Paid Date
	 * Date payment was received (YYYY-MM-DD), or ``null`` if unpaid.
	 */
	paid_date: string | null;
	/**
	 * Payment Method
	 * Payment method recorded at the time of payment, or ``null``.
	 */
	payment_method: string | null;
	/**
	 * Payment Reference
	 * Transaction / reference number recorded at payment, or ``null``.
	 */
	payment_reference: string | null;
	/**
	 * Payment Notes
	 * Free-text payment notes, or ``null``.
	 */
	payment_notes: string | null;
	/**
	 * Pdf Path
	 * Server-side path to the generated PDF file, or ``null`` if the PDF has not been generated yet. Use ``GET /invoices/{id}/pdf`` to download (auto-generates on first access).
	 */
	pdf_path: string | null;
	/**
	 * Pdf Generated At
	 * UTC timestamp when the PDF was last generated, or ``null``. PDFs are auto-deleted after 6 months.
	 */
	pdf_generated_at: string | null;
	/**
	 * Cancelled At
	 * When the invoice was cancelled, or ``null``.
	 */
	cancelled_at: string | null;
}

/**
 * InvoiceWithItemsRead
 * Invoice record with its full list of line items.
 *
 * Returned by ``POST /invoices/generate``, ``GET /invoices/{id}``, and
 * the student-facing ``GET /invoices/me/{id}``.
 */
export interface InvoiceWithItemsRead {
	/**
	 * Id
	 * Auto-generated invoice ID.
	 */
	id: number;
	/**
	 * Parent Id
	 * ID of the parent account.
	 */
	parent_id: number;
	/**
	 * Sheikh Id
	 * ID of the owning sheikh.
	 */
	sheikh_id: number;
	/**
	 * Invoice Number
	 * Unique human-readable invoice reference (e.g. ``INV-2026-0042``).
	 */
	invoice_number: string;
	/**
	 * Period From
	 * Start of the billing period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_from: string;
	/**
	 * Period To
	 * End of the billing period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_to: string;
	/**
	 * Total Amount
	 * Sum of all **billable** line items. Recalculated whenever an override changes a line item's ``billable`` flag.
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	total_amount: string;
	/**
	 * Currency
	 * ISO 4217 currency code (e.g. ``USD``, ``SAR``). Defaults to ``USD``.
	 */
	currency: string;
	/** Invoice lifecycle status. Values: ``generated`` · ``sent`` · ``paid`` · ``overdue`` · ``cancelled``. */
	status: InvoiceStatus;
	/**
	 * Generated Date
	 * Date the invoice was first generated (YYYY-MM-DD).
	 * @format date
	 */
	generated_date: string;
	/**
	 * Due Date
	 * Payment due date (YYYY-MM-DD).
	 * @format date
	 */
	due_date: string;
	/**
	 * Paid Date
	 * Date payment was received (YYYY-MM-DD), or ``null`` if unpaid.
	 */
	paid_date: string | null;
	/**
	 * Payment Method
	 * Payment method recorded at the time of payment, or ``null``.
	 */
	payment_method: string | null;
	/**
	 * Payment Reference
	 * Transaction / reference number recorded at payment, or ``null``.
	 */
	payment_reference: string | null;
	/**
	 * Payment Notes
	 * Free-text payment notes, or ``null``.
	 */
	payment_notes: string | null;
	/**
	 * Pdf Path
	 * Server-side path to the generated PDF file, or ``null`` if the PDF has not been generated yet. Use ``GET /invoices/{id}/pdf`` to download (auto-generates on first access).
	 */
	pdf_path: string | null;
	/**
	 * Pdf Generated At
	 * UTC timestamp when the PDF was last generated, or ``null``. PDFs are auto-deleted after 6 months.
	 */
	pdf_generated_at: string | null;
	/**
	 * Cancelled At
	 * When the invoice was cancelled, or ``null``.
	 */
	cancelled_at: string | null;
	/**
	 * Items
	 * Ordered list of invoice line items. Each item corresponds to one lesson within the billing period. Items with ``billable=false`` are excluded from ``total_amount``.
	 */
	items: InvoiceItemRead[];
	/**
	 * Recipient Student Ids
	 * Student IDs included in this invoice. Contains one ID for single-student invoices and multiple IDs for group invoices.
	 */
	recipient_student_ids?: number[];
}

/**
 * LessonCreate
 * Request body for ``POST /lessons`` (sheikh-only).
 *
 * Creates one lesson record, or multiple if recurrence is specified.
 *
 * Fields marked **Required** must always be present. Fields marked
 * **Optional** may be omitted; they default to ``null`` or the shown
 * default value.
 */
export interface LessonCreate {
	/**
	 * Student Id
	 * **Required.** ID of the student this lesson belongs to. Must be a student under the current sheikh.
	 */
	student_id: number;
	/**
	 * Schedule Id
	 * **Required.** ID of the schedule this lesson belongs to. Must be a schedule under the current sheikh.
	 */
	schedule_id: number;
	/**
	 * Date
	 * **Required.** Date the lesson took place (ISO 8601, YYYY-MM-DD).
	 * @format date
	 */
	date: string;
	/**
	 * **Optional.** Attendance status for this lesson. Allowed values: ``present`` · ``absent`` · ``late`` · ``excused``. Defaults to ``present``. Affects default billing: ``present`` → billable; all others → non-billable (overridable via ``POST /invoices/{id}/overrides``).
	 * @default "present"
	 */
	attendance?: AttendanceStatus;
	/**
	 * Student Notes
	 * **Optional.** Notes visible to the student (e.g. feedback, encouragement).
	 */
	student_notes?: string | null;
	/**
	 * Sheikh Notes
	 * **Optional.** Internal sheikh-only notes about this lesson.
	 */
	sheikh_notes?: string | null;
	/**
	 * What Is Heard From Sheikh
	 * **Optional.** Free-text notes about what was heard from the sheikh during the session.
	 */
	what_is_heard_from_sheikh?: string | null;
	/**
	 * Homework
	 * **Optional.** Homework assignment for the student.
	 */
	homework?: string | null;
	/** **Optional.** Recurrence rule for creating multiple lessons. When specified, multiple lessons are created based on the RRULE. All created lessons share the same recurrence_group_id. */
	recurrence?: LessonRecurrence | null;
}

/**
 * LessonRead
 * Full lesson record returned by all lesson endpoints.
 */
export interface LessonRead {
	/**
	 * Id
	 * Auto-generated lesson ID.
	 */
	id: number;
	/**
	 * Student Id
	 * ID of the student this lesson belongs to.
	 */
	student_id: number;
	/**
	 * Sheikh Id
	 * ID of the owning sheikh.
	 */
	sheikh_id: number;
	/**
	 * Schedule Id
	 * ID of the schedule this lesson belongs to.
	 */
	schedule_id: number;
	/**
	 * Recurrence Group Id
	 * Group ID shared by all lessons in a recurrence series, or ``null`` for non-recurring lessons.
	 */
	recurrence_group_id: string | null;
	/**
	 * Date
	 * Date the lesson took place (YYYY-MM-DD).
	 * @format date
	 */
	date: string;
	/**
	 * Start Time
	 * Lesson start time.
	 * @format time
	 */
	start_time: string;
	/**
	 * End Time
	 * Lesson end time.
	 * @format time
	 */
	end_time: string;
	/**
	 * Original Date
	 * Original schedule occurrence date.
	 * @format date
	 */
	original_date: string;
	/** Attendance status. Values: ``present`` · ``absent`` · ``late`` · ``excused``. ``null`` when not yet held. */
	attendance: AttendanceStatus | null;
	/**
	 * Student Notes
	 * Notes visible to the student, or ``null``.
	 */
	student_notes: string | null;
	/**
	 * Sheikh Notes
	 * Internal sheikh-only notes, or ``null``.
	 */
	sheikh_notes: string | null;
	/**
	 * What Is Heard From Sheikh
	 * Notes about what was heard from the sheikh during the session.
	 */
	what_is_heard_from_sheikh: string | null;
	/**
	 * Homework
	 * Homework assignment for the student.
	 */
	homework: string | null;
	/**
	 * Rate
	 * Per-lesson billing rate, or ``null``.
	 */
	rate: number | null;
	/**
	 * Invoice Id
	 * Invoice this lesson belongs to, or ``null``.
	 */
	invoice_id: number | null;
	/**
	 * Billed At
	 * When this lesson was billed, or ``null``.
	 */
	billed_at: string | null;
}

/**
 * LessonRecurrence
 * Recurrence rule for creating multiple lessons at once.
 */
export interface LessonRecurrence {
	/**
	 * Rrule
	 * RFC 5545 RRULE string defining recurrence. Examples: ``FREQ=DAILY;UNTIL=20260305``, ``FREQ=WEEKLY;BYDAY=MO;UNTIL=20260323``, ``FREQ=MONTHLY;BYMONTHDAY=15;UNTIL=20260415``.
	 */
	rrule: string;
}

/**
 * LessonUpdate
 * Partial-update body for ``PATCH /lessons/{id}`` (sheikh-only).
 *
 * Every field is **Optional**. Only supplied fields are written; omitted
 * fields are left unchanged. Send an explicit ``null`` to clear a nullable
 * field.
 */
export interface LessonUpdate {
	/**
	 * Date
	 * **Optional.** Updated lesson date (YYYY-MM-DD).
	 */
	date?: string | null;
	/** **Optional.** Updated attendance status. Allowed values: ``present`` · ``absent`` · ``late`` · ``excused``. */
	attendance?: AttendanceStatus | null;
	/**
	 * Student Notes
	 * **Optional.** Updated notes visible to the student. Send ``null`` to clear.
	 */
	student_notes?: string | null;
	/**
	 * Sheikh Notes
	 * **Optional.** Updated internal sheikh-only notes. Send ``null`` to clear.
	 */
	sheikh_notes?: string | null;
	/**
	 * What Is Heard From Sheikh
	 * **Optional.** Updated notes about what was heard from the sheikh. Send ``null`` to clear.
	 */
	what_is_heard_from_sheikh?: string | null;
	/**
	 * Homework
	 * **Optional.** Updated homework assignment text.
	 */
	homework?: string | null;
}

/**
 * LibraryFileRead
 * File metadata returned by library file endpoints.
 */
export interface LibraryFileRead {
	/**
	 * Id
	 * Auto-generated file ID.
	 */
	id: number;
	/**
	 * Library Item Id
	 * ID of the owning library item.
	 */
	library_item_id: number;
	/**
	 * Sheikh Id
	 * ID of the owning sheikh.
	 */
	sheikh_id: number;
	/**
	 * Original Filename
	 * Original uploaded filename.
	 */
	original_filename: string;
	/**
	 * File Size Bytes
	 * File size in bytes.
	 */
	file_size_bytes: number;
	/**
	 * Mime Type
	 * MIME type of the file.
	 */
	mime_type: string;
	/**
	 * Download Count
	 * Number of times the file has been downloaded.
	 */
	download_count: number;
	/**
	 * Created At
	 * @format date-time
	 */
	created_at: string;
	/**
	 * Updated At
	 * @format date-time
	 */
	updated_at: string;
}

/**
 * LibraryItemRead
 * Full library item record returned by all library endpoints.
 */
export interface LibraryItemRead {
	/**
	 * Id
	 * Auto-generated library item ID.
	 */
	id: number;
	/**
	 * Sheikh Id
	 * ID of the owning sheikh.
	 */
	sheikh_id: number;
	/**
	 * Title
	 * Title of the library item.
	 */
	title: string;
	/**
	 * Description
	 * Description of the library item, or ``null``.
	 */
	description: string | null;
	/**
	 * Category
	 * Category label for grouping items, or ``null``.
	 */
	category: string | null;
	/**
	 * Tags
	 * List of searchable tags, or ``null``.
	 */
	tags: string[] | null;
	/**
	 * Thumbnail Image Path
	 * Path to the uploaded thumbnail image, or ``null``.
	 */
	thumbnail_image_path: string | null;
	/**
	 * External Url
	 * External URL for the resource.
	 * @format uri
	 * @minLength 1
	 * @maxLength 2083
	 */
	external_url: string;
	/** Who can access this item. */
	access_level: LibraryAccessLevel;
	/**
	 * Download Count
	 * Number of times the external URL was opened via a download action.
	 */
	download_count: number;
	/**
	 * View Count
	 * Number of times the item detail was viewed.
	 */
	view_count: number;
	/**
	 * Is Active
	 * ``true`` if the item is visible to eligible students.
	 */
	is_active: boolean;
}

/**
 * LoginRequest
 * Credentials for the admin sign-in endpoint.
 */
export interface LoginRequest {
	/**
	 * Email
	 * Registered email address.
	 * @format email
	 */
	email: string;
	/**
	 * Password
	 * Account password.
	 */
	password: string;
}

/** NotificationRead */
export interface NotificationRead {
	/**
	 * Id
	 * Auto-generated notification ID.
	 */
	id: number;
	/**
	 * User Id
	 * ID of the user this notification belongs to.
	 */
	user_id: number;
	/** Notification type: upcoming_session, schedule_reminder, system. */
	type: NotificationType;
	/**
	 * Title
	 * Notification title.
	 */
	title: string;
	/**
	 * Body
	 * Notification body text, or null.
	 */
	body: string | null;
	/**
	 * Related Entity Type
	 * Entity type this notification relates to, or null.
	 */
	related_entity_type: string | null;
	/**
	 * Related Entity Id
	 * Entity ID this notification relates to, or null.
	 */
	related_entity_id: number | null;
	/**
	 * Is Read
	 * Whether the notification has been read.
	 */
	is_read: boolean;
	/**
	 * Read At
	 * UTC timestamp when the notification was read, or null.
	 */
	read_at: string | null;
	/**
	 * Scheduled For
	 * UTC timestamp when the notification becomes visible, or null.
	 */
	scheduled_for: string | null;
	/**
	 * Created At
	 * @format date-time
	 */
	created_at: string;
	/**
	 * Updated At
	 * @format date-time
	 */
	updated_at: string;
}

/**
 * OperationalAnalytics
 * Operational KPI summary for a given date range.
 *
 * Returned by ``GET /analytics/operational``.
 * Covers registration and lesson activity within the period.
 */
export interface OperationalAnalytics {
	/**
	 * Period Start
	 * Start of the reporting period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_start: string;
	/**
	 * Period End
	 * End of the reporting period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_end: string;
	/**
	 * New Registrations
	 * Number of new student registrations (any ``registration_status``) created within the period.
	 */
	new_registrations: number;
	/**
	 * Active Students
	 * Total number of students currently in ``active`` status (snapshot at query time, not filtered by period).
	 */
	active_students: number;
	/**
	 * Lessons Recorded
	 * Total number of lesson records created within the period across all students.
	 */
	lessons_recorded: number;
}

/** PaginatedResponse[InvoiceRead] */
export interface PaginatedResponseInvoiceRead {
	/** Items */
	items: InvoiceRead[];
	/** Total */
	total: number;
	/** Page */
	page: number;
	/** Per Page */
	per_page: number;
	/** Has Next */
	has_next: boolean;
}

/** PaginatedResponse[LessonRead] */
export interface PaginatedResponseLessonRead {
	/** Items */
	items: LessonRead[];
	/** Total */
	total: number;
	/** Page */
	page: number;
	/** Per Page */
	per_page: number;
	/** Has Next */
	has_next: boolean;
}

/** PaginatedResponse[LibraryItemRead] */
export interface PaginatedResponseLibraryItemRead {
	/** Items */
	items: LibraryItemRead[];
	/** Total */
	total: number;
	/** Page */
	page: number;
	/** Per Page */
	per_page: number;
	/** Has Next */
	has_next: boolean;
}

/** PaginatedResponse[NotificationRead] */
export interface PaginatedResponseNotificationRead {
	/** Items */
	items: NotificationRead[];
	/** Total */
	total: number;
	/** Page */
	page: number;
	/** Per Page */
	per_page: number;
	/** Has Next */
	has_next: boolean;
}

/** PaginatedResponse[ParentRead] */
export interface PaginatedResponseParentRead {
	/** Items */
	items: ParentRead[];
	/** Total */
	total: number;
	/** Page */
	page: number;
	/** Per Page */
	per_page: number;
	/** Has Next */
	has_next: boolean;
}

/** PaginatedResponse[ScheduleRead] */
export interface PaginatedResponseScheduleRead {
	/** Items */
	items: ScheduleRead[];
	/** Total */
	total: number;
	/** Page */
	page: number;
	/** Per Page */
	per_page: number;
	/** Has Next */
	has_next: boolean;
}

/** PaginatedResponse[StudentRead] */
export interface PaginatedResponseStudentRead {
	/** Items */
	items: StudentRead[];
	/** Total */
	total: number;
	/** Page */
	page: number;
	/** Per Page */
	per_page: number;
	/** Has Next */
	has_next: boolean;
}

/** ParentCreate */
export interface ParentCreate {
	/**
	 * Full Name
	 * @minLength 1
	 * @maxLength 255
	 */
	full_name: string;
	/**
	 * Email
	 * @format email
	 */
	email: string;
	/** Phone */
	phone?: string | null;
	/** Private Notes */
	private_notes?: string | null;
	/**
	 * Children
	 * @maxItems 50
	 * @minItems 1
	 */
	children: ChildCreate[];
}

/** ParentCreatedRead */
export interface ParentCreatedRead {
	parent: ParentDetailRead;
	/** Invite Code */
	invite_code: string;
	/**
	 * Invite Expires At
	 * @format date-time
	 */
	invite_expires_at: string;
}

/** ParentDetailRead */
export interface ParentDetailRead {
	/** Id */
	id: number;
	/** Sheikh Id */
	sheikh_id: number;
	/** User Id */
	user_id: number;
	/** Full Name */
	full_name: string;
	/** Email */
	email: string;
	/** Phone */
	phone: string | null;
	/** Private Notes */
	private_notes: string | null;
	/** Is Active */
	is_active: boolean;
	/** Children */
	children: ChildRead[];
}

/** ParentInvoiceGenerateRequest */
export interface ParentInvoiceGenerateRequest {
	/** Student Ids */
	student_ids?: number[] | null;
	/**
	 * Include Absent
	 * @default false
	 */
	include_absent?: boolean;
	/**
	 * Include Late
	 * @default false
	 */
	include_late?: boolean;
	/**
	 * Include Excused
	 * @default false
	 */
	include_excused?: boolean;
	/**
	 * Due Date
	 * Payment due date (ISO 8601).
	 * @format date
	 */
	due_date: string;
	/**
	 * Currency
	 * @maxLength 3
	 * @default "USD"
	 */
	currency?: string;
}

/** ParentRead */
export interface ParentRead {
	/** Id */
	id: number;
	/** Sheikh Id */
	sheikh_id: number;
	/** User Id */
	user_id: number;
	/** Full Name */
	full_name: string;
	/** Email */
	email: string;
	/** Phone */
	phone: string | null;
	/** Private Notes */
	private_notes: string | null;
	/** Is Active */
	is_active: boolean;
	/** Child Count */
	child_count: number;
}

/** ParentUpdate */
export interface ParentUpdate {
	/** Full Name */
	full_name?: string | null;
	/** Email */
	email?: string | null;
	/** Phone */
	phone?: string | null;
	/** Private Notes */
	private_notes?: string | null;
}

/**
 * PerformanceAnalytics
 * Performance KPI summary for a given date range.
 *
 * Returned by ``GET /analytics/performance``.
 * Aggregated across all students belonging to the sheikh.
 */
export interface PerformanceAnalytics {
	/**
	 * Period Start
	 * Start of the reporting period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_start: string;
	/**
	 * Period End
	 * End of the reporting period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_end: string;
	/**
	 * Attended Count
	 * Number of lessons where the student physically attended (``present`` or ``late``).
	 */
	attended_count: number;
	/**
	 * Attendance Rate
	 * Fraction of total lessons where the student attended. Formula: ``attended_count / total_lessons``. Range: 0.0 - 1.0.
	 */
	attendance_rate: number;
	/**
	 * Timeliness Rate
	 * Fraction of attended lessons where the student arrived on time (attendance was ``present``, not ``late``). Formula: ``present_count / attended_count``. Range: 0.0 - 1.0.
	 */
	timeliness_rate: number;
	/**
	 * Determination Score
	 * Composite score combining attendance rate and timeliness. Weighted formula: ``0.5 x attendance_rate + 0.5 x timeliness_rate``. Range: 0.0 - 1.0.
	 */
	determination_score: number;
}

/**
 * RefreshResponse
 * Returned by ``POST /auth/refresh`` after successful token rotation.
 */
export interface RefreshResponse {
	/**
	 * Access Token
	 * Newly issued access token. The ``access_token`` cookie is also rotated automatically.
	 */
	access_token: string;
	/**
	 * Token Type
	 * Token scheme. Always ``"bearer"``.
	 * @default "bearer"
	 */
	token_type?: string;
	/**
	 * Expires At
	 * UTC datetime when the new access token expires (ISO 8601).
	 * @format date-time
	 */
	expires_at: string;
}

/** RescheduleRequest */
export interface RescheduleRequest {
	/**
	 * New Start
	 * New lesson start (ISO 8601).
	 * @format date-time
	 */
	new_start: string;
	/**
	 * New End
	 * New lesson end. Defaults to preserving duration.
	 */
	new_end?: string | null;
	/**
	 * Scope
	 * Scope of the reschedule.
	 * @default "this_only"
	 */
	scope?: "this_only" | "this_and_future";
}

/** RescheduleResponse */
export interface RescheduleResponse {
	/** Lesson */
	lesson: any;
	/**
	 * Affected Lesson Ids
	 * @default []
	 */
	affected_lesson_ids?: number[];
	/**
	 * Conflicts
	 * @default []
	 */
	conflicts?: ConflictItem[];
	/**
	 * Suggested Slots
	 * @default []
	 */
	suggested_slots?: SlotSuggestion[];
}

/** ResetRequestCreate */
export interface ResetRequestCreate {
	/**
	 * Identifier
	 * Email address or phone number identifying your account.
	 * @minLength 1
	 * @maxLength 255
	 */
	identifier: string;
}

/** ResetRequestRead */
export interface ResetRequestRead {
	/** Id */
	id: number;
	/** User Id */
	user_id: number;
	/** Status */
	status: string;
	/** Identifier Used */
	identifier_used: string;
	/**
	 * Created At
	 * @format date-time
	 */
	created_at: string;
	/** Resolved At */
	resolved_at?: string | null;
}

/**
 * RevenuePerParent
 * Revenue breakdown for a single parent within a financial period.
 */
export interface RevenuePerParent {
	/**
	 * Parent Id
	 * ID of the parent.
	 */
	parent_id: number;
	/**
	 * Total Revenue
	 * Total amount billed (sum of ``amount`` for all billable invoice items) for this parent within the reporting period.
	 */
	total_revenue: number;
}

/**
 * ScheduleCreate
 * Request body for ``POST /schedules`` (sheikh-only).
 *
 * Creates a weekly lesson schedule for a student with a recurrence rule.
 *
 * Fields marked **Required** must always be present. Fields marked
 * **Optional** may be omitted; they default to ``null`` or the shown
 * default value.
 */
export interface ScheduleCreate {
	/**
	 * Student Id
	 * **Required.** ID of the student this schedule belongs to. Must be a student under the current sheikh.
	 */
	student_id: number;
	/**
	 * Rrule String
	 * **Optional.** RFC 5545 RRULE string defining recurrence. Example: ``FREQ=WEEKLY;BYDAY=SU`` for weekly Sunday sessions. If omitted or null, the schedule is a one-off session.
	 */
	rrule_string?: string | null;
	/**
	 * Start Time
	 * **Required.** Lesson start time in 24-hour ``HH:MM:SS`` format. Stored and compared in UTC; convert from the student's timezone before sending.
	 * @format time
	 */
	start_time: string;
	/**
	 * End Time
	 * **Required.** Lesson end time in 24-hour ``HH:MM:SS`` format. Must be after ``start_time``.
	 * @format time
	 */
	end_time: string;
	/**
	 * Effective From
	 * **Required.** Date from which the schedule is active (ISO 8601, YYYY-MM-DD).
	 * @format date
	 */
	effective_from: string;
	/**
	 * Notes
	 * **Optional.** Free-text notes about this schedule (e.g. location, special arrangements).
	 */
	notes?: string | null;
}

/**
 * ScheduleRead
 * Full schedule record returned by all schedule endpoints.
 */
export interface ScheduleRead {
	/**
	 * Id
	 * Auto-generated schedule ID.
	 */
	id: number;
	/**
	 * Student Id
	 * ID of the student this schedule belongs to.
	 */
	student_id: number;
	/**
	 * Sheikh Id
	 * ID of the owning sheikh.
	 */
	sheikh_id: number;
	/**
	 * Rrule String
	 * RFC 5545 RRULE string defining recurrence, or ``null`` for one-off. Example: ``FREQ=WEEKLY;BYDAY=SU`` for weekly Sunday sessions.
	 */
	rrule_string: string | null;
	/** Computed day of the week from the RRULE (1=Monday, 7=Sunday). Defaults to Monday if RRULE is missing or invalid. */
	day_of_week: DayOfWeek;
	/**
	 * Day Label
	 * Human-readable day name (e.g. 'Monday', 'Friday').
	 */
	day_label: string;
	/**
	 * Start Time
	 * Lesson start time in UTC (``HH:MM:SS``).
	 * @format time
	 */
	start_time: string;
	/**
	 * End Time
	 * Lesson end time in UTC (``HH:MM:SS``).
	 * @format time
	 */
	end_time: string;
	/**
	 * Effective From
	 * Date from which the schedule is active (YYYY-MM-DD).
	 * @format date
	 */
	effective_from: string;
	/**
	 * Is Active
	 * ``true`` if the schedule is currently active. ``false`` if soft-deleted.
	 */
	is_active: boolean;
	/**
	 * Cancellation Reason
	 * Reason provided when the schedule was deactivated, or ``null``.
	 */
	cancellation_reason: string | null;
	/**
	 * Notes
	 * Free-text schedule notes, or ``null``.
	 */
	notes: string | null;
}

/**
 * ScheduleUpdate
 * Partial-update body for ``PATCH /schedules/{id}`` (sheikh-only).
 *
 * Every field is **Optional**. Only supplied fields are written; omitted
 * fields are left unchanged. Pass an explicit ``null`` to clear a
 * nullable field.
 */
export interface ScheduleUpdate {
	/**
	 * Rrule String
	 * **Optional.** Updated RFC 5545 RRULE string defining recurrence. Example: ``FREQ=WEEKLY;BYDAY=MO`` for weekly Monday sessions. Pass ``null`` to make this a one-off session.
	 */
	rrule_string?: string | null;
	/**
	 * Start Time
	 * **Optional.** Updated lesson start time (``HH:MM:SS``, UTC).
	 */
	start_time?: string | null;
	/**
	 * End Time
	 * **Optional.** Updated lesson end time (``HH:MM:SS``, UTC). Must be after ``start_time`` when both are provided.
	 */
	end_time?: string | null;
	/**
	 * Effective From
	 * **Optional.** Updated effective start date (YYYY-MM-DD).
	 */
	effective_from?: string | null;
	/**
	 * Is Active
	 * **Optional.** Set to ``false`` to soft-deactivate the schedule. Deactivated schedules are excluded from future lesson generation and ICS feed export. Prefer ``DELETE /schedules/{id}`` for a dedicated deactivation flow with audit logging.
	 */
	is_active?: boolean | null;
	/**
	 * Cancellation Reason
	 * **Optional.** Reason for deactivating the schedule. Recorded alongside the status change for audit purposes. Only meaningful when ``is_active`` is set to ``false``.
	 */
	cancellation_reason?: string | null;
	/**
	 * Notes
	 * **Optional.** Updated free-text schedule notes. Send ``null`` to clear.
	 */
	notes?: string | null;
}

/**
 * SheikhPreferencesRead
 * Sheikh preferences record returned by the sheikh endpoints.
 */
export interface SheikhPreferencesRead {
	/**
	 * Id
	 * Auto-generated sheikh record ID.
	 */
	id: number;
	/**
	 * Lesson List Limit
	 * Maximum number of most-recent lessons returned by list endpoints when no explicit ``limit`` query parameter is provided. Range: 1-500. Default: ``15``.
	 */
	lesson_list_limit: number;
}

/**
 * SheikhPreferencesUpdate
 * Partial-update body for ``PATCH /sheikh/preferences`` (sheikh-only).
 *
 * Every field is **Optional**. Only supplied fields are written; omitted
 * fields are left unchanged.
 */
export interface SheikhPreferencesUpdate {
	/**
	 * Lesson List Limit
	 * **Optional.** How many of the most-recent lessons to return in list queries when no ``limit`` query parameter is supplied by the caller. Must be between ``1`` and ``500`` (inclusive). Defaults to ``15`` when not explicitly set.
	 */
	lesson_list_limit?: number | null;
}

/** SlotSuggestion */
export interface SlotSuggestion {
	/**
	 * Start
	 * @format date-time
	 */
	start: string;
	/**
	 * End
	 * @format date-time
	 */
	end: string;
}

/**
 * StudentAttendanceHoursAnalytics
 * Attendance-hours breakdown for a single student over a date range.
 *
 * Returned by:
 *
 * * ``GET /students/{id}/attendance-hours`` (sheikh view)
 * * ``GET /students/me/attendance-hours`` (student self-view)
 *
 * Hours are calculated using the student's ``lessons_per_week`` setting
 * and the average lesson duration derived from their active schedules.
 * When no schedule duration is available the system defaults to 45 minutes
 * per lesson.
 */
export interface StudentAttendanceHoursAnalytics {
	/**
	 * Period Start
	 * Start of the reporting period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_start: string;
	/**
	 * Period End
	 * End of the reporting period (YYYY-MM-DD, inclusive).
	 * @format date
	 */
	period_end: string;
	/**
	 * Hours Per Month
	 * Expected total lesson hours for a full month, based on ``lessons_per_week x average_lesson_duration x weeks_in_month``.
	 */
	hours_per_month: number;
	/**
	 * Hours Attended
	 * Total hours the student actually attended (``present`` or ``late``) within the period.
	 */
	hours_attended: number;
	/**
	 * Remaining Hours
	 * Remaining expected hours in the period that have not yet been attended. Formula: ``max(0, hours_per_month - hours_attended)``. Will be ``0.0`` if the student has already exceeded expectations.
	 */
	remaining_hours: number;
	/**
	 * Absent Hours
	 * Total hours missed due to ``absent`` or ``excused`` attendance within the period.
	 */
	absent_hours: number;
}

/**
 * StudentRead
 * Full student record returned to the sheikh.
 */
export interface StudentRead {
	/**
	 * Id
	 * Auto-generated student ID.
	 */
	id: number;
	/**
	 * Sheikh Id
	 * ID of the owning sheikh.
	 */
	sheikh_id: number;
	/**
	 * Full Name Arabic
	 * Full name in Arabic script.
	 */
	full_name_arabic: string;
	/**
	 * Full Name English
	 * Full name in Latin script.
	 */
	full_name_english: string;
	/**
	 * Date Of Birth
	 * Date of birth, or ``null`` if not provided.
	 */
	date_of_birth: string | null;
	/**
	 * Timezone
	 * IANA timezone identifier.
	 */
	timezone: string;
	/** Operational status. Values: ``active``, ``on_hold``, ``graduated``, ``inactive``. */
	status: StudentStatus;
	/**
	 * Lessons Per Week
	 * Target lessons per week.
	 */
	lessons_per_week: number;
	/**
	 * Base Rate
	 * Per-lesson billing rate, or ``null`` if unset.
	 */
	base_rate: number | null;
	/**
	 * Private Notes
	 * Internal sheikh-only notes, or ``null``.
	 */
	private_notes: string | null;
	/**
	 * Special Notes
	 * Notes visible to the student, or ``null``.
	 */
	special_notes: string | null;
}

/**
 * StudentUpdate
 * Partial-update body for ``PATCH /students/{id}`` (sheikh-only).
 *
 * Every field is **Optional**. Only supplied fields are written; omitted
 * fields are left unchanged. Send an explicit ``null`` to clear a nullable
 * field.
 */
export interface StudentUpdate {
	/**
	 * Full Name Arabic
	 * **Optional.** Updated Arabic full name.
	 */
	full_name_arabic?: string | null;
	/**
	 * Full Name English
	 * **Optional.** Updated Latin full name.
	 */
	full_name_english?: string | null;
	/**
	 * Date Of Birth
	 * **Optional.** Updated date of birth (YYYY-MM-DD).
	 */
	date_of_birth?: string | null;
	/**
	 * Timezone
	 * **Optional.** Updated IANA timezone identifier.
	 */
	timezone?: string | null;
	/** **Optional.** Operational status of the student. Allowed values: ``active``, ``on_hold``, ``graduated``, ``inactive``. */
	status?: StudentStatus | null;
	/**
	 * Lessons Per Week
	 * **Optional.** Updated target lessons per week (1-14).
	 */
	lessons_per_week?: number | null;
	/**
	 * Base Rate
	 * **Optional.** Updated per-lesson billing rate. Send ``null`` to clear the rate.
	 */
	base_rate?: number | null;
	/**
	 * Private Notes
	 * **Optional.** Updated internal sheikh-only notes. Send ``null`` to clear.
	 */
	private_notes?: string | null;
	/**
	 * Special Notes
	 * **Optional.** Updated notes visible to the student. Send ``null`` to clear.
	 */
	special_notes?: string | null;
}

/**
 * TokenResponse
 * Returned by every sign-in, signup, and token-refresh endpoint.
 */
export interface TokenResponse {
	/**
	 * Access Token
	 * Short-lived JWT access token. Also set as the ``access_token`` HTTP-only cookie automatically.
	 */
	access_token: string;
	/**
	 * Role
	 * User role: ``sheikh`` or ``parent``.
	 */
	role: string;
	/**
	 * Token Type
	 * Token scheme. Always ``"bearer"``.
	 * @default "bearer"
	 */
	token_type?: string;
	/**
	 * Expires At
	 * UTC datetime when the access token expires (ISO 8601).
	 * @format date-time
	 */
	expires_at: string;
}

/** UpcomingSessionResponse */
export interface UpcomingSessionResponse {
	/** Schedule Id */
	schedule_id: number;
	/** Student Id */
	student_id: number;
	/** Student Name En */
	student_name_en: string;
	/** Student Name Ar */
	student_name_ar: string;
	/**
	 * Start Time
	 * Lesson start time in UTC (HH:MM:SS).
	 */
	start_time: string;
	/**
	 * End Time
	 * Lesson end time in UTC (HH:MM:SS).
	 */
	end_time: string;
	/**
	 * Date
	 * Session date (YYYY-MM-DD).
	 */
	date: string;
	/** Minutes Until Start */
	minutes_until_start: number;
}

/**
 * UserMeRead
 * Returned by ``GET /auth/me`` for the authenticated session.
 *
 * The client uses this endpoint to resolve its session role without
 * reading the HTTP-only token cookie.
 */
export interface UserMeRead {
	/**
	 * Id
	 * User id of the authenticated account.
	 */
	id: number;
	/**
	 * Email
	 * Email address of the authenticated account.
	 * @format email
	 */
	email: string;
	/**
	 * Role
	 * User role: ``sheikh`` or ``parent``.
	 */
	role: string;
	/**
	 * Is Active
	 * Whether the account is currently active.
	 */
	is_active: boolean;
}

/** ValidationError */
export interface ValidationError {
	/** Location */
	loc: (string | number)[];
	/** Message */
	msg: string;
	/** Error Type */
	type: string;
	/** Input */
	input?: any;
	/** Context */
	ctx?: object;
}

/**
 * WirdAssignmentCreate
 * Request body for ``POST /wird`` (sheikh-only).
 *
 * Creates a manual wird (daily Quran recitation) assignment for a student.
 *
 * Fields marked **Required** must always be present. Fields marked
 * **Optional** may be omitted; they default to ``null`` or the shown
 * default value.
 */
export interface WirdAssignmentCreate {
	/**
	 * Student Id
	 * **Required.** ID of the student this assignment is for. Must be a student under the current sheikh.
	 */
	student_id: number;
	/**
	 * Title
	 * **Required.** Short title describing the wird assignment (e.g. the surah name or memorization goal).
	 * @minLength 1
	 * @maxLength 255
	 */
	title: string;
	/**
	 * Surah Name
	 * **Optional.** Name of the surah this assignment covers. Used for display and filtering.
	 */
	surah_name?: string | null;
	/**
	 * Ayah From
	 * **Optional.** First ayah of the assigned range within ``surah_name``.
	 */
	ayah_from?: number | null;
	/**
	 * Ayah To
	 * **Optional.** Last ayah of the assigned range within ``surah_name``. Must be ≥ ``ayah_from`` when both are provided.
	 */
	ayah_to?: number | null;
	/**
	 * Due Date
	 * **Optional.** Date by which the student should complete the assignment (ISO 8601, YYYY-MM-DD). ``null`` means no deadline.
	 */
	due_date?: string | null;
	/**
	 * Notes
	 * **Optional.** Additional instructions or context for the student (e.g. tajweed rules to focus on).
	 */
	notes?: string | null;
}

/**
 * WirdAssignmentRead
 * Full wird assignment record returned by all wird endpoints.
 */
export interface WirdAssignmentRead {
	/**
	 * Id
	 * Auto-generated wird assignment ID.
	 */
	id: number;
	/**
	 * Student Id
	 * ID of the student this assignment belongs to.
	 */
	student_id: number;
	/**
	 * Sheikh Id
	 * ID of the owning sheikh.
	 */
	sheikh_id: number;
	/**
	 * Source Lesson Id
	 * ID of the lesson associated with this assignment, or ``null`` for manually created assignments.
	 */
	source_lesson_id: number | null;
	/**
	 * Title
	 * Short title of the wird assignment.
	 */
	title: string;
	/**
	 * Surah Name
	 * Surah name covered by this assignment, or ``null``.
	 */
	surah_name: string | null;
	/**
	 * Ayah From
	 * First ayah of the assigned range, or ``null``.
	 */
	ayah_from: number | null;
	/**
	 * Ayah To
	 * Last ayah of the assigned range, or ``null``. Always ≥ ``ayah_from`` when both are set.
	 */
	ayah_to: number | null;
	/**
	 * Due Date
	 * Deadline for the assignment (YYYY-MM-DD), or ``null`` if no deadline was set.
	 */
	due_date: string | null;
	/**
	 * Notes
	 * Sheikh's instructions or context for the student, or ``null``.
	 */
	notes: string | null;
	/** Current assignment status. Values: ``assigned`` · ``completed_by_student`` · ``verified_by_sheikh`` · ``needs_retry`` · ``cancelled``. */
	status: WirdAssignmentStatus;
	/**
	 * Completed At
	 * UTC timestamp when the student submitted their completion claim, or ``null`` if not yet submitted.
	 */
	completed_at: string | null;
	/**
	 * Verified At
	 * UTC timestamp when the sheikh verified (or rejected) the completion, or ``null`` if not yet reviewed.
	 */
	verified_at: string | null;
	/**
	 * Verified By User Id
	 * User ID of the sheikh who performed the verification, or ``null`` if not yet reviewed.
	 */
	verified_by_user_id: number | null;
	/**
	 * Verification Notes
	 * Sheikh's feedback recorded at the time of verification or rejection, or ``null``.
	 */
	verification_notes: string | null;
	/**
	 * Source Updated At
	 * UTC timestamp of the last update to the source record that triggered or last modified this assignment.
	 * @format date-time
	 */
	source_updated_at: string;
	/**
	 * Created At
	 * UTC timestamp when the assignment was first created.
	 * @format date-time
	 */
	created_at: string;
	/**
	 * Updated At
	 * UTC timestamp of the most recent update to this assignment.
	 * @format date-time
	 */
	updated_at: string;
}

/**
 * WirdAssignmentUpdate
 * Partial-update body for ``PATCH /wird/{id}`` (sheikh-only).
 *
 * Every field is **Optional**. Only supplied fields are written; omitted
 * fields are left unchanged. Send an explicit ``null`` to clear a nullable
 * field.
 */
export interface WirdAssignmentUpdate {
	/**
	 * Title
	 * **Optional.** Updated assignment title.
	 */
	title?: string | null;
	/**
	 * Surah Name
	 * **Optional.** Updated surah name. Send ``null`` to clear.
	 */
	surah_name?: string | null;
	/**
	 * Ayah From
	 * **Optional.** Updated starting ayah. Send ``null`` to clear.
	 */
	ayah_from?: number | null;
	/**
	 * Ayah To
	 * **Optional.** Updated ending ayah. Send ``null`` to clear.
	 */
	ayah_to?: number | null;
	/**
	 * Due Date
	 * **Optional.** Updated due date (YYYY-MM-DD). Send ``null`` to remove the deadline.
	 */
	due_date?: string | null;
	/**
	 * Notes
	 * **Optional.** Updated instructions for the student. Send ``null`` to clear.
	 */
	notes?: string | null;
	/** **Optional.** Manual status override by the sheikh. Prefer the dedicated ``/verify`` and ``/reject`` sub-endpoints for audit-trail support. Allowed values: ``assigned`` · ``completed_by_student`` · ``verified_by_sheikh`` · ``needs_retry`` · ``cancelled``. */
	status?: WirdAssignmentStatus | null;
}

/**
 * WirdCompletionSubmit
 * Request body for ``POST /wird/me/{id}/complete`` (student-only).
 *
 * Submits a completion claim for a wird assignment. The sheikh will then
 * verify or reject the submission via the ``/verify`` or ``/reject``
 * sub-endpoints.
 *
 * The ``submitted_notes`` field is optional but encouraged - students can
 * use it to share context (e.g. a recording link or self-assessment).
 */
export interface WirdCompletionSubmit {
	/**
	 * Submitted Notes
	 * **Optional.** Student's notes accompanying the completion submission (e.g. a link to a voice recording, a self-assessment, or questions for the sheikh).
	 */
	submitted_notes?: string | null;
}

/**
 * WirdReviewRequest
 * Request body for ``POST /wird/{id}/verify`` and ``POST /wird/{id}/reject``
 * (sheikh-only).
 *
 * Reviews a student's completion submission. Both ``completion_id`` and
 * ``verification_notes`` are optional, but ``verification_notes`` is
 * strongly recommended for feedback quality and audit clarity.
 */
export interface WirdReviewRequest {
	/**
	 * Completion Id
	 * **Optional.** ID of the specific ``WirdCompletion`` record to review. When ``null`` the latest unreviewed completion for the assignment is used automatically.
	 */
	completion_id?: number | null;
	/**
	 * Verification Notes
	 * **Optional.** Sheikh's feedback on the completion. Recorded in the assignment audit trail and visible to the student after review. Strongly recommended for rejected submissions.
	 */
	verification_notes?: string | null;
}
