/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
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

/** SyncStatus */
export enum SyncStatus {
  Applied = "applied",
  Conflict = "conflict",
  Error = "error",
}

/** SyncOperation */
export enum SyncOperation {
  Create = "create",
  Update = "update",
}

/** StudentStatus */
export enum StudentStatus {
  Active = "active",
  OnHold = "on_hold",
  Graduated = "graduated",
  Inactive = "inactive",
}

/** RegistrationStatus */
export enum RegistrationStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
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

/** LessonType */
export enum LessonType {
  NewMemorization = "new_memorization",
  Revision = "revision",
  Evaluation = "evaluation",
  Makeup = "makeup",
}

/** InvoiceStatus */
export enum InvoiceStatus {
  Generated = "generated",
  Sent = "sent",
  Paid = "paid",
  Overdue = "overdue",
  Cancelled = "cancelled",
}

/** BillingCycle */
export enum BillingCycle {
  Weekly = "weekly",
  Monthly = "monthly",
}

/** AttendanceStatus */
export enum AttendanceStatus {
  Present = "present",
  Absent = "absent",
  Late = "late",
  Excused = "excused",
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
  /**
   * Description
   * Optional description for the library item.
   */
  description?: string | null;
  /**
   * Category
   * Optional category label.
   */
  category?: string | null;
  /**
   * Tags
   * Optional list of tags.
   */
  tags?: string[] | null;
  /**
   * Optional. Defaults to all_students.
   * @default "all_students"
   */
  access_level?: LibraryAccessLevel;
  /**
   * Thumbnail
   * Optional thumbnail image file.
   */
  thumbnail?: File | null;
  /**
   * Student Ids
   * Optional list of student IDs. Required when access_level is specific_students. Omit entirely, or send the literal string 'null', to indicate no restriction (all_students / sheikh_only access levels).
   */
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
 * ``feed_url`` — the sheikh should distribute the new URL manually
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
   * **Required.** ``true`` to activate the ICS feed and allow external calendar clients to subscribe. ``false`` to deactivate the feed — the feed URL will return 404 until re-enabled.
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
   * Human-readable day label, e.g. 'Wednesday' or 'Sat, Mon'.
   */
  day_label: string;
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
   * Rrule String
   * RRULE string or null for one-off.
   */
  rrule_string: string | null;
  /**
   * Effective From
   * Start date of the schedule.
   * @format date
   */
  effective_from: string;
  /**
   * Effective Until
   * End date of the schedule, or null.
   */
  effective_until: string | null;
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
  revenue_per_student: RevenuePerStudent[];
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/**
 * InvoiceGenerateRequest
 * Request body for ``POST /invoices/generate`` (sheikh-only).
 *
 * Scans all lessons for ``student_id`` within the given date range and
 * produces one ``InvoiceItem`` per billable lesson. The resulting invoice
 * is returned immediately; PDF generation is deferred until the PDF
 * endpoint is first accessed.
 */
export interface InvoiceGenerateRequest {
  /**
   * Student Id
   * **Optional.** ID of a single student to invoice. Must belong to the current sheikh.
   */
  student_id?: number | null;
  /**
   * Student Ids
   * **Optional.** One or more student IDs to invoice in a single group invoice. Must belong to the current sheikh.
   */
  student_ids?: number[] | null;
  /**
   * Period From
   * **Required.** Start of the billing period (ISO 8601, YYYY-MM-DD, inclusive).
   * @format date
   */
  period_from: string;
  /**
   * Period To
   * **Required.** End of the billing period (ISO 8601, YYYY-MM-DD, inclusive). Must be ≥ ``period_from``.
   * @format date
   */
  period_to: string;
  /**
   * Due Date
   * **Required.** Payment due date (ISO 8601, YYYY-MM-DD). Typically 7-30 days after ``period_to``.
   * @format date
   */
  due_date: string;
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
   */
  rate: number;
  /**
   * Quantity
   * Number of units (typically ``1`` per lesson).
   */
  quantity: number;
  /**
   * Amount
   * Total line-item amount: ``rate x quantity``.
   */
  amount: number;
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
   * Student Id
   * ID of the invoiced student.
   */
  student_id: number;
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
   */
  total_amount: number;
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
   * Student Id
   * ID of the invoiced student.
   */
  student_id: number;
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
   */
  total_amount: number;
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
 * Creates one lesson record. When the optional ``recurrence`` field is
 * supplied the endpoint expands the RRULE and returns a **list** of lesson
 * records (one per occurrence) sharing a ``recurrence_group_id``.
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
   * Date
   * **Required.** Date the lesson took place (ISO 8601, YYYY-MM-DD). When ``recurrence`` is also provided this date becomes the ``DTSTART`` anchor.
   * @format date
   */
  date: string;
  /** **Required.** Lesson type. Allowed values: ``new_memorization`` · ``revision`` · ``evaluation`` · ``makeup``. */
  type: LessonType;
  /**
   * **Optional.** Attendance status for this lesson. Allowed values: ``present`` · ``absent`` · ``late`` · ``excused``. Defaults to ``present``. Affects default billing: ``present`` → billable; all others → non-billable (overridable via ``POST /invoices/{id}/overrides``).
   * @default "present"
   */
  attendance?: AttendanceStatus;
  /**
   * Absence Reason
   * **Optional.** Reason for absence. Recommended when ``attendance`` is ``absent`` or ``excused``.
   */
  absence_reason?: string | null;
  /**
   * Pass Fail
   * **Optional.** Pass/fail verdict for this lesson. ``true`` = passed, ``false`` = failed. Defaults to ``null`` (not yet evaluated).
   */
  pass_fail?: boolean | null;
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
  /** **Optional.** When present the endpoint expands the RRULE into multiple lesson records all sharing a ``recurrence_group_id``. The response will be a list of lessons in chronological order instead of a single-item list. */
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
   * ID of the schedule this lesson was generated from, or ``null`` for ad-hoc lessons.
   */
  schedule_id: number | null;
  /**
   * Recurrence Group Id
   * UUID shared by all lessons created from the same recurrence expansion. ``null`` for non-recurring lessons.
   */
  recurrence_group_id: string | null;
  /**
   * Date
   * Date the lesson took place (YYYY-MM-DD).
   * @format date
   */
  date: string;
  /** Lesson type. Values: ``new_memorization`` · ``revision`` · ``evaluation`` · ``makeup``. */
  type: LessonType;
  /**
   * Pass Fail
   * Pass/fail verdict. ``true`` = passed, ``false`` = failed, ``null`` = not yet evaluated.
   */
  pass_fail: boolean | null;
  /** Attendance status. Values: ``present`` · ``absent`` · ``late`` · ``excused``. */
  attendance: AttendanceStatus;
  /**
   * Absence Reason
   * Reason for absence, or ``null``.
   */
  absence_reason: string | null;
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
}

/**
 * LessonRecurrence
 * Recurrence rule for bulk lesson creation.
 *
 * When included in ``POST /lessons``, the system expands the RRULE into
 * multiple lesson records that share a common ``recurrence_group_id``.
 * The primary lesson date is used as ``DTSTART``; only occurrences
 * **strictly after** that date are expanded into additional records.
 *
 * The ``rrule`` value **must** contain either an ``UNTIL`` date or a
 * ``COUNT`` (≤ 1000) terminator. Open-ended rules (neither clause present)
 * are rejected to prevent unbounded iteration and potential datetime
 * overflow errors inside dateutil.
 *
 * Examples
 * --------
 * * Weekly until end of year: ``"FREQ=WEEKLY;UNTIL=20261231"``
 * * Tuesday + Thursday weekly: ``"FREQ=WEEKLY;BYDAY=TU,TH;UNTIL=20261231"``
 * * Daily for 10 days: ``"FREQ=DAILY;COUNT=10"``
 * * Monthly: ``"FREQ=MONTHLY;UNTIL=20261231"``
 */
export interface LessonRecurrence {
  /**
   * Rrule
   * **Required.** RFC 5545 RRULE *value* string (no ``RRULE:`` prefix) defining the recurrence pattern. The primary lesson date acts as ``DTSTART``; only occurrences strictly after that date are expanded into additional lessons. Examples: ``"FREQ=WEEKLY;UNTIL=20261231"`` · ``"FREQ=WEEKLY;BYDAY=TU,TH;UNTIL=20261231"`` · ``"FREQ=DAILY;COUNT=10"``.
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
  /** **Optional.** Updated lesson type. Allowed values: ``new_memorization`` · ``revision`` · ``evaluation`` · ``makeup``. */
  type?: LessonType | null;
  /** **Optional.** Updated attendance status. Allowed values: ``present`` · ``absent`` · ``late`` · ``excused``. */
  attendance?: AttendanceStatus | null;
  /**
   * Absence Reason
   * **Optional.** Updated absence reason. Send ``null`` to clear.
   */
  absence_reason?: string | null;
  /**
   * Pass Fail
   * **Optional.** Pass/fail verdict. ``true`` = passed, ``false`` = failed. Defaults to ``null`` (not yet evaluated).
   */
  pass_fail?: boolean | null;
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
   * Server-side path to the uploaded thumbnail image, or ``null`` if no thumbnail was provided.
   */
  thumbnail_image_path: string | null;
  /**
   * External Url
   * External URL for the resource (e.g. YouTube video, Google Drive document, Dropbox link).
   * @format uri
   * @minLength 1
   * @maxLength 2083
   */
  external_url: string;
  /** Who can access this item. Values: ``all_students`` · ``specific_students`` · ``sheikh_only``. */
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
   * ``true`` if the item is visible to eligible students. ``false`` if soft-deleted via ``DELETE /library/{id}``.
   */
  is_active: boolean;
}

/**
 * LoginRequest
 * Credentials for both admin and student sign-in endpoints.
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
   * Passed Count
   * Number of attended lessons where ``pass_fail`` was ``true``.
   */
  passed_count: number;
  /**
   * Pass Rate
   * Fraction of attended lessons that were passed. Formula: ``passed_count / attended_count``. Range: 0.0 - 1.0. Returns ``0.0`` when ``attended_count`` is 0.
   */
  pass_rate: number;
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
   * Composite score combining pass rate, attendance rate, and timeliness. Weighted formula: ``0.5 x pass_rate + 0.3 x attendance_rate + 0.2 x timeliness_rate``. Range: 0.0 - 1.0.
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

/**
 * RevenuePerStudent
 * Revenue breakdown for a single student within a financial period.
 */
export interface RevenuePerStudent {
  /**
   * Student Id
   * ID of the student.
   */
  student_id: number;
  /**
   * Total Revenue
   * Total amount billed (sum of ``amount`` for all billable invoice items) for this student within the reporting period.
   */
  total_revenue: number;
}

/**
 * ScheduleCreate
 * Request body for ``POST /schedules`` (sheikh-only).
 *
 * Creates a recurring or one-off lesson schedule for a student.
 * Recurrence is expressed as an RFC 5545 RRULE *value* string
 * (no ``RRULE:`` prefix). Omit ``rrule_string`` entirely (or pass
 * ``null``) to create a single-occurrence session on ``effective_from``.
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
   * **Optional.** RFC 5545 RRULE *value* string (no ``RRULE:`` prefix) defining the recurrence pattern. Omit or pass ``null`` for a one-off session on ``effective_from``. Examples: ``"FREQ=WEEKLY;BYDAY=SA,MO"`` (every Saturday and Monday) · ``"FREQ=WEEKLY;BYDAY=TU,TH;UNTIL=20261231"`` · ``"FREQ=DAILY;COUNT=10"`` (10 consecutive days).
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
   * **Required.** Date from which the schedule is active (ISO 8601, YYYY-MM-DD). For recurring schedules this is the ``DTSTART`` anchor; for one-off sessions it is the session date.
   * @format date
   */
  effective_from: string;
  /**
   * Effective Until
   * **Optional.** Hard end date for the schedule (ISO 8601, YYYY-MM-DD, inclusive). Occurrences after this date are ignored even if the RRULE would generate them. Omit to run indefinitely.
   */
  effective_until?: string | null;
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
   * RFC 5545 RRULE value string defining the recurrence, or ``null`` for one-off sessions.
   */
  rrule_string: string | null;
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
   * Date from which the schedule is active / the one-off session date (YYYY-MM-DD).
   * @format date
   */
  effective_from: string;
  /**
   * Effective Until
   * Hard end date of the schedule (YYYY-MM-DD, inclusive), or ``null`` if the schedule runs indefinitely.
   */
  effective_until: string | null;
  /**
   * Is Active
   * ``true`` if the schedule is currently active and will generate future lessons / ICS events. ``false`` if soft-deleted.
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
 *
 * To convert a recurring schedule to a one-off session pass
 * ``rrule_string: null``.
 * To deactivate a schedule immediately pass ``is_active: false`` together
 * with an optional ``cancellation_reason``.
 */
export interface ScheduleUpdate {
  /**
   * Rrule String
   * **Optional.** Updated RRULE value string. Pass ``null`` to convert the schedule to a one-off session. Examples: ``"FREQ=WEEKLY;BYDAY=SA,MO"`` · ``"FREQ=WEEKLY;BYDAY=TU,TH;UNTIL=20261231"``.
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
   * **Optional.** Updated effective start date (YYYY-MM-DD). Changing this shifts the RRULE anchor.
   */
  effective_from?: string | null;
  /**
   * Effective Until
   * **Optional.** Updated hard end date (YYYY-MM-DD, inclusive). Pass ``null`` to remove the end date and run indefinitely.
   */
  effective_until?: string | null;
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

/**
 * StudentApprovalRequest
 * Request body for ``POST /students/{id}/approve`` and ``/reject``.
 *
 * The ``notes`` field is optional but strongly recommended for audit-trail
 * clarity.
 */
export interface StudentApprovalRequest {
  /**
   * Notes
   * **Optional.** Approval or rejection notes recorded in the activity log. Maximum 500 characters.
   */
  notes?: string | null;
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
 * StudentCreate
 * Request body for creating a student directly (sheikh-only).
 *
 * All fields marked **Optional** may be omitted; they default to ``null``
 * or the shown default value. Fields without a default are **required**.
 */
export interface StudentCreate {
  /**
   * User Id
   * **Optional.** ID of an existing User account to link to this student profile. Omit when creating an offline/unlinked student.
   */
  user_id?: number | null;
  /**
   * Full Name Arabic
   * **Required.** Student's full name in Arabic script.
   * @minLength 1
   * @maxLength 255
   */
  full_name_arabic: string;
  /**
   * Full Name English
   * **Required.** Student's full name in Latin script.
   * @minLength 1
   * @maxLength 255
   */
  full_name_english: string;
  /**
   * Date Of Birth
   * **Optional.** Date of birth (YYYY-MM-DD). Used for age-based reporting.
   */
  date_of_birth?: string | null;
  /**
   * Phone
   * **Optional.** Contact phone number including country code.
   */
  phone?: string | null;
  /**
   * Timezone
   * **Optional.** IANA timezone identifier used for scheduling and display. Defaults to ``UTC``.
   * @maxLength 64
   * @default "UTC"
   */
  timezone?: string;
  /**
   * Lessons Per Week
   * **Optional.** Target lessons per week used for attendance-hours calculations. Defaults to ``2``.
   * @min 1
   * @max 14
   * @default 2
   */
  lessons_per_week?: number;
  /**
   * Lesson Rate
   * **Optional.** Per-lesson billing rate in the sheikh's default currency. Leave ``null`` to configure later.
   */
  lesson_rate?: number | null;
  /**
   * **Optional.** Invoice generation frequency. Allowed values: ``weekly``, ``monthly``. Defaults to ``monthly``.
   * @default "monthly"
   */
  billing_cycle?: BillingCycle;
  /**
   * Private Notes
   * **Optional.** Internal sheikh-only notes (never exposed to the student).
   */
  private_notes?: string | null;
  /**
   * Special Notes
   * **Optional.** Notes visible to the student (e.g. reminders or special instructions).
   */
  special_notes?: string | null;
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
   * User Id
   * Linked User account ID, or ``null`` for offline-only students.
   */
  user_id: number | null;
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
   * Phone
   * Contact phone number, or ``null`` if not provided.
   */
  phone: string | null;
  /**
   * Timezone
   * IANA timezone identifier.
   */
  timezone: string;
  /** Approval workflow status. Values: ``pending``, ``approved``, ``rejected``. */
  registration_status: RegistrationStatus;
  /** Operational status. Values: ``active``, ``on_hold``, ``graduated``, ``inactive``. */
  status: StudentStatus;
  /**
   * Lessons Per Week
   * Target lessons per week.
   */
  lessons_per_week: number;
  /**
   * Lesson Rate
   * Per-lesson billing rate, or ``null`` if unset.
   */
  lesson_rate: number | null;
  /** Invoice frequency: ``weekly`` or ``monthly``. */
  billing_cycle: BillingCycle;
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
 * StudentSelfRead
 * Reduced student record returned to the student themselves.
 *
 * Excludes ``private_notes`` and ``sheikh_id`` which are internal.
 */
export interface StudentSelfRead {
  /**
   * Id
   * Auto-generated student ID.
   */
  id: number;
  /**
   * User Id
   * Linked User account ID, or ``null``.
   */
  user_id: number | null;
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
   * Date of birth, or ``null``.
   */
  date_of_birth: string | null;
  /**
   * Phone
   * Contact phone number, or ``null``.
   */
  phone: string | null;
  /**
   * Timezone
   * IANA timezone identifier.
   */
  timezone: string;
  /** Approval workflow status. Values: ``pending``, ``approved``, ``rejected``. */
  registration_status: RegistrationStatus;
  /** Operational status. Values: ``active``, ``on_hold``, ``graduated``, ``inactive``. */
  status: StudentStatus;
  /**
   * Lessons Per Week
   * Target lessons per week.
   */
  lessons_per_week: number;
  /**
   * Lesson Rate
   * Per-lesson billing rate, or ``null`` if unset.
   */
  lesson_rate: number | null;
  /** Invoice frequency: ``weekly`` or ``monthly``. */
  billing_cycle: BillingCycle;
  /**
   * Special Notes
   * Sheikh notes visible to the student, or ``null``.
   */
  special_notes: string | null;
}

/**
 * StudentSignupRequest
 * Request body for student self-registration.
 *
 * Creates a **User** record plus a linked **Student** profile in
 * ``pending`` registration status. The sheikh must call
 * ``POST /students/{id}/approve`` before the student can access
 * protected resources.
 *
 * Fields marked *Optional* default to ``null`` / the shown default and
 * may be omitted from the request body entirely.
 */
export interface StudentSignupRequest {
  /**
   * Email
   * Student's email address. Must be unique across all users.
   * @format email
   */
  email: string;
  /**
   * Password
   * Account password. Minimum 8 characters.
   * @minLength 8
   */
  password: string;
  /**
   * Full Name Arabic
   * Student's full name in Arabic script.
   */
  full_name_arabic: string;
  /**
   * Full Name English
   * Student's full name in Latin script.
   */
  full_name_english: string;
  /**
   * Date Of Birth
   * **Optional.** Date of birth in ISO 8601 format (YYYY-MM-DD). Used for age-based reporting.
   */
  date_of_birth?: string | null;
  /**
   * Phone
   * **Optional.** Contact phone number including country code.
   */
  phone?: string | null;
  /**
   * Timezone
   * **Optional.** IANA timezone identifier for scheduling. Defaults to ``UTC``.
   * @default "UTC"
   */
  timezone?: string;
  /**
   * Lessons Per Week
   * **Optional.** Target number of lessons per week. Used for attendance-hours calculations. Defaults to ``2``.
   * @min 1
   * @max 14
   * @default 2
   */
  lessons_per_week?: number;
  /**
   * Lesson Rate
   * **Optional.** Per-lesson billing rate in the sheikh's default currency. Omit to leave unset until the sheikh configures it.
   */
  lesson_rate?: number | null;
  /**
   * **Optional.** Invoice generation frequency. Allowed values: ``weekly``, ``monthly``. Defaults to ``monthly``.
   * @default "monthly"
   */
  billing_cycle?: BillingCycle;
  /**
   * Special Notes
   * **Optional.** Free-text notes from the student visible to the sheikh during registration review.
   */
  special_notes?: string | null;
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
   * Phone
   * **Optional.** Updated contact phone number.
   */
  phone?: string | null;
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
   * Lesson Rate
   * **Optional.** Updated per-lesson billing rate. Send ``null`` to clear the rate.
   */
  lesson_rate?: number | null;
  /** **Optional.** Updated billing cycle. Allowed values: ``weekly``, ``monthly``. */
  billing_cycle?: BillingCycle | null;
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
 * SyncAckRequest
 * Request body for ``POST /sync/ack``.
 *
 * Acknowledges sync queue entries that the client has successfully
 * processed. Acknowledged entries are marked as done on the server and
 * excluded from future ``GET /sync/changes`` responses.
 */
export interface SyncAckRequest {
  /**
   * Ids
   * **Required.** List of sync queue entry IDs to acknowledge. Must contain at least one ID. IDs that do not belong to the current sheikh are silently ignored.
   * @minItems 1
   */
  ids: number[];
}

/**
 * SyncChangesResponse
 * Response body for ``GET /sync/changes``.
 *
 * Returns activity-log entries since the optional ``since`` timestamp so
 * offline clients can reconcile their local state with server-side changes
 * made by other sessions.
 */
export interface SyncChangesResponse {
  /**
   * Server Time
   * UTC timestamp at the moment the server generated this response. Persist this value and pass it as the ``since`` query parameter on the next poll to retrieve only newer changes.
   * @format date-time
   */
  server_time: string;
  /**
   * Changes
   * List of activity-log change entries since the requested ``since`` timestamp (or all entries if ``since`` was omitted). Each entry shape: ``{\"id\": int, \"action\": str, \"entity_type\": str, \"entity_id\": int, \"details\": object, \"created_at\": datetime}``.
   */
  changes: Record<string, any>[];
}

/**
 * SyncItemRequest
 * A single offline mutation to be applied on the server.
 *
 * Each item must carry a unique ``idempotency_key`` so the server can
 * safely deduplicate retried flushes without applying the same mutation
 * twice.
 *
 * Supported ``entity_type`` values (case-sensitive):
 * ``student`` · ``lesson`` · ``schedule``
 *
 * Supported ``operation`` values: ``create`` · ``update``
 */
export interface SyncItemRequest {
  /**
   * Entity Type
   * **Required.** Type of the entity being mutated. Case-sensitive. Allowed values: ``student`` · ``lesson`` · ``schedule``.
   */
  entity_type: string;
  /**
   * Entity Id
   * **Optional.** Primary key of the existing entity to mutate. Required for ``update`` and ``delete`` operations; omit or pass ``null`` for ``create`` operations where the server assigns the ID.
   */
  entity_id?: number | null;
  /** **Required.** Mutation type to apply. Allowed values: ``create`` · ``update``. */
  operation: SyncOperation;
  /**
   * Payload
   * **Required.** JSON object containing the field values for the mutation. For ``create`` this is the full creation payload (same shape as the corresponding ``POST`` endpoint body). For ``update`` include only the fields that changed (partial update semantics).
   */
  payload: Record<string, any>;
  /**
   * Idempotency Key
   * **Required.** Client-generated unique key for this mutation. Must be 8-64 characters. The server uses this key to detect and skip duplicate submissions (e.g. when the client retries after a network timeout). Use a UUID v4 or a ``{entity_type}-{uuid}`` pattern for readability.
   * @minLength 8
   * @maxLength 64
   */
  idempotency_key: string;
}

/**
 * SyncItemResponse
 * Per-item result within a ``SyncQueueResponse``.
 *
 * Check ``status`` first:
 *
 * * ``applied`` — mutation was successfully written.
 * * ``conflict`` — server state differs from client assumption; see the
 *   ``conflict`` field for both payloads.
 * * ``error`` — unexpected server-side error; see ``error_message``.
 */
export interface SyncItemResponse {
  /**
   * Sync Id
   * Sync queue entry ID created (or reused) for this mutation. Use this value in ``POST /sync/ack``.
   */
  sync_id: number;
  /**
   * Idempotency Key
   * Echo of the ``idempotency_key`` submitted by the client, for correlation.
   */
  idempotency_key: string;
  /** Result of applying this item. Values: ``applied`` · ``conflict`` · ``error``. */
  status: SyncStatus;
  /**
   * Entity Id
   * ID of the created or updated entity. ``null`` for ``error`` / ``conflict`` results where no entity was written.
   */
  entity_id: number | null;
  /**
   * Error Message
   * **Present when** ``status`` is ``error`` or ``conflict``. Human-readable description of the problem. ``null`` for ``applied`` status.
   */
  error_message?: string | null;
  /**
   * Conflict
   * **Present when** ``status`` is ``conflict``. Contains both the server-current payload and the client-submitted payload so the UI can offer 'keep server / keep client / merge' resolution. Shape: ``{\"server\": {...}, \"client\": {...}}``. ``null`` for all other statuses.
   */
  conflict?: Record<string, any> | null;
}

/**
 * SyncQueueRequest
 * Request body for ``POST /sync/queue``.
 *
 * Submits a batch of offline mutations to the server. The server applies
 * each item in order and returns a per-item status. Items are independent
 * — a failure or conflict on one item does not block subsequent items.
 *
 * When **any** item results in a ``conflict`` status the entire response
 * is returned with HTTP **409 Conflict** so the client can detect that
 * manual resolution is required.
 */
export interface SyncQueueRequest {
  /**
   * Items
   * **Required.** Ordered list of offline mutations to apply. Must contain at least one item. Items are applied sequentially in the order provided.
   * @minItems 1
   */
  items: SyncItemRequest[];
}

/**
 * SyncQueueResponse
 * Response body for ``POST /sync/queue``.
 *
 * When **any** item has ``status: conflict`` the HTTP status code is
 * **409 Conflict**; otherwise it is **200 OK**. The response body
 * structure is identical in both cases.
 */
export interface SyncQueueResponse {
  /**
   * Results
   * Ordered list of per-item results, one entry per item in the request, in the same order.
   */
  results: SyncItemResponse[];
  /**
   * Server Time
   * UTC timestamp at the moment the server finished processing the batch. Use this as the ``since`` cursor for the next ``GET /sync/changes`` call.
   * @format date-time
   */
  server_time: string;
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
  /** Current assignment status. Values: ``pending`` · ``submitted`` · ``verified`` · ``rejected``. */
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
  /** **Optional.** Manual status override by the sheikh. Prefer the dedicated ``/verify`` and ``/reject`` sub-endpoints for audit-trail support. Allowed values: ``pending`` · ``submitted`` · ``verified`` · ``rejected``. */
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
 * The ``submitted_notes`` field is optional but encouraged — students can
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

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:9000";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Wahy API
 * @version 0.1.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @baseUrl http://localhost:9000
 * @contact Wahy Maintainer <maintainer@wahy.app> (https://github.com/k5602/Wahy)
 *
 * ## Overview
 *
 * **Wahy** is a production-grade Islamic-education management API that allows a
 * single sheikh to manage up to 500 students through the full Quran-study
 * lifecycle:
 *
 * * **Student registration** with a pending → approved / rejected workflow
 * * **Lesson recording** with attendance, quality ratings, and auto-homework
 * * **Recurring schedules** using RFC 5545 RRULE strings
 * * **Invoicing** with per-item billing overrides and PDF generation
 * * **Teaching library** with access-control per student
 * * **Analytics** dashboards for attendance, performance, finance, and operations
 * * **Offline-first sync** with idempotency keys and conflict resolution
 * * **Wird (daily recitation)** assignments and completion verification (v2)
 * * **ICS calendar feed** for external calendar subscriptions (v2)
 *
 * ---
 *
 * ## Authentication
 *
 * All protected endpoints require a valid **HTTP-only `access_token` cookie**
 * set by any sign-in or signup endpoint. Roles:
 *
 * | Role | Entitlements |
 * |------|-------------|
 * | `sheikh` | Full management access to all resources |
 * | `student` | Read-only access to own profile, lessons, invoices, library, wird |
 *
 * Refresh the access token silently with `POST /api/v1/auth/refresh` using
 * the `refresh_token` cookie (rotated on every call).
 *
 * ---
 *
 * ## Request tracing
 *
 * Every response includes an **`X-Request-ID`** header. Pass your own value
 * in the request to correlate logs end-to-end.
 *
 * ---
 *
 * ## Versioning
 *
 * | Prefix | Status |
 * |--------|--------|
 * | `/api/v1` | Stable — auth, students, schedules, lessons, invoices, library, analytics, sync, sheikh |
 * | `/api/v2` | Stable — wird, calendar |
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Create the initial sheikh admin account. Only allowed when **no sheikh exists** in the system yet — subsequent calls return ``400 Bad Request``. On success, sets two HTTP-only cookies: ``access_token`` (15 min) and ``refresh_token`` (30 days). The response body also contains the access token for clients that cannot read cookies.
     *
     * @tags auth
     * @name AdminSignupApiV1AuthAdminSignupPost
     * @summary Admin signup
     * @request POST:/api/v1/auth/admin/signup
     * @secure
     */
    adminSignupApiV1AuthAdminSignupPost: (
      data: AdminSignupRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, void | HTTPValidationError>({
        path: `/api/v1/auth/admin/signup`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Sign in as the sheikh admin and set auth cookies. Sets two HTTP-only cookies: ``access_token`` (15 min) and ``refresh_token`` (30 days). Use ``POST /auth/refresh`` to silently rotate the access token before it expires. Returns ``403`` if the email belongs to a non-sheikh account.
     *
     * @tags auth
     * @name AdminSigninApiV1AuthAdminSigninPost
     * @summary Admin signin
     * @request POST:/api/v1/auth/admin/signin
     * @secure
     */
    adminSigninApiV1AuthAdminSigninPost: (
      data: LoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, void | HTTPValidationError>({
        path: `/api/v1/auth/admin/signin`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Self-register a student account. Creates a **User** record and a linked **Student** profile in ``pending`` registration status. The student cannot access protected resources until the sheikh calls ``POST /students/{id}/approve``. Sets two HTTP-only cookies: ``access_token`` (15 min) and ``refresh_token`` (30 days). Returns ``400`` if no sheikh exists yet or if the email is taken.
     *
     * @tags auth
     * @name StudentSignupApiV1AuthStudentSignupPost
     * @summary Student signup
     * @request POST:/api/v1/auth/student/signup
     * @secure
     */
    studentSignupApiV1AuthStudentSignupPost: (
      data: StudentSignupRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, void | HTTPValidationError>({
        path: `/api/v1/auth/student/signup`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Sign in as a student and set auth cookies. Sets two HTTP-only cookies: ``access_token`` (15 min) and ``refresh_token`` (30 days). Note: students with ``registration_status=pending`` can sign in but will receive ``403`` on any endpoint that requires approval. Returns ``403`` if the email belongs to a sheikh account.
     *
     * @tags auth
     * @name StudentSigninApiV1AuthStudentSigninPost
     * @summary Student signin
     * @request POST:/api/v1/auth/student/signin
     * @secure
     */
    studentSigninApiV1AuthStudentSigninPost: (
      data: LoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, void | HTTPValidationError>({
        path: `/api/v1/auth/student/signin`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Silently rotate the refresh token and issue a new access token. Reads the ``refresh_token`` HTTP-only cookie set by a previous sign-in or signup call. Both the ``access_token`` and ``refresh_token`` cookies are updated on success (token rotation). Call this endpoint shortly before the access token expires (15 min TTL) to maintain a seamless session. Returns ``401`` if the refresh token is missing, invalid, or expired.
     *
     * @tags auth
     * @name RefreshApiV1AuthRefreshPost
     * @summary Refresh access token
     * @request POST:/api/v1/auth/refresh
     * @secure
     */
    refreshApiV1AuthRefreshPost: (params: RequestParams = {}) =>
      this.request<RefreshResponse, void | HTTPValidationError>({
        path: `/api/v1/auth/refresh`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Invalidate the current session. Clears the ``access_token`` and ``refresh_token`` HTTP-only cookies, nullifies the stored refresh token hash, and increments the ``auth_version`` counter so that **all existing access tokens** for this account are immediately rejected — even if they have not yet expired. This endpoint is idempotent: calling it without a valid refresh cookie still clears the cookies and returns ``204``.
     *
     * @tags auth
     * @name LogoutApiV1AuthLogoutPost
     * @summary Logout
     * @request POST:/api/v1/auth/logout
     * @secure
     */
    logoutApiV1AuthLogoutPost: (params: RequestParams = {}) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v1/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Return the current authenticated student's profile and registration status. Does **not** expose ``private_notes`` or ``sheikh_id`` — use the sheikh-facing ``GET /students/{id}`` for those fields. Requires the student role; the student does not need to be ``approved`` to call this endpoint.
     *
     * @tags students
     * @name GetMeApiV1StudentsMeGet
     * @summary Get my profile
     * @request GET:/api/v1/students/me
     * @secure
     */
    getMeApiV1StudentsMeGet: (params: RequestParams = {}) =>
      this.request<StudentSelfRead, void | HTTPValidationError>({
        path: `/api/v1/students/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Return attendance-hours breakdown for the current approved student. Calculates expected vs. attended vs. absent hours for the given date range. Defaults to the **current calendar month** when neither ``start_date`` nor ``end_date`` is provided. When only ``end_date`` is supplied, ``start_date`` defaults to the first day of ``end_date``'s month. When only ``start_date`` is supplied, ``end_date`` defaults to the last day of ``start_date``'s month. Requires the student role **and** ``registration_status=approved``.
     *
     * @tags students
     * @name GetMyAttendanceHoursApiV1StudentsMeAttendanceHoursGet
     * @summary Get my attendance hours
     * @request GET:/api/v1/students/me/attendance-hours
     * @secure
     */
    getMyAttendanceHoursApiV1StudentsMeAttendanceHoursGet: (
      query?: {
        /**
         * Start Date
         * Optional start date (YYYY-MM-DD).
         */
        start_date?: string | null;
        /**
         * End Date
         * Optional end date (YYYY-MM-DD).
         */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentAttendanceHoursAnalytics, void | HTTPValidationError>(
        {
          path: `/api/v1/students/me/attendance-hours`,
          method: "GET",
          query: query,
          secure: true,
          format: "json",
          ...params,
        },
      ),

    /**
     * @description List all students belonging to the current sheikh, regardless of registration or operational status. Results are ordered by creation date (newest first). Requires the sheikh role.
     *
     * @tags students
     * @name ListAllApiV1StudentsGet
     * @summary List students
     * @request GET:/api/v1/students
     * @secure
     */
    listAllApiV1StudentsGet: (params: RequestParams = {}) =>
      this.request<StudentRead[], void | HTTPValidationError>({
        path: `/api/v1/students`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new student record directly under the current sheikh (sheikh-only, offline / admin registration flow). The student is created with ``registration_status=approved`` and ``status=active`` immediately — the sheikh performing the creation serves as implicit approval. To link an existing user account, supply ``user_id`` in the body; omit it for offline students without a login. The creation event is recorded in the activity audit log. Requires the sheikh role.
     *
     * @tags students
     * @name CreateApiV1StudentsPost
     * @summary Create student
     * @request POST:/api/v1/students
     * @secure
     */
    createApiV1StudentsPost: (
      data: StudentCreate,
      params: RequestParams = {},
    ) =>
      this.request<StudentRead, void>({
        path: `/api/v1/students`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch a single student record by ID. The student must belong to the current sheikh; requests for students belonging to other sheikhs return ``404``. Includes all fields (``private_notes``, ``sheikh_id``, etc.). Requires the sheikh role.
     *
     * @tags students
     * @name GetOneApiV1StudentsStudentIdGet
     * @summary Get student
     * @request GET:/api/v1/students/{student_id}
     * @secure
     */
    getOneApiV1StudentsStudentIdGet: (
      studentId: number,
      params: RequestParams = {},
    ) =>
      this.request<StudentRead, void | HTTPValidationError>({
        path: `/api/v1/students/${studentId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Partially update a student record. Only fields present in the request body are written; omitted fields are left unchanged. Send an explicit ``null`` to clear a nullable field. To change ``registration_status`` via the dedicated workflow (with proper audit logging) prefer ``POST /students/{id}/approve`` or ``POST /students/{id}/reject``. All changes are recorded in the activity audit log. Returns ``404`` if the student does not belong to this sheikh. Requires the sheikh role.
     *
     * @tags students
     * @name UpdateApiV1StudentsStudentIdPatch
     * @summary Update student
     * @request PATCH:/api/v1/students/{student_id}
     * @secure
     */
    updateApiV1StudentsStudentIdPatch: (
      studentId: number,
      data: StudentUpdate,
      params: RequestParams = {},
    ) =>
      this.request<StudentRead, void>({
        path: `/api/v1/students/${studentId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return attendance-hours breakdown for a specific student. Calculates expected vs. attended vs. absent hours over the given date range. Defaults to the **current calendar month** when neither ``start_date`` nor ``end_date`` is provided. When only ``end_date`` is supplied, ``start_date`` defaults to the first day of ``end_date``'s month. When only ``start_date`` is supplied, ``end_date`` defaults to the last day of ``start_date``'s month. Returns ``404`` if the student does not exist or belongs to another sheikh. Requires the sheikh role.
     *
     * @tags students
     * @name GetStudentAttendanceHoursApiV1StudentsStudentIdAttendanceHoursGet
     * @summary Get student attendance hours
     * @request GET:/api/v1/students/{student_id}/attendance-hours
     * @secure
     */
    getStudentAttendanceHoursApiV1StudentsStudentIdAttendanceHoursGet: (
      studentId: number,
      query?: {
        /**
         * Start Date
         * Optional start date (YYYY-MM-DD).
         */
        start_date?: string | null;
        /**
         * End Date
         * Optional end date (YYYY-MM-DD).
         */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentAttendanceHoursAnalytics, void | HTTPValidationError>(
        {
          path: `/api/v1/students/${studentId}/attendance-hours`,
          method: "GET",
          query: query,
          secure: true,
          format: "json",
          ...params,
        },
      ),

    /**
     * @description Approve a pending student registration. Sets ``registration_status`` from ``pending`` to ``approved``. After approval the student can access all endpoints that require ``require_student_approved`` (lessons, invoices, library, wird). The status transition and optional ``notes`` are recorded in the activity audit log. Returns ``404`` if the student does not belong to this sheikh. Requires the sheikh role.
     *
     * @tags students
     * @name ApproveApiV1StudentsStudentIdApprovePost
     * @summary Approve student
     * @request POST:/api/v1/students/{student_id}/approve
     * @secure
     */
    approveApiV1StudentsStudentIdApprovePost: (
      studentId: number,
      data: StudentApprovalRequest,
      params: RequestParams = {},
    ) =>
      this.request<StudentRead, void | HTTPValidationError>({
        path: `/api/v1/students/${studentId}/approve`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Reject a pending student registration. Sets ``registration_status`` from ``pending`` to ``rejected``. Rejected students can still sign in but cannot access any ``require_student_approved`` endpoints. The status transition and optional ``notes`` are recorded in the activity audit log. Returns ``404`` if the student does not belong to this sheikh. Requires the sheikh role.
     *
     * @tags students
     * @name RejectApiV1StudentsStudentIdRejectPost
     * @summary Reject student
     * @request POST:/api/v1/students/{student_id}/reject
     * @secure
     */
    rejectApiV1StudentsStudentIdRejectPost: (
      studentId: number,
      data: StudentApprovalRequest,
      params: RequestParams = {},
    ) =>
      this.request<StudentRead, void | HTTPValidationError>({
        path: `/api/v1/students/${studentId}/reject`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List schedules for the current approved student.
     *
     * @tags schedules
     * @name ListMyScheduleApiV1SchedulesMeGet
     * @summary List my schedule
     * @request GET:/api/v1/schedules/me
     * @secure
     */
    listMyScheduleApiV1SchedulesMeGet: (params: RequestParams = {}) =>
      this.request<ScheduleRead[], HTTPValidationError>({
        path: `/api/v1/schedules/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description List all schedules for the sheikh.
     *
     * @tags schedules
     * @name ListAllApiV1SchedulesGet
     * @summary List schedules (sheikh)
     * @request GET:/api/v1/schedules
     * @secure
     */
    listAllApiV1SchedulesGet: (params: RequestParams = {}) =>
      this.request<ScheduleRead[], HTTPValidationError>({
        path: `/api/v1/schedules`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new schedule for a student.
     *
     * @tags schedules
     * @name CreateApiV1SchedulesPost
     * @summary Create schedule
     * @request POST:/api/v1/schedules
     * @secure
     */
    createApiV1SchedulesPost: (
      data: ScheduleCreate,
      params: RequestParams = {},
    ) =>
      this.request<ScheduleRead, HTTPValidationError>({
        path: `/api/v1/schedules`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List schedules for a specific student.
     *
     * @tags schedules
     * @name ListForStudentApiV1SchedulesStudentStudentIdGet
     * @summary List schedules for student
     * @request GET:/api/v1/schedules/student/{student_id}
     * @secure
     */
    listForStudentApiV1SchedulesStudentStudentIdGet: (
      studentId: number,
      params: RequestParams = {},
    ) =>
      this.request<ScheduleRead[], HTTPValidationError>({
        path: `/api/v1/schedules/student/${studentId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing schedule.
     *
     * @tags schedules
     * @name UpdateApiV1SchedulesScheduleIdPatch
     * @summary Update schedule
     * @request PATCH:/api/v1/schedules/{schedule_id}
     * @secure
     */
    updateApiV1SchedulesScheduleIdPatch: (
      scheduleId: number,
      data: ScheduleUpdate,
      params: RequestParams = {},
    ) =>
      this.request<ScheduleRead, HTTPValidationError>({
        path: `/api/v1/schedules/${scheduleId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivate a schedule by id.
     *
     * @tags schedules
     * @name DeleteApiV1SchedulesScheduleIdDelete
     * @summary Deactivate schedule
     * @request DELETE:/api/v1/schedules/{schedule_id}
     * @secure
     */
    deleteApiV1SchedulesScheduleIdDelete: (
      scheduleId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v1/schedules/${scheduleId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Return the most-recent lessons for the current approved student. The number of results is capped by the sheikh's saved ``lesson_list_limit`` preference (default ``15``) unless overridden by the ``limit`` query parameter (range 1-500). Results are ordered by ``date`` descending (newest first). Only lessons belonging to this student are returned — no cross-student data leakage. Requires the student role **and** ``registration_status=approved``.
     *
     * @tags lessons
     * @name ListMyLessonsApiV1LessonsMeGet
     * @summary List my lessons
     * @request GET:/api/v1/lessons/me
     * @secure
     */
    listMyLessonsApiV1LessonsMeGet: (
      query?: {
        /**
         * Limit
         * Max lessons to return. Defaults to sheikh's preference.
         */
        limit?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<LessonRead[], void | HTTPValidationError>({
        path: `/api/v1/lessons/me`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch a single lesson record by ID for the current approved student. Returns ``404`` if the lesson does not exist or belongs to a different student. Requires the student role **and** ``registration_status=approved``.
     *
     * @tags lessons
     * @name GetMyLessonApiV1LessonsMeLessonIdGet
     * @summary Get my lesson
     * @request GET:/api/v1/lessons/me/{lesson_id}
     * @secure
     */
    getMyLessonApiV1LessonsMeLessonIdGet: (
      lessonId: number,
      params: RequestParams = {},
    ) =>
      this.request<LessonRead, void | HTTPValidationError>({
        path: `/api/v1/lessons/me/${lessonId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description List lessons across all students, with an optional ``student_id`` filter to scope results to a single student. Returns at most ``limit`` of the most-recent lessons; when omitted the sheikh's saved ``lesson_list_limit`` preference (default ``15``) is used. The ``limit`` query parameter accepts values 1-500. Results are ordered by ``date`` descending (newest first). Requires the sheikh role.
     *
     * @tags lessons
     * @name ListAllApiV1LessonsGet
     * @summary List lessons (sheikh)
     * @request GET:/api/v1/lessons
     * @secure
     */
    listAllApiV1LessonsGet: (
      query?: {
        /**
         * Student Id
         * Optional student ID filter.
         */
        student_id?: number | null;
        /**
         * Limit
         * Max lessons to return. Defaults to sheikh's preference.
         */
        limit?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<LessonRead[], void | HTTPValidationError>({
        path: `/api/v1/lessons`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Record one or more lessons for a student. When the optional ``recurrence`` field is omitted the response list contains exactly **one** lesson. When ``recurrence`` is supplied the RRULE is expanded starting from the primary ``date`` field; all generated lessons share a common ``recurrence_group_id`` UUID and are returned in chronological order. Each created lesson is recorded in the activity audit log. Returns ``404`` if ``student_id`` does not belong to this sheikh. Requires the sheikh role.
     *
     * @tags lessons
     * @name CreateApiV1LessonsPost
     * @summary Create lesson(s)
     * @request POST:/api/v1/lessons
     * @secure
     */
    createApiV1LessonsPost: (data: LessonCreate, params: RequestParams = {}) =>
      this.request<LessonRead[], void>({
        path: `/api/v1/lessons`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch a single lesson record by ID. The lesson must belong to the current sheikh; lessons from other sheikhs return ``404``. Requires the sheikh role.
     *
     * @tags lessons
     * @name GetOneApiV1LessonsLessonIdGet
     * @summary Get lesson (sheikh)
     * @request GET:/api/v1/lessons/{lesson_id}
     * @secure
     */
    getOneApiV1LessonsLessonIdGet: (
      lessonId: number,
      params: RequestParams = {},
    ) =>
      this.request<LessonRead, void | HTTPValidationError>({
        path: `/api/v1/lessons/${lessonId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Partially update an existing lesson record. Only fields present in the request body are written; omitted fields are left unchanged. Send an explicit ``null`` to clear a nullable field. All changes are recorded in the activity audit log. Returns ``404`` if the lesson does not belong to this sheikh. Requires the sheikh role.
     *
     * @tags lessons
     * @name UpdateApiV1LessonsLessonIdPatch
     * @summary Update lesson
     * @request PATCH:/api/v1/lessons/{lesson_id}
     * @secure
     */
    updateApiV1LessonsLessonIdPatch: (
      lessonId: number,
      data: LessonUpdate,
      params: RequestParams = {},
    ) =>
      this.request<LessonRead, void>({
        path: `/api/v1/lessons/${lessonId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List invoices for the current approved student.
     *
     * @tags invoices
     * @name ListMyInvoicesApiV1InvoicesMeGet
     * @summary List my invoices
     * @request GET:/api/v1/invoices/me
     * @secure
     */
    listMyInvoicesApiV1InvoicesMeGet: (params: RequestParams = {}) =>
      this.request<InvoiceRead[], HTTPValidationError>({
        path: `/api/v1/invoices/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch an invoice by id for the current student.
     *
     * @tags invoices
     * @name GetMyInvoiceApiV1InvoicesMeInvoiceIdGet
     * @summary Get my invoice
     * @request GET:/api/v1/invoices/me/{invoice_id}
     * @secure
     */
    getMyInvoiceApiV1InvoicesMeInvoiceIdGet: (
      invoiceId: number,
      params: RequestParams = {},
    ) =>
      this.request<InvoiceWithItemsRead, HTTPValidationError>({
        path: `/api/v1/invoices/me/${invoiceId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Download the invoice PDF for the current student.
     *
     * @tags invoices
     * @name GetMyPdfApiV1InvoicesMeInvoiceIdPdfGet
     * @summary Download my invoice PDF
     * @request GET:/api/v1/invoices/me/{invoice_id}/pdf
     * @secure
     */
    getMyPdfApiV1InvoicesMeInvoiceIdPdfGet: (
      invoiceId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v1/invoices/me/${invoiceId}/pdf`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Generate a new invoice for a student and period.
     *
     * @tags invoices
     * @name GenerateApiV1InvoicesGeneratePost
     * @summary Generate invoice
     * @request POST:/api/v1/invoices/generate
     * @secure
     */
    generateApiV1InvoicesGeneratePost: (
      data: InvoiceGenerateRequest,
      params: RequestParams = {},
    ) =>
      this.request<InvoiceWithItemsRead, HTTPValidationError>({
        path: `/api/v1/invoices/generate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List invoices with optional student filter.
     *
     * @tags invoices
     * @name ListAllApiV1InvoicesGet
     * @summary List invoices (sheikh)
     * @request GET:/api/v1/invoices
     * @secure
     */
    listAllApiV1InvoicesGet: (
      query?: {
        /**
         * Student Id
         * Optional student ID filter.
         */
        student_id?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<InvoiceRead[], HTTPValidationError>({
        path: `/api/v1/invoices`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch an invoice by id for the sheikh.
     *
     * @tags invoices
     * @name GetOneApiV1InvoicesInvoiceIdGet
     * @summary Get invoice (sheikh)
     * @request GET:/api/v1/invoices/{invoice_id}
     * @secure
     */
    getOneApiV1InvoicesInvoiceIdGet: (
      invoiceId: number,
      params: RequestParams = {},
    ) =>
      this.request<InvoiceWithItemsRead, HTTPValidationError>({
        path: `/api/v1/invoices/${invoiceId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Override billable status for an invoice item.
     *
     * @tags invoices
     * @name OverrideItemApiV1InvoicesInvoiceIdOverridesPost
     * @summary Override invoice item
     * @request POST:/api/v1/invoices/{invoice_id}/overrides
     * @secure
     */
    overrideItemApiV1InvoicesInvoiceIdOverridesPost: (
      invoiceId: number,
      data: InvoiceItemOverrideRequest,
      params: RequestParams = {},
    ) =>
      this.request<InvoiceItemRead, HTTPValidationError>({
        path: `/api/v1/invoices/${invoiceId}/overrides`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Mark an invoice as paid.
     *
     * @tags invoices
     * @name MarkInvoicePaidApiV1InvoicesInvoiceIdPaidPatch
     * @summary Mark invoice paid
     * @request PATCH:/api/v1/invoices/{invoice_id}/paid
     * @secure
     */
    markInvoicePaidApiV1InvoicesInvoiceIdPaidPatch: (
      invoiceId: number,
      data: InvoicePaidRequest,
      params: RequestParams = {},
    ) =>
      this.request<InvoiceRead, HTTPValidationError>({
        path: `/api/v1/invoices/${invoiceId}/paid`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Download or generate the invoice PDF.
     *
     * @tags invoices
     * @name GetPdfApiV1InvoicesInvoiceIdPdfGet
     * @summary Download invoice PDF
     * @request GET:/api/v1/invoices/{invoice_id}/pdf
     * @secure
     */
    getPdfApiV1InvoicesInvoiceIdPdfGet: (
      invoiceId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v1/invoices/${invoiceId}/pdf`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description List all active library items for the sheikh.
     *
     * @tags library
     * @name ListAllApiV1LibraryGet
     * @summary List library items (sheikh)
     * @request GET:/api/v1/library
     * @secure
     */
    listAllApiV1LibraryGet: (params: RequestParams = {}) =>
      this.request<LibraryItemRead[], HTTPValidationError>({
        path: `/api/v1/library`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new library item and optional student access.
     *
     * @tags library
     * @name CreateApiV1LibraryPost
     * @summary Create library item
     * @request POST:/api/v1/library
     * @secure
     */
    createApiV1LibraryPost: (
      data: BodyCreateApiV1LibraryPost,
      params: RequestParams = {},
    ) =>
      this.request<LibraryItemRead, HTTPValidationError>({
        path: `/api/v1/library`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description List library items available to the current student.
     *
     * @tags library
     * @name ListMyLibraryApiV1LibraryMeGet
     * @summary List my library items
     * @request GET:/api/v1/library/me
     * @secure
     */
    listMyLibraryApiV1LibraryMeGet: (params: RequestParams = {}) =>
      this.request<LibraryItemRead[], HTTPValidationError>({
        path: `/api/v1/library/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch a library item by id for the sheikh.
     *
     * @tags library
     * @name GetOneApiV1LibraryItemIdGet
     * @summary Get library item (sheikh)
     * @request GET:/api/v1/library/{item_id}
     * @secure
     */
    getOneApiV1LibraryItemIdGet: (itemId: number, params: RequestParams = {}) =>
      this.request<LibraryItemRead, HTTPValidationError>({
        path: `/api/v1/library/${itemId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivate a library item by id.
     *
     * @tags library
     * @name DeleteApiV1LibraryItemIdDelete
     * @summary Deactivate library item
     * @request DELETE:/api/v1/library/{item_id}
     * @secure
     */
    deleteApiV1LibraryItemIdDelete: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v1/library/${itemId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch a library item available to the current student.
     *
     * @tags library
     * @name GetMyItemApiV1LibraryMeItemIdGet
     * @summary Get my library item
     * @request GET:/api/v1/library/me/{item_id}
     * @secure
     */
    getMyItemApiV1LibraryMeItemIdGet: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<LibraryItemRead, HTTPValidationError>({
        path: `/api/v1/library/me/${itemId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Return attendance KPIs aggregated across all students for a date range. Counts lessons by attendance status (``present``, ``late``, ``absent``, ``excused``) and computes the overall attendance rate. Defaults to the **last 30 days** when neither ``start_date`` nor ``end_date`` is provided. ``end_date`` defaults to today; ``start_date`` defaults to 30 days before ``end_date``. Returns ``400`` when ``start_date`` is after ``end_date``. Requires the sheikh role.
     *
     * @tags analytics
     * @name AttendanceApiV1AnalyticsAttendanceGet
     * @summary Attendance analytics
     * @request GET:/api/v1/analytics/attendance
     * @secure
     */
    attendanceApiV1AnalyticsAttendanceGet: (
      query?: {
        /**
         * Start Date
         * Optional start date (YYYY-MM-DD).
         */
        start_date?: string | null;
        /**
         * End Date
         * Optional end date (YYYY-MM-DD).
         */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<AttendanceAnalytics, void | HTTPValidationError>({
        path: `/api/v1/analytics/attendance`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Return performance KPIs aggregated across all students for a date range. Includes pass rate, attendance rate, timeliness rate, and the composite determination score (``0.5 x pass_rate + 0.3 x attendance_rate + 0.2 x timeliness_rate``). Defaults to the **last 30 days** when neither ``start_date`` nor ``end_date`` is provided. ``end_date`` defaults to today; ``start_date`` defaults to 30 days before ``end_date``. Returns ``400`` when ``start_date`` is after ``end_date``. Requires the sheikh role.
     *
     * @tags analytics
     * @name PerformanceApiV1AnalyticsPerformanceGet
     * @summary Performance analytics
     * @request GET:/api/v1/analytics/performance
     * @secure
     */
    performanceApiV1AnalyticsPerformanceGet: (
      query?: {
        /**
         * Start Date
         * Optional start date (YYYY-MM-DD).
         */
        start_date?: string | null;
        /**
         * End Date
         * Optional end date (YYYY-MM-DD).
         */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<PerformanceAnalytics, void | HTTPValidationError>({
        path: `/api/v1/analytics/performance`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Return revenue KPIs for a date range. Reports total revenue from paid invoices, total invoice count, number of overdue invoices, and a per-student revenue breakdown. An invoice is considered **overdue** when its ``due_date`` is in the past and its status is still ``generated`` or ``sent``. Defaults to the **last 30 days** when neither ``start_date`` nor ``end_date`` is provided. ``end_date`` defaults to today; ``start_date`` defaults to 30 days before ``end_date``. Returns ``400`` when ``start_date`` is after ``end_date``. Requires the sheikh role.
     *
     * @tags analytics
     * @name FinancialApiV1AnalyticsFinancialGet
     * @summary Financial analytics
     * @request GET:/api/v1/analytics/financial
     * @secure
     */
    financialApiV1AnalyticsFinancialGet: (
      query?: {
        /**
         * Start Date
         * Optional start date (YYYY-MM-DD).
         */
        start_date?: string | null;
        /**
         * End Date
         * Optional end date (YYYY-MM-DD).
         */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<FinancialAnalytics, void | HTTPValidationError>({
        path: `/api/v1/analytics/financial`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Return operational KPIs for a date range. Reports new student registrations created within the period, the current total of active students (snapshot at query time, not bounded by the period), and the total lessons recorded within the period across all students. Defaults to the **last 30 days** when neither ``start_date`` nor ``end_date`` is provided. ``end_date`` defaults to today; ``start_date`` defaults to 30 days before ``end_date``. Returns ``400`` when ``start_date`` is after ``end_date``. Requires the sheikh role.
     *
     * @tags analytics
     * @name OperationalApiV1AnalyticsOperationalGet
     * @summary Operational analytics
     * @request GET:/api/v1/analytics/operational
     * @secure
     */
    operationalApiV1AnalyticsOperationalGet: (
      query?: {
        /**
         * Start Date
         * Optional start date (YYYY-MM-DD).
         */
        start_date?: string | null;
        /**
         * End Date
         * Optional end date (YYYY-MM-DD).
         */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<OperationalAnalytics, void | HTTPValidationError>({
        path: `/api/v1/analytics/operational`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Apply offline mutations with idempotency keys and return per-item status. Conflicts return HTTP 409 with both server and client payloads.
     *
     * @tags sync
     * @name QueueApiV1SyncQueuePost
     * @summary Queue offline changes
     * @request POST:/api/v1/sync/queue
     * @secure
     */
    queueApiV1SyncQueuePost: (
      data: SyncQueueRequest,
      params: RequestParams = {},
    ) =>
      this.request<SyncQueueResponse, HTTPValidationError>({
        path: `/api/v1/sync/queue`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return activity log changes since an optional timestamp for offline clients to reconcile state.
     *
     * @tags sync
     * @name ChangesApiV1SyncChangesGet
     * @summary List sync changes
     * @request GET:/api/v1/sync/changes
     * @secure
     */
    changesApiV1SyncChangesGet: (
      query?: {
        /**
         * Since
         * Optional cursor timestamp (RFC 3339).
         */
        since?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<SyncChangesResponse, HTTPValidationError>({
        path: `/api/v1/sync/changes`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Acknowledge processed sync queue entries by id.
     *
     * @tags sync
     * @name AckApiV1SyncAckPost
     * @summary Acknowledge sync items
     * @request POST:/api/v1/sync/ack
     * @secure
     */
    ackApiV1SyncAckPost: (data: SyncAckRequest, params: RequestParams = {}) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v1/sync/ack`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Return the current sheikh's persisted preferences.
     *
     * @tags sheikh
     * @name GetPreferencesApiV1SheikhPreferencesGet
     * @summary Get sheikh preferences
     * @request GET:/api/v1/sheikh/preferences
     * @secure
     */
    getPreferencesApiV1SheikhPreferencesGet: (params: RequestParams = {}) =>
      this.request<SheikhPreferencesRead, HTTPValidationError>({
        path: `/api/v1/sheikh/preferences`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update persisted sheikh preferences such as `lesson_list_limit`. Only supplied fields are changed (partial update).
     *
     * @tags sheikh
     * @name PatchPreferencesApiV1SheikhPreferencesPatch
     * @summary Update sheikh preferences
     * @request PATCH:/api/v1/sheikh/preferences
     * @secure
     */
    patchPreferencesApiV1SheikhPreferencesPatch: (
      data: SheikhPreferencesUpdate,
      params: RequestParams = {},
    ) =>
      this.request<SheikhPreferencesRead, HTTPValidationError>({
        path: `/api/v1/sheikh/preferences`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags wird-v2
     * @name ListAllApiV2WirdGet
     * @summary List wird assignments (sheikh)
     * @request GET:/api/v2/wird
     * @secure
     */
    listAllApiV2WirdGet: (
      query?: {
        /** Student Id */
        student_id?: number | null;
        /** Status */
        status?: WirdAssignmentStatus | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<WirdAssignmentRead[], HTTPValidationError>({
        path: `/api/v2/wird`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags wird-v2
     * @name CreateApiV2WirdPost
     * @summary Create manual wird assignment
     * @request POST:/api/v2/wird
     * @secure
     */
    createApiV2WirdPost: (
      data: WirdAssignmentCreate,
      params: RequestParams = {},
    ) =>
      this.request<WirdAssignmentRead, HTTPValidationError>({
        path: `/api/v2/wird`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags wird-v2
     * @name UpdateApiV2WirdAssignmentIdPatch
     * @summary Update wird assignment (sheikh)
     * @request PATCH:/api/v2/wird/{assignment_id}
     * @secure
     */
    updateApiV2WirdAssignmentIdPatch: (
      assignmentId: number,
      data: WirdAssignmentUpdate,
      params: RequestParams = {},
    ) =>
      this.request<WirdAssignmentRead, HTTPValidationError>({
        path: `/api/v2/wird/${assignmentId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags wird-v2
     * @name VerifyApiV2WirdAssignmentIdVerifyPost
     * @summary Verify wird completion (sheikh)
     * @request POST:/api/v2/wird/{assignment_id}/verify
     * @secure
     */
    verifyApiV2WirdAssignmentIdVerifyPost: (
      assignmentId: number,
      data: WirdReviewRequest,
      params: RequestParams = {},
    ) =>
      this.request<WirdAssignmentRead, HTTPValidationError>({
        path: `/api/v2/wird/${assignmentId}/verify`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags wird-v2
     * @name RejectApiV2WirdAssignmentIdRejectPost
     * @summary Reject wird completion (sheikh)
     * @request POST:/api/v2/wird/{assignment_id}/reject
     * @secure
     */
    rejectApiV2WirdAssignmentIdRejectPost: (
      assignmentId: number,
      data: WirdReviewRequest,
      params: RequestParams = {},
    ) =>
      this.request<WirdAssignmentRead, HTTPValidationError>({
        path: `/api/v2/wird/${assignmentId}/reject`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags wird-v2
     * @name ListMyAssignmentsApiV2WirdMeGet
     * @summary List my wird assignments
     * @request GET:/api/v2/wird/me
     * @secure
     */
    listMyAssignmentsApiV2WirdMeGet: (
      query?: {
        /** Status */
        status?: WirdAssignmentStatus | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<WirdAssignmentRead[], HTTPValidationError>({
        path: `/api/v2/wird/me`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags wird-v2
     * @name CompleteApiV2WirdMeAssignmentIdCompletePost
     * @summary Submit wird completion
     * @request POST:/api/v2/wird/me/{assignment_id}/complete
     * @secure
     */
    completeApiV2WirdMeAssignmentIdCompletePost: (
      assignmentId: number,
      data: WirdCompletionSubmit,
      params: RequestParams = {},
    ) =>
      this.request<WirdAssignmentRead, HTTPValidationError>({
        path: `/api/v2/wird/me/${assignmentId}/complete`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get structured calendar data for a date range.
     *
     * @tags calendar-v2
     * @name GetCalendarGridApiV2CalendarGridGet
     * @summary Calendar grid view
     * @request GET:/api/v2/calendar/grid
     * @secure
     */
    getCalendarGridApiV2CalendarGridGet: (
      query: {
        /**
         * Start Date
         * Start date (YYYY-MM-DD).
         * @format date
         */
        start_date: string;
        /**
         * End Date
         * End date (YYYY-MM-DD). Defaults to 7 days after start_date.
         */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<CalendarGridResponse, HTTPValidationError>({
        path: `/api/v2/calendar/grid`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags calendar-v2
     * @name GetFeedApiV2CalendarFeedGet
     * @summary Get calendar feed info
     * @request GET:/api/v2/calendar/feed
     * @secure
     */
    getFeedApiV2CalendarFeedGet: (params: RequestParams = {}) =>
      this.request<CalendarFeedRead, HTTPValidationError>({
        path: `/api/v2/calendar/feed`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags calendar-v2
     * @name UpdateFeedApiV2CalendarFeedPatch
     * @summary Enable or disable calendar feed
     * @request PATCH:/api/v2/calendar/feed
     * @secure
     */
    updateFeedApiV2CalendarFeedPatch: (
      data: CalendarFeedUpdate,
      params: RequestParams = {},
    ) =>
      this.request<CalendarFeedRead, HTTPValidationError>({
        path: `/api/v2/calendar/feed`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags calendar-v2
     * @name RotateFeedApiV2CalendarFeedRotatePost
     * @summary Rotate calendar feed token
     * @request POST:/api/v2/calendar/feed/rotate
     * @secure
     */
    rotateFeedApiV2CalendarFeedRotatePost: (params: RequestParams = {}) =>
      this.request<CalendarFeedRotateRead, HTTPValidationError>({
        path: `/api/v2/calendar/feed/rotate`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags calendar-v2
     * @name DownloadCalendarFeedApiV2CalendarFeedFeedTokenIcsGet
     * @summary Download ICS feed
     * @request GET:/api/v2/calendar/feed/{feed_token}.ics
     * @secure
     */
    downloadCalendarFeedApiV2CalendarFeedFeedTokenIcsGet: (
      feedToken: string,
      params: RequestParams = {},
    ) =>
      this.request<string, HTTPValidationError>({
        path: `/api/v2/calendar/feed/${feedToken}.ics`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description List all active classes grouped by their recurring schedule.
     *
     * @tags classes-v2
     * @name ListClassesApiV2ClassesGet
     * @summary List class groups (sheikh)
     * @request GET:/api/v2/classes
     * @secure
     */
    listClassesApiV2ClassesGet: (params: RequestParams = {}) =>
      this.request<ClassGroupListResponse, HTTPValidationError>({
        path: `/api/v2/classes`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get paginated lesson history for a specific class group.
     *
     * @tags classes-v2
     * @name GetHistoryApiV2ClassesScheduleIdHistoryGet
     * @summary Get class history (sheikh)
     * @request GET:/api/v2/classes/{schedule_id}/history
     * @secure
     */
    getHistoryApiV2ClassesScheduleIdHistoryGet: (
      scheduleId: number,
      query?: {
        /**
         * Limit
         * @min 1
         * @max 100
         * @default 20
         */
        limit?: number;
        /**
         * Offset
         * @min 0
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ClassHistoryResponse, HTTPValidationError>({
        path: `/api/v2/classes/${scheduleId}/history`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get attendance summary for a specific class group.
     *
     * @tags classes-v2
     * @name GetAttendanceApiV2ClassesScheduleIdAttendanceGet
     * @summary Get class attendance (sheikh)
     * @request GET:/api/v2/classes/{schedule_id}/attendance
     * @secure
     */
    getAttendanceApiV2ClassesScheduleIdAttendanceGet: (
      scheduleId: number,
      query?: {
        /**
         * Start Date
         * Start of period (YYYY-MM-DD). Defaults to 30 days ago.
         */
        start_date?: string | null;
        /**
         * End Date
         * End of period (YYYY-MM-DD). Defaults to today.
         */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<ClassAttendanceSummary, HTTPValidationError>({
        path: `/api/v2/classes/${scheduleId}/attendance`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description List the student's own class groups.
     *
     * @tags classes-v2
     * @name ListMyClassesApiV2ClassesMeGet
     * @summary List my classes (student)
     * @request GET:/api/v2/classes/me
     * @secure
     */
    listMyClassesApiV2ClassesMeGet: (params: RequestParams = {}) =>
      this.request<ClassGroupListResponse, HTTPValidationError>({
        path: `/api/v2/classes/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get lesson history for the student's own class.
     *
     * @tags classes-v2
     * @name GetMyHistoryApiV2ClassesMeScheduleIdHistoryGet
     * @summary Get my class history (student)
     * @request GET:/api/v2/classes/me/{schedule_id}/history
     * @secure
     */
    getMyHistoryApiV2ClassesMeScheduleIdHistoryGet: (
      scheduleId: number,
      query?: {
        /**
         * Limit
         * @min 1
         * @max 100
         * @default 20
         */
        limit?: number;
        /**
         * Offset
         * @min 0
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ClassHistoryResponse, HTTPValidationError>({
        path: `/api/v2/classes/me/${scheduleId}/history`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get attendance summary for the student's own class.
     *
     * @tags classes-v2
     * @name GetMyAttendanceApiV2ClassesMeScheduleIdAttendanceGet
     * @summary Get my class attendance (student)
     * @request GET:/api/v2/classes/me/{schedule_id}/attendance
     * @secure
     */
    getMyAttendanceApiV2ClassesMeScheduleIdAttendanceGet: (
      scheduleId: number,
      query?: {
        /**
         * Start Date
         * Start of period (YYYY-MM-DD).
         */
        start_date?: string | null;
        /**
         * End Date
         * End of period (YYYY-MM-DD).
         */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<ClassAttendanceSummary, HTTPValidationError>({
        path: `/api/v2/classes/me/${scheduleId}/attendance`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload a file to a class group (schedule).
     *
     * @tags class-files-v2
     * @name UploadClassFileApiV2ClassFilesScheduleIdFilesPost
     * @summary Upload class file (sheikh)
     * @request POST:/api/v2/class-files/{schedule_id}/files
     * @secure
     */
    uploadClassFileApiV2ClassFilesScheduleIdFilesPost: (
      scheduleId: number,
      data: BodyUploadClassFileApiV2ClassFilesScheduleIdFilesPost,
      params: RequestParams = {},
    ) =>
      this.request<ClassFileRead, HTTPValidationError>({
        path: `/api/v2/class-files/${scheduleId}/files`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description List files for a class group. Sheikh or student with access.
     *
     * @tags class-files-v2
     * @name ListClassFilesApiV2ClassFilesScheduleIdFilesGet
     * @summary List class files
     * @request GET:/api/v2/class-files/{schedule_id}/files
     * @secure
     */
    listClassFilesApiV2ClassFilesScheduleIdFilesGet: (
      scheduleId: number,
      params: RequestParams = {},
    ) =>
      this.request<ClassFileRead[], HTTPValidationError>({
        path: `/api/v2/class-files/${scheduleId}/files`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Download a file from a class group.
     *
     * @tags class-files-v2
     * @name DownloadClassFileApiV2ClassFilesScheduleIdFilesFileIdGet
     * @summary Download class file
     * @request GET:/api/v2/class-files/{schedule_id}/files/{file_id}
     * @secure
     */
    downloadClassFileApiV2ClassFilesScheduleIdFilesFileIdGet: (
      scheduleId: number,
      fileId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v2/class-files/${scheduleId}/files/${fileId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a file from a class group.
     *
     * @tags class-files-v2
     * @name DeleteClassFileApiV2ClassFilesScheduleIdFilesFileIdDelete
     * @summary Delete class file (sheikh)
     * @request DELETE:/api/v2/class-files/{schedule_id}/files/{file_id}
     * @secure
     */
    deleteClassFileApiV2ClassFilesScheduleIdFilesFileIdDelete: (
      scheduleId: number,
      fileId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v2/class-files/${scheduleId}/files/${fileId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description List files for the student's own class.
     *
     * @tags class-files-v2
     * @name ListMyClassFilesApiV2ClassFilesMeScheduleIdFilesGet
     * @summary List my class files (student)
     * @request GET:/api/v2/class-files/me/{schedule_id}/files
     * @secure
     */
    listMyClassFilesApiV2ClassFilesMeScheduleIdFilesGet: (
      scheduleId: number,
      params: RequestParams = {},
    ) =>
      this.request<ClassFileRead[], HTTPValidationError>({
        path: `/api/v2/class-files/me/${scheduleId}/files`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Download a file from the student's own class.
     *
     * @tags class-files-v2
     * @name DownloadMyClassFileApiV2ClassFilesMeScheduleIdFilesFileIdGet
     * @summary Download my class file (student)
     * @request GET:/api/v2/class-files/me/{schedule_id}/files/{file_id}
     * @secure
     */
    downloadMyClassFileApiV2ClassFilesMeScheduleIdFilesFileIdGet: (
      scheduleId: number,
      fileId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v2/class-files/me/${scheduleId}/files/${fileId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get sessions starting within the next hour.
     *
     * @tags notifications-v2
     * @name UpcomingSessionsApiV2NotificationsSessionsUpcomingGet
     * @summary Get upcoming sessions
     * @request GET:/api/v2/notifications/sessions/upcoming
     * @secure
     */
    upcomingSessionsApiV2NotificationsSessionsUpcomingGet: (
      params: RequestParams = {},
    ) =>
      this.request<UpcomingSessionResponse[], HTTPValidationError>({
        path: `/api/v2/notifications/sessions/upcoming`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get the student's own upcoming sessions.
     *
     * @tags notifications-v2
     * @name MyUpcomingSessionsApiV2NotificationsSessionsMeUpcomingGet
     * @summary Get my upcoming sessions (student)
     * @request GET:/api/v2/notifications/sessions/me/upcoming
     * @secure
     */
    myUpcomingSessionsApiV2NotificationsSessionsMeUpcomingGet: (
      params: RequestParams = {},
    ) =>
      this.request<UpcomingSessionResponse[], HTTPValidationError>({
        path: `/api/v2/notifications/sessions/me/upcoming`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description List notifications for the current user.
     *
     * @tags notifications-v2
     * @name ListUserNotificationsApiV2NotificationsGet
     * @summary List notifications
     * @request GET:/api/v2/notifications
     * @secure
     */
    listUserNotificationsApiV2NotificationsGet: (
      query?: {
        /** Is Read */
        is_read?: boolean | null;
        /**
         * Limit
         * @min 1
         * @max 100
         * @default 50
         */
        limit?: number;
        /**
         * Offset
         * @min 0
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationRead[], HTTPValidationError>({
        path: `/api/v2/notifications`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications-v2
     * @name ReadNotificationApiV2NotificationsNotificationIdReadPatch
     * @summary Mark notification as read
     * @request PATCH:/api/v2/notifications/{notification_id}/read
     * @secure
     */
    readNotificationApiV2NotificationsNotificationIdReadPatch: (
      notificationId: number,
      params: RequestParams = {},
    ) =>
      this.request<NotificationRead, HTTPValidationError>({
        path: `/api/v2/notifications/${notificationId}/read`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications-v2
     * @name ReadAllNotificationsApiV2NotificationsReadAllPost
     * @summary Mark all notifications as read
     * @request POST:/api/v2/notifications/read-all
     * @secure
     */
    readAllNotificationsApiV2NotificationsReadAllPost: (
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v2/notifications/read-all`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  health = {
    /**
     * @description Returns `{"status": "ok"}` when the application process is running. Does **not** probe the database or Redis.
     *
     * @tags health
     * @name HealthHealthGet
     * @summary Health check
     * @request GET:/health
     * @secure
     */
    healthHealthGet: (params: RequestParams = {}) =>
      this.request<Record<string, string>, any>({
        path: `/health`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
