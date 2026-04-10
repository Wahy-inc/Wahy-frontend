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

/** LessonQuality */
export enum LessonQuality {
  Excellent = "excellent",
  VeryGood = "very_good",
  Good = "good",
  Fair = "fair",
  NeedsImprovement = "needs_improvement",
  Repetition = "repetition",
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

/** WirdAssignmentStatus */
export enum WirdAssignmentStatus {
  Assigned = "assigned",
  CompletedByStudent = "completed_by_student",
  VerifiedBySeikh = "verified_by_sheikh",
  NeedsRetry = "needs_retry",
  Cancelled = "cancelled",
}

/** AdminSignupRequest */
export interface AdminSignupRequest {
  /**
   * Email
   * @format email
   */
  email: string;
  /**
   * Password
   * @minLength 8
   */
  password: string;
}

/** AttendanceAnalytics */
export interface AttendanceAnalytics {
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
  /** Total Lessons */
  total_lessons: number;
  /** Present Count */
  present_count: number;
  /** Late Count */
  late_count: number;
  /** Absent Count */
  absent_count: number;
  /** Excused Count */
  excused_count: number;
  /** Attendance Rate */
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
  student_ids?: String | null;
}

/** FinancialAnalytics */
export interface FinancialAnalytics {
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
  /** Total Revenue */
  total_revenue: number;
  /** Invoice Count */
  invoice_count: number;
  /** Overdue Count */
  overdue_count: number;
  /** Revenue Per Student */
  revenue_per_student: RevenuePerStudent[];
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** InvoiceGenerateRequest */
export interface InvoiceGenerateRequest {
  /** Student Id */
  student_id?: number | null;
  /** Student Ids */
  student_ids?: number[] | null;
  /**
   * Period From
   * @format date
   */
  period_from: string;
  /**
   * Period To
   * @format date
   */
  period_to: string;
  /**
   * Due Date
   * @format date
   */
  due_date: string;
}

/** InvoiceItemOverrideRequest */
export interface InvoiceItemOverrideRequest {
  /** Item Id */
  item_id: number;
  /** Billable */
  billable: boolean;
  /**
   * Override Reason
   * @minLength 3
   * @maxLength 255
   */
  override_reason: string;
}

/** InvoiceItemRead */
export interface InvoiceItemRead {
  /** Id */
  id: number;
  /** Invoice Id */
  invoice_id: number;
  /** Student Id */
  student_id: number | null;
  /** Lesson Id */
  lesson_id: number | null;
  /** Description */
  description: string;
  /** Rate */
  rate: number;
  /** Quantity */
  quantity: number;
  /** Amount */
  amount: number;
  /** Billable */
  billable: boolean;
  /** Override Reason */
  override_reason: string | null;
}

/** InvoicePaidRequest */
export interface InvoicePaidRequest {
  /**
   * Paid Date
   * @format date
   */
  paid_date: string;
  /** Payment Method */
  payment_method?: string | null;
  /** Payment Reference */
  payment_reference?: string | null;
  /** Payment Notes */
  payment_notes?: string | null;
}

/** InvoiceRead */
export interface InvoiceRead {
  /** Id */
  id: number;
  /** Student Id */
  student_id: number;
  /** Sheikh Id */
  sheikh_id: number;
  /** Invoice Number */
  invoice_number: string;
  /**
   * Period From
   * @format date
   */
  period_from: string;
  /**
   * Period To
   * @format date
   */
  period_to: string;
  /** Total Amount */
  total_amount: number;
  /** Currency */
  currency: string;
  status: InvoiceStatus;
  /**
   * Generated Date
   * @format date
   */
  generated_date: string;
  /**
   * Due Date
   * @format date
   */
  due_date: string;
  /** Paid Date */
  paid_date: string | null;
  /** Payment Method */
  payment_method: string | null;
  /** Payment Reference */
  payment_reference: string | null;
  /** Payment Notes */
  payment_notes: string | null;
  /** Pdf Path */
  pdf_path: string | null;
  /** Pdf Generated At */
  pdf_generated_at: string | null;
}

/** InvoiceWithItemsRead */
export interface InvoiceWithItemsRead {
  /** Id */
  id: number;
  /** Student Id */
  student_id: number;
  /** Sheikh Id */
  sheikh_id: number;
  /** Invoice Number */
  invoice_number: string;
  /**
   * Period From
   * @format date
   */
  period_from: string;
  /**
   * Period To
   * @format date
   */
  period_to: string;
  /** Total Amount */
  total_amount: number;
  /** Currency */
  currency: string;
  status: InvoiceStatus;
  /**
   * Generated Date
   * @format date
   */
  generated_date: string;
  /**
   * Due Date
   * @format date
   */
  due_date: string;
  /** Paid Date */
  paid_date: string | null;
  /** Payment Method */
  payment_method: string | null;
  /** Payment Reference */
  payment_reference: string | null;
  /** Payment Notes */
  payment_notes: string | null;
  /** Pdf Path */
  pdf_path: string | null;
  /** Pdf Generated At */
  pdf_generated_at: string | null;
  /** Items */
  items: InvoiceItemRead[];
  /** Recipient Student Ids */
  recipient_student_ids: number[];
}

/** LessonRecurrence */
export interface LessonRecurrence {
  /** RRULE - RFC 5545 RRULE string */
  rrule: string;
}

/** LessonCreate */
export interface LessonCreate {
  /** Student Id - Required */
  student_id: number;
  /**
   * Date - Required
   * @format date
   */
  date: string;
  /** Type - Required */
  type: LessonType;
  /** Attendance - Defaults to "present" */
  attendance?: AttendanceStatus;
  /** Surah Name - Optional */
  surah_name?: string | null;
  /** Juz Number - Optional */
  juz_number?: number | null;
  /** Ayah From - Optional */
  ayah_from?: number | null;
  /** Ayah To - Optional */
  ayah_to?: number | null;
  /** Quality - Optional */
  quality?: LessonQuality | null;
  /** Absence Reason - Required when attendance is not "present" */
  absence_reason?: string | null;
  /** Student Notes - Optional */
  student_notes?: string | null;
  /** Sheikh Notes - Optional */
  sheikh_notes?: string | null;
  /** Recurrence - RFC 5545 RRULE for bulk lesson creation */
  recurrence?: LessonRecurrence | null;
  pass_fail?: boolean | null;
}

/** LessonRead */
export interface LessonRead {
  /** Id */
  id: number;
  /** Student Id */
  student_id: number;
  /** Sheikh Id */
  sheikh_id: number;
  /** Schedule Id */
  schedule_id: number | null;
  /** Recurrence Group Id */
  recurrence_group_id: string | null;
  /**
   * Date
   * @format date
   */
  date: string;
  type: LessonType;
  /** Surah Name */
  surah_name: string | null;
  /** Juz Number */
  juz_number: number | null;
  /** Ayah From */
  ayah_from: number | null;
  /** Ayah To */
  ayah_to: number | null;
  quality: LessonQuality | null;
  /** Pass Fail */
  pass_fail: boolean | null;
  /** Attempts */
  attempts: number;
  attendance: AttendanceStatus;
  /** Absence Reason */
  absence_reason: string | null;
  /** Student Notes */
  student_notes: string | null;
  /** Sheikh Notes */
  sheikh_notes: string | null;
  next_homework_type: LessonType | null;
  /** Next Homework Surah */
  next_homework_surah: string | null;
  /** Next Homework Ayah From */
  next_homework_ayah_from: number | null;
  /** Next Homework Ayah To */
  next_homework_ayah_to: number | null;
  /** Next Homework Due Date */
  next_homework_due_date: string | null;
}

/** LessonUpdate */
export interface LessonUpdate {
  /** Schedule Id */
  schedule_id?: number | null;
  /** Date */
  date?: string | null;
  type?: LessonType | null;
  /** Surah Name */
  surah_name?: string | null;
  /** Juz Number */
  juz_number?: number | null;
  /** Ayah From */
  ayah_from?: number | null;
  /** Ayah To */
  ayah_to?: number | null;
  quality?: LessonQuality | null;
  /** Pass Fail */
  pass_fail?: boolean | null;
  /** Attempts */
  attempts?: number | null;
  attendance?: AttendanceStatus | null;
  /** Absence Reason */
  absence_reason?: string | null;
  /** Student Notes */
  student_notes?: string | null;
  /** Sheikh Notes */
  sheikh_notes?: string | null;
}

/** LibraryItemRead */
export interface LibraryItemRead {
  /** Id */
  id: number;
  /** Sheikh Id */
  sheikh_id: number;
  /** Title */
  title: string;
  /** Description */
  description: string | null;
  /** Category */
  category: string | null;
  /** Tags */
  tags: string[] | null;
  /** Thumbnail Image Path */
  thumbnail_image_path: string | null;
  /**
   * External Url
   * @format uri
   * @minLength 1
   * @maxLength 2083
   */
  external_url: string;
  access_level: LibraryAccessLevel;
  /** Download Count */
  download_count: number;
  /** View Count */
  view_count: number;
  /** Is Active */
  is_active: boolean;
}

/** LoginRequest */
export interface LoginRequest {
  /**
   * Email
   * @format email
   */
  email: string;
  /** Password */
  password: string;
}

/** OperationalAnalytics */
export interface OperationalAnalytics {
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
  /** New Registrations */
  new_registrations: number;
  /** Active Students */
  active_students: number;
  /** Lessons Recorded */
  lessons_recorded: number;
}

/** PerformanceAnalytics */
export interface PerformanceAnalytics {
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
  /** Attended Count */
  attended_count: number;
  /** Passed Count */
  passed_count: number;
  /** Pass Rate */
  pass_rate: number;
  /** Attendance Rate */
  attendance_rate: number;
  /** Homework Rate */
  homework_rate: number;
  /** Timeliness Rate */
  timeliness_rate: number;
  /** Determination Score */
  determination_score: number;
}

/** RefreshResponse */
export interface RefreshResponse {
  /** Access Token */
  access_token: string;
  /**
   * Token Type
   * @default "bearer"
   */
  token_type?: string;
  /**
   * Expires At
   * @format date-time
   */
  expires_at: string;
}

/** RevenuePerStudent */
export interface RevenuePerStudent {
  /** Student Id */
  student_id: number;
  /** Total Revenue */
  total_revenue: number;
}

/** ScheduleCreate */
export interface ScheduleCreate {
  /** Student Id */
  student_id: number;
  /**
   * Start Time
   * @format time
   */
  start_time: string;
  /**
   * End Time
   * @format time
   */
  end_time: string;
  /**
   * Effective From
   * @format date
   */
  effective_from: string;
  /** RRULE String - RFC 5545 format (omit or null for one-off session) */
  rrule_string?: string | null;
  /** Effective Until */
  effective_until?: string | null;
  /** Notes */
  notes?: string | null;
}

/** ScheduleRead */
export interface ScheduleRead {
  /** Id */
  id: number;
  /** Student Id */
  student_id: number;
  /** Sheikh Id */
  sheikh_id: number;
  /** RRULE String - null if one-off session */
  rrule_string: string | null;
  /**
   * Start Time
   * @format time
   */
  start_time: string;
  /**
   * End Time
   * @format time
   */
  end_time: string;
  /**
   * Effective From
   * @format date
   */
  effective_from: string;
  /** Effective Until */
  effective_until: string | null;
  /** Is Active */
  is_active: boolean;
  /** Cancellation Reason */
  cancellation_reason: string | null;
  /** Notes */
  notes: string | null;
}

/** ScheduleUpdate */
export interface ScheduleUpdate {
  /** RRULE String - pass null to convert recurring to one-off */
  rrule_string?: string | null;
  /** Start Time */
  start_time?: string | null;
  /** End Time */
  end_time?: string | null;
  /** Effective From */
  effective_from?: string | null;
  /** Effective Until */
  effective_until?: string | null;
  /** Is Active */
  is_active?: boolean | null;
  /** Cancellation Reason */
  cancellation_reason?: string | null;
  /** Notes */
  notes?: string | null;
}

/** StudentApprovalRequest */
export interface StudentApprovalRequest {
  /** Notes */
  notes?: string | null;
}

/** StudentCreate */
export interface StudentCreate {
  /** User Id */
  user_id?: number | null;
  /** Full Name Arabic */
  full_name_arabic: string;
  /** Full Name English */
  full_name_english: string;
  /** Date Of Birth */
  date_of_birth?: string | null;
  /** Phone */
  phone?: string | null;
  /**
   * Timezone
   * @default "UTC"
   */
  timezone?: string;
  /** Current Juz */
  current_juz?: number | null;
  /** Current Surah */
  current_surah?: string | null;
  /** Current Ayah */
  current_ayah?: number | null;
  /**
   * Lessons Per Week
   * @default 2
   */
  lessons_per_week?: number;
  /** Lesson Rate */
  lesson_rate?: number | null;
  /** @default "monthly" */
  billing_cycle?: BillingCycle;
  /** Private Notes */
  private_notes?: string | null;
  /** Special Notes */
  special_notes?: string | null;
}

/** StudentRead */
export interface StudentRead {
  /** Id */
  id: number;
  /** User Id */
  user_id: number | null;
  /** Sheikh Id */
  sheikh_id: number;
  /** Full Name Arabic */
  full_name_arabic: string;
  /** Full Name English */
  full_name_english: string;
  /** Date Of Birth */
  date_of_birth: string | null;
  /** Phone */
  phone: string | null;
  /** Timezone */
  timezone: string;
  registration_status: RegistrationStatus;
  status: StudentStatus;
  /** Current Juz */
  current_juz: number | null;
  /** Current Surah */
  current_surah: string | null;
  /** Current Ayah */
  current_ayah: number | null;
  /** Lessons Per Week */
  lessons_per_week: number;
  /** Lesson Rate */
  lesson_rate: number | null;
  billing_cycle: BillingCycle;
  /** Private Notes */
  private_notes: string | null;
  /** Special Notes */
  special_notes: string | null;
}

/** StudentSelfRead */
export interface StudentSelfRead {
  /** Id */
  id: number;
  /** User Id */
  user_id: number | null;
  /** Full Name Arabic */
  full_name_arabic: string;
  /** Full Name English */
  full_name_english: string;
  /** Date Of Birth */
  date_of_birth: string | null;
  /** Phone */
  phone: string | null;
  /** Timezone */
  timezone: string;
  registration_status: RegistrationStatus;
  status: StudentStatus;
  /** Current Juz */
  current_juz: number | null;
  /** Current Surah */
  current_surah: string | null;
  /** Current Ayah */
  current_ayah: number | null;
  /** Lessons Per Week */
  lessons_per_week: number;
  /** Lesson Rate */
  lesson_rate: number | null;
  billing_cycle: BillingCycle;
  /** Special Notes */
  special_notes: string | null;
}

/** StudentSignupRequest */
export interface StudentSignupRequest {
  /**
   * Email
   * @format email
   */
  email: string;
  /**
   * Password
   * @minLength 8
   */
  password: string;
  /** Full Name Arabic */
  full_name_arabic: string;
  /** Full Name English */
  full_name_english: string;
  /** Date Of Birth */
  date_of_birth?: string | null;
  /** Phone */
  phone?: string | null;
  /**
   * Timezone
   * @default "UTC"
   */
  timezone?: string;
  /** Current Juz */
  current_juz?: number | null;
  /** Current Surah */
  current_surah?: string | null;
  /** Current Ayah */
  current_ayah?: number | null;
  /**
   * Lessons Per Week
   * @default 2
   */
  lessons_per_week?: number;
  /** Lesson Rate */
  lesson_rate?: number | null;
  /** @default "monthly" */
  billing_cycle?: BillingCycle;
  /** Special Notes */
  special_notes?: string | null;
}

/** StudentUpdate */
export interface StudentUpdate {
  /** Full Name Arabic */
  full_name_arabic?: string | null;
  /** Full Name English */
  full_name_english?: string | null;
  /** Date Of Birth */
  date_of_birth?: string | null;
  /** Phone */
  phone?: string | null;
  /** Timezone */
  timezone?: string | null;
  registration_status?: RegistrationStatus | null;
  status?: StudentStatus | null;
  /** Current Juz */
  current_juz?: number | null;
  /** Current Surah */
  current_surah?: string | null;
  /** Current Ayah */
  current_ayah?: number | null;
  /** Lessons Per Week */
  lessons_per_week?: number | null;
  /** Lesson Rate */
  lesson_rate?: number | null;
  billing_cycle?: BillingCycle | null;
  /** Private Notes */
  private_notes?: string | null;
  /** Special Notes */
  special_notes?: string | null;
}

/** SyncAckRequest */
export interface SyncAckRequest {
  /** Ids */
  ids: number[];
}

/** SyncChangesResponse */
export interface SyncChangesResponse {
  /**
   * Server Time
   * @format date-time
   */
  server_time: string;
  /** Changes */
  changes: Record<string, any>[];
}

/** SyncItemRequest */
export interface SyncItemRequest {
  /** Entity Type */
  entity_type: string;
  /** Entity Id */
  entity_id?: number | null;
  operation: SyncOperation;
  /** Payload */
  payload: Record<string, any>;
  /**
   * Idempotency Key
   * @minLength 8
   * @maxLength 64
   */
  idempotency_key: string;
}

/** SyncItemResponse */
export interface SyncItemResponse {
  /** Sync Id */
  sync_id: number;
  /** Idempotency Key */
  idempotency_key: string;
  status: SyncStatus;
  /** Entity Id */
  entity_id: number | null;
  /** Error Message */
  error_message?: string | null;
  /** Conflict */
  conflict?: Record<string, any> | null;
}

/** SyncQueueRequest */
export interface SyncQueueRequest {
  /** Items */
  items: SyncItemRequest[];
}

/** SyncQueueResponse */
export interface SyncQueueResponse {
  /** Results */
  results: SyncItemResponse[];
  /**
   * Server Time
   * @format date-time
   */
  server_time: string;
}

/** TokenResponse */
export interface TokenResponse {
  /** Access Token */
  access_token: string;
  /**
   * Token Type
   * @default "bearer"
   */
  token_type?: string;
  /**
   * Expires At
   * @format date-time
   */
  expires_at: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** StudentAttendanceHoursAnalytics */
export interface StudentAttendanceHoursAnalytics {
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
  /** Hours Per Month */
  hours_per_month: number;
  /** Hours Attended */
  hours_attended: number;
  /** Remaining Hours */
  remaining_hours: number;
  /** Absent Hours */
  absent_hours: number;
}

/** SheikhPreferencesRead */
export interface SheikhPreferencesRead {
  /** Id */
  id: number;
  /** Lesson List Limit */
  lesson_list_limit: number;
}

/** SheikhPreferencesUpdate */
export interface SheikhPreferencesUpdate {
  /** Lesson List Limit */
  lesson_list_limit?: number | null;
}

/** WirdAssignmentCreate */
export interface WirdAssignmentCreate {
  /** Student Id */
  student_id: number;
  /** Title */
  title: string;
  /** Surah Name */
  surah_name?: string | null;
  /** Ayah From */
  ayah_from?: number | null;
  /** Ayah To */
  ayah_to?: number | null;
  /**
   * Due Date
   * @format date
   */
  due_date?: string | null;
  /** Notes */
  notes?: string | null;
}

/** WirdAssignmentRead */
export interface WirdAssignmentRead {
  /** Id */
  id: number;
  /** Student Id */
  student_id: number;
  /** Sheikh Id */
  sheikh_id: number;
  /** Source Lesson Id */
  source_lesson_id: number | null;
  /** Title */
  title: string;
  /** Surah Name */
  surah_name: string | null;
  /** Ayah From */
  ayah_from: number | null;
  /** Ayah To */
  ayah_to: number | null;
  /**
   * Due Date
   * @format date
   */
  due_date: string | null;
  /** Notes */
  notes: string | null;
  status: WirdAssignmentStatus;
  /**
   * Completed At
   * @format date-time
   */
  completed_at: string | null;
  /**
   * Verified At
   * @format date-time
   */
  verified_at: string | null;
  /** Verified By User Id */
  verified_by_user_id: number | null;
  /** Verification Notes */
  verification_notes: string | null;
  /**
   * Source Updated At
   * @format date-time
   */
  source_updated_at: string;
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

/** WirdAssignmentUpdate */
export interface WirdAssignmentUpdate {
  /** Title */
  title?: string | null;
  /** Surah Name */
  surah_name?: string | null;
  /** Ayah From */
  ayah_from?: number | null;
  /** Ayah To */
  ayah_to?: number | null;
  /**
   * Due Date
   * @format date
   */
  due_date?: string | null;
  /** Notes */
  notes?: string | null;
  status?: WirdAssignmentStatus | null;
}

/** WirdCompletionSubmit */
export interface WirdCompletionSubmit {
  /** Submitted Notes */
  submitted_notes?: string | null;
}

/** WirdReviewRequest */
export interface WirdReviewRequest {
  /** Completion Id */
  completion_id?: number | null;
  /** Verification Notes */
  verification_notes?: string | null;
}

/** CalendarFeedRead */
export interface CalendarFeedRead {
  /** Is Enabled */
  is_enabled: boolean;
  /** Feed Url */
  feed_url: string;
  /**
   * Last Rotated At
   * @format date-time
   */
  last_rotated_at: string | null;
  /**
   * Last Accessed At
   * @format date-time
   */
  last_accessed_at: string | null;
}

/** CalendarFeedUpdate */
export interface CalendarFeedUpdate {
  /** Is Enabled */
  is_enabled: boolean;
}

/** CalendarFeedRotateRead */
export interface CalendarFeedRotateRead {
  /** Feed Url */
  feed_url: string;
  /**
   * Rotated At
   * @format date-time
   */
  rotated_at: string;
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

/** CalendarSlotItem */
export interface CalendarSlotItem {
  /**
   * Date
   * @format date
   */
  date: string;
  /**
   * Start Time
   * @format time
   */
  start_time: string;
  /**
   * End Time
   * @format time
   */
  end_time: string;
  /** Schedule Id */
  schedule_id: number;
  /** Student Id */
  student_id: number;
  /** Student Name En */
  student_name_en: string;
  /** Student Name Ar */
  student_name_ar: string;
  /** Lesson Data */
  lesson_data: Record<string, any> | null;
}

/** CalendarGridResponse */
export interface CalendarGridResponse {
  /** Slots */
  slots: CalendarSlotItem[];
}

/** ClassGroupItem */
export interface ClassGroupItem {
  /** Schedule Id */
  schedule_id: number;
  /** Student Id */
  student_id: number;
  /** Student Name En */
  student_name_en: string;
  /** Student Name Ar */
  student_name_ar: string;
  /** Day Label */
  day_label: string;
  /**
   * Start Time
   * @format time
   */
  start_time: string;
  /**
   * End Time
   * @format time
   */
  end_time: string;
  /** RRULE String */
  rrule_string: string | null;
  /**
   * Effective From
   * @format date
   */
  effective_from: string;
  /** Effective Until */
  effective_until: string | null;
  /** Next Occurrence */
  next_occurrence: string | null;
  /** Total Lessons */
  total_lessons: number;
  /** Is Active */
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
  /** Total Count */
  total: number;
}

/** ClassAttendanceSummary */
export interface ClassAttendanceSummary {
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
  /** Total Classes */
  total_classes: number;
  /** Present Count */
  present_count: number;
  /** Absent Count */
  absent_count: number;
  /** Late Count */
  late_count: number;
  /** Excused Count */
  excused_count: number;
  /** Attendance Rate */
  attendance_rate: number;
}

/** ClassFileRead */
export interface ClassFileRead {
  /** Id */
  id: number;
  /** Schedule Id */
  schedule_id: number;
  /** Sheikh Id */
  sheikh_id: number;
  /** Original Filename */
  original_filename: string;
  /** Stored Filename */
  stored_filename: string;
  /** File Path */
  file_path: string;
  /** File Size Bytes */
  file_size_bytes: number;
  /** Mime Type */
  mime_type: string;
  /** Download Count */
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

/** NotificationType */
export enum NotificationType {
  UpcomingSession = "upcoming_session",
  ScheduleReminder = "schedule_reminder",
  System = "system",
}

/** NotificationRead */
export interface NotificationRead {
  /** Id */
  id: number;
  /** User Id */
  user_id: number;
  /** Type */
  type: NotificationType;
  /** Title */
  title: string;
  /** Body */
  body: string;
  /** Related Entity Type */
  related_entity_type: string | null;
  /** Related Entity Id */
  related_entity_id: number | null;
  /** Is Read */
  is_read: boolean;
  /** Read At */
  read_at: string | null;
  /** Scheduled For */
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

/** ImportNotificationRead */
export interface ImportNotificationRead {
  /** Notification */
  notification: NotificationRead;
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
   * @format time
   */
  start_time: string;
  /**
   * End Time
   * @format time
   */
  end_time: string;
  /**
   * Date
   * @format date
   */
  date: string;
  /** Minutes Until Start */
  minutes_until_start: number;
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
  public baseUrl: string = "";
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
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Create the initial sheikh admin account.
     *
     * @tags auth, Auth
     * @name AdminSignupApiV1AuthAdminSignupPost
     * @summary Admin signup
     * @request POST:/api/v1/auth/admin/signup
     */
    adminSignupApiV1AuthAdminSignupPost: (
      data: AdminSignupRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, HTTPValidationError>({
        path: `/api/v1/auth/admin/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Sign in as the sheikh admin.
     *
     * @tags auth, Auth
     * @name AdminSigninApiV1AuthAdminSigninPost
     * @summary Admin signin
     * @request POST:/api/v1/auth/admin/signin
     */
    adminSigninApiV1AuthAdminSigninPost: (
      data: LoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, HTTPValidationError>({
        path: `/api/v1/auth/admin/signin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Register a student account (pending approval).
     *
     * @tags auth, Auth
     * @name StudentSignupApiV1AuthStudentSignupPost
     * @summary Student signup
     * @request POST:/api/v1/auth/student/signup
     */
    studentSignupApiV1AuthStudentSignupPost: (
      data: StudentSignupRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, HTTPValidationError>({
        path: `/api/v1/auth/student/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Sign in as a student.
     *
     * @tags auth, Auth
     * @name StudentSigninApiV1AuthStudentSigninPost
     * @summary Student signin
     * @request POST:/api/v1/auth/student/signin
     */
    studentSigninApiV1AuthStudentSigninPost: (
      data: LoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, HTTPValidationError>({
        path: `/api/v1/auth/student/signin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Rotate refresh token and issue new access token.
     *
     * @tags auth, Auth
     * @name RefreshApiV1AuthRefreshPost
     * @summary Refresh access token
     * @request POST:/api/v1/auth/refresh
     */
    refreshApiV1AuthRefreshPost: (params: RequestParams = {}) =>
      this.request<RefreshResponse, HTTPValidationError>({
        path: `/api/v1/auth/refresh`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description Invalidate refresh token and clear cookies.
     *
     * @tags auth, Auth
     * @name LogoutApiV1AuthLogoutPost
     * @summary Logout
     * @request POST:/api/v1/auth/logout
     */
    logoutApiV1AuthLogoutPost: (params: RequestParams = {}) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v1/auth/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * @description Get the current student's profile and registration status.
     *
     * @tags students, Students
     * @name GetMeApiV1StudentsMeGet
     * @summary Get my profile
     * @request GET:/api/v1/students/me
     */
    getMeApiV1StudentsMeGet: (params: RequestParams = {}) =>
      this.request<StudentSelfRead, HTTPValidationError>({
        path: `/api/v1/students/me`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description List all students for the current sheikh.
     *
     * @tags students, Students
     * @name ListAllApiV1StudentsGet
     * @summary List students
     * @request GET:/api/v1/students
     */
    listAllApiV1StudentsGet: (params: RequestParams = {}) =>
      this.request<StudentRead[], HTTPValidationError>({
        path: `/api/v1/students`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new student under the current sheikh.
     *
     * @tags students, Students
     * @name CreateApiV1StudentsPost
     * @summary Create student
     * @request POST:/api/v1/students
     */
    createApiV1StudentsPost: (
      data: StudentCreate,
      params: RequestParams = {},
    ) =>
      this.request<StudentRead, HTTPValidationError>({
        path: `/api/v1/students`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch a student by id for the current sheikh.
     *
     * @tags students, Students
     * @name GetOneApiV1StudentsStudentIdGet
     * @summary Get student
     * @request GET:/api/v1/students/{student_id}
     */
    getOneApiV1StudentsStudentIdGet: (
      studentId: number,
      params: RequestParams = {},
    ) =>
      this.request<StudentRead, HTTPValidationError>({
        path: `/api/v1/students/${studentId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Update student details and status.
     *
     * @tags students, Students
     * @name UpdateApiV1StudentsStudentIdPatch
     * @summary Update student
     * @request PATCH:/api/v1/students/{student_id}
     */
    updateApiV1StudentsStudentIdPatch: (
      studentId: number,
      data: StudentUpdate,
      params: RequestParams = {},
    ) =>
      this.request<StudentRead, HTTPValidationError>({
        path: `/api/v1/students/${studentId}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Approve a pending student registration.
     *
     * @tags students, Students
     * @name ApproveApiV1StudentsStudentIdApprovePost
     * @summary Approve student
     * @request POST:/api/v1/students/{student_id}/approve
     */
    approveApiV1StudentsStudentIdApprovePost: (
      studentId: number,
      data: StudentApprovalRequest,
      params: RequestParams = {},
    ) =>
      this.request<StudentRead, HTTPValidationError>({
        path: `/api/v1/students/${studentId}/approve`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Reject a pending student registration.
     *
     * @tags students, Students
     * @name RejectApiV1StudentsStudentIdRejectPost
     * @summary Reject student
     * @request POST:/api/v1/students/{student_id}/reject
     */
    rejectApiV1StudentsStudentIdRejectPost: (
      studentId: number,
      data: StudentApprovalRequest,
      params: RequestParams = {},
    ) =>
      this.request<StudentRead, HTTPValidationError>({
        path: `/api/v1/students/${studentId}/reject`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get attendance hours for the current student.
     *
     * @tags students, Students
     * @name GetMyAttendanceHoursApiV1StudentsMeAttendanceHoursGet
     * @summary Get my attendance hours
     * @request GET:/api/v1/students/me/attendance-hours
     */
    getMyAttendanceHoursApiV1StudentsMeAttendanceHoursGet: (
      query?: {
        /** Start Date (YYYY-MM-DD) */
        start_date?: string | null;
        /** End Date (YYYY-MM-DD) */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentAttendanceHoursAnalytics, HTTPValidationError>({
        path: `/api/v1/students/me/attendance-hours`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Get attendance hours for a specific student.
     *
     * @tags students, Students
     * @name GetAttendanceHoursApiV1StudentsStudentIdAttendanceHoursGet
     * @summary Get student attendance hours
     * @request GET:/api/v1/students/{student_id}/attendance-hours
     */
    getAttendanceHoursApiV1StudentsStudentIdAttendanceHoursGet: (
      studentId: number,
      query?: {
        /** Start Date (YYYY-MM-DD) */
        start_date?: string | null;
        /** End Date (YYYY-MM-DD) */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentAttendanceHoursAnalytics, HTTPValidationError>({
        path: `/api/v1/students/${studentId}/attendance-hours`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description List schedules for the current approved student.
     *
     * @tags schedules, Schedules
     * @name ListMyScheduleApiV1SchedulesMeGet
     * @summary List my schedule
     * @request GET:/api/v1/schedules/me
     */
    listMyScheduleApiV1SchedulesMeGet: (params: RequestParams = {}) =>
      this.request<ScheduleRead[], HTTPValidationError>({
        path: `/api/v1/schedules/me`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description List all schedules for the sheikh.
     *
     * @tags schedules, Schedules
     * @name ListAllApiV1SchedulesGet
     * @summary List schedules (sheikh)
     * @request GET:/api/v1/schedules
     */
    listAllApiV1SchedulesGet: (params: RequestParams = {}) =>
      this.request<ScheduleRead[], HTTPValidationError>({
        path: `/api/v1/schedules`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new schedule for a student.
     *
     * @tags schedules, Schedules
     * @name CreateApiV1SchedulesPost
     * @summary Create schedule
     * @request POST:/api/v1/schedules
     */
    createApiV1SchedulesPost: (
      data: ScheduleCreate,
      params: RequestParams = {},
    ) =>
      this.request<ScheduleRead, HTTPValidationError>({
        path: `/api/v1/schedules`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List schedules for a specific student.
     *
     * @tags schedules, Schedules
     * @name ListForStudentApiV1SchedulesStudentStudentIdGet
     * @summary List schedules for student
     * @request GET:/api/v1/schedules/student/{student_id}
     */
    listForStudentApiV1SchedulesStudentStudentIdGet: (
      studentId: number,
      params: RequestParams = {},
    ) =>
      this.request<ScheduleRead[], HTTPValidationError>({
        path: `/api/v1/schedules/student/${studentId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing schedule.
     *
     * @tags schedules, Schedules
     * @name UpdateApiV1SchedulesScheduleIdPatch
     * @summary Update schedule
     * @request PATCH:/api/v1/schedules/{schedule_id}
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
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivate a schedule by id.
     *
     * @tags schedules, Schedules
     * @name DeleteApiV1SchedulesScheduleIdDelete
     * @summary Deactivate schedule
     * @request DELETE:/api/v1/schedules/{schedule_id}
     */
    deleteApiV1SchedulesScheduleIdDelete: (
      scheduleId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v1/schedules/${scheduleId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description List lessons for the current approved student.
     *
     * @tags lessons, Lessons
     * @name ListMyLessonsApiV1LessonsMeGet
     * @summary List my lessons
     * @request GET:/api/v1/lessons/me
     */
    listMyLessonsApiV1LessonsMeGet: (params: RequestParams = {}) =>
      this.request<LessonRead[], HTTPValidationError>({
        path: `/api/v1/lessons/me`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch a lesson by id for the current student.
     *
     * @tags lessons, Lessons
     * @name GetMyLessonApiV1LessonsMeLessonIdGet
     * @summary Get my lesson
     * @request GET:/api/v1/lessons/me/{lesson_id}
     */
    getMyLessonApiV1LessonsMeLessonIdGet: (
      lessonId: number,
      params: RequestParams = {},
    ) =>
      this.request<LessonRead, HTTPValidationError>({
        path: `/api/v1/lessons/me/${lessonId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description List lessons for the sheikh with optional student filter.
     *
     * @tags lessons, Lessons
     * @name ListAllApiV1LessonsGet
     * @summary List lessons (sheikh)
     * @request GET:/api/v1/lessons
     */
    listAllApiV1LessonsGet: (
      query?: {
        /** Student Id */
        student_id?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<LessonRead[], HTTPValidationError>({
        path: `/api/v1/lessons`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Record a new lesson for a student.
     *
     * @tags lessons, Lessons
     * @name CreateApiV1LessonsPost
     * @summary Create lesson
     * @request POST:/api/v1/lessons
     */
    createApiV1LessonsPost: (data: LessonCreate, params: RequestParams = {}) =>
      this.request<LessonRead[], HTTPValidationError>({
        path: `/api/v1/lessons`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch a lesson by id for the sheikh.
     *
     * @tags lessons, Lessons
     * @name GetOneApiV1LessonsLessonIdGet
     * @summary Get lesson (sheikh)
     * @request GET:/api/v1/lessons/{lesson_id}
     */
    getOneApiV1LessonsLessonIdGet: (
      lessonId: number,
      params: RequestParams = {},
    ) =>
      this.request<LessonRead, HTTPValidationError>({
        path: `/api/v1/lessons/${lessonId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Update lesson details for a student.
     *
     * @tags lessons, Lessons
     * @name UpdateApiV1LessonsLessonIdPatch
     * @summary Update lesson
     * @request PATCH:/api/v1/lessons/{lesson_id}
     */
    updateApiV1LessonsLessonIdPatch: (
      lessonId: number,
      data: LessonUpdate,
      params: RequestParams = {},
    ) =>
      this.request<LessonRead, HTTPValidationError>({
        path: `/api/v1/lessons/${lessonId}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List invoices for the current approved student.
     *
     * @tags invoices, Invoices
     * @name ListMyInvoicesApiV1InvoicesMeGet
     * @summary List my invoices
     * @request GET:/api/v1/invoices/me
     */
    listMyInvoicesApiV1InvoicesMeGet: (params: RequestParams = {}) =>
      this.request<InvoiceRead[], HTTPValidationError>({
        path: `/api/v1/invoices/me`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch an invoice by id for the current student.
     *
     * @tags invoices, Invoices
     * @name GetMyInvoiceApiV1InvoicesMeInvoiceIdGet
     * @summary Get my invoice
     * @request GET:/api/v1/invoices/me/{invoice_id}
     */
    getMyInvoiceApiV1InvoicesMeInvoiceIdGet: (
      invoiceId: number,
      params: RequestParams = {},
    ) =>
      this.request<InvoiceWithItemsRead, HTTPValidationError>({
        path: `/api/v1/invoices/me/${invoiceId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Download the invoice PDF for the current student.
     *
     * @tags invoices, Invoices
     * @name GetMyPdfApiV1InvoicesMeInvoiceIdPdfGet
     * @summary Download my invoice PDF
     * @request GET:/api/v1/invoices/me/{invoice_id}/pdf
     */
    getMyPdfApiV1InvoicesMeInvoiceIdPdfGet: (
      invoiceId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v1/invoices/me/${invoiceId}/pdf`,
        method: "GET",
        format: "blob",
        ...params,
      }),

    /**
     * @description Generate a new invoice for a student and period.
     *
     * @tags invoices, Invoices
     * @name GenerateApiV1InvoicesGeneratePost
     * @summary Generate invoice
     * @request POST:/api/v1/invoices/generate
     */
    generateApiV1InvoicesGeneratePost: (
      data: InvoiceGenerateRequest,
      params: RequestParams = {},
    ) =>
      this.request<InvoiceWithItemsRead, HTTPValidationError>({
        path: `/api/v1/invoices/generate`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List invoices with optional student filter.
     *
     * @tags invoices, Invoices
     * @name ListAllApiV1InvoicesGet
     * @summary List invoices (sheikh)
     * @request GET:/api/v1/invoices
     */
    listAllApiV1InvoicesGet: (
      query?: {
        /** Student Id */
        student_id?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<InvoiceRead[], HTTPValidationError>({
        path: `/api/v1/invoices`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch an invoice by id for the sheikh.
     *
     * @tags invoices, Invoices
     * @name GetOneApiV1InvoicesInvoiceIdGet
     * @summary Get invoice (sheikh)
     * @request GET:/api/v1/invoices/{invoice_id}
     */
    getOneApiV1InvoicesInvoiceIdGet: (
      invoiceId: number,
      params: RequestParams = {},
    ) =>
      this.request<InvoiceWithItemsRead, HTTPValidationError>({
        path: `/api/v1/invoices/${invoiceId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Override billable status for an invoice item.
     *
     * @tags invoices, Invoices
     * @name OverrideItemApiV1InvoicesInvoiceIdOverridesPost
     * @summary Override invoice item
     * @request POST:/api/v1/invoices/{invoice_id}/overrides
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
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Mark an invoice as paid.
     *
     * @tags invoices, Invoices
     * @name MarkInvoicePaidApiV1InvoicesInvoiceIdPaidPatch
     * @summary Mark invoice paid
     * @request PATCH:/api/v1/invoices/{invoice_id}/paid
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
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Download or generate the invoice PDF.
     *
     * @tags invoices, Invoices
     * @name GetPdfApiV1InvoicesInvoiceIdPdfGet
     * @summary Download invoice PDF
     * @request GET:/api/v1/invoices/{invoice_id}/pdf
     */
    getPdfApiV1InvoicesInvoiceIdPdfGet: (
      invoiceId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v1/invoices/${invoiceId}/pdf`,
        method: "GET",
        format: "blob",
        ...params,
      }),

    /**
     * @description List all active library items for the sheikh.
     *
     * @tags library, Library
     * @name ListAllApiV1LibraryGet
     * @summary List library items (sheikh)
     * @request GET:/api/v1/library
     */
    listAllApiV1LibraryGet: (params: RequestParams = {}) =>
      this.request<LibraryItemRead[], HTTPValidationError>({
        path: `/api/v1/library`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new library item and optional student access.
     *
     * @tags library, Library
     * @name CreateApiV1LibraryPost
     * @summary Create library item
     * @request POST:/api/v1/library
     */
    createApiV1LibraryPost: (
      data: BodyCreateApiV1LibraryPost,
      params: RequestParams = {},
    ) =>
      this.request<LibraryItemRead, HTTPValidationError>({
        path: `/api/v1/library`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description List library items available to the current student.
     *
     * @tags library, Library
     * @name ListMyLibraryApiV1LibraryMeGet
     * @summary List my library items
     * @request GET:/api/v1/library/me
     */
    listMyLibraryApiV1LibraryMeGet: (params: RequestParams = {}) =>
      this.request<LibraryItemRead[], HTTPValidationError>({
        path: `/api/v1/library/me`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch a library item by id for the sheikh.
     *
     * @tags library, Library
     * @name GetOneApiV1LibraryItemIdGet
     * @summary Get library item (sheikh)
     * @request GET:/api/v1/library/{item_id}
     */
    getOneApiV1LibraryItemIdGet: (itemId: number, params: RequestParams = {}) =>
      this.request<LibraryItemRead, HTTPValidationError>({
        path: `/api/v1/library/${itemId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivate a library item by id.
     *
     * @tags library, Library
     * @name DeleteApiV1LibraryItemIdDelete
     * @summary Deactivate library item
     * @request DELETE:/api/v1/library/{item_id}
     */
    deleteApiV1LibraryItemIdDelete: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v1/library/${itemId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Fetch a library item available to the current student.
     *
     * @tags library, Library
     * @name GetMyItemApiV1LibraryMeItemIdGet
     * @summary Get my library item
     * @request GET:/api/v1/library/me/{item_id}
     */
    getMyItemApiV1LibraryMeItemIdGet: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<LibraryItemRead, HTTPValidationError>({
        path: `/api/v1/library/me/${itemId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags analytics
     * @name AttendanceApiV1AnalyticsAttendanceGet
     * @summary Attendance
     * @request GET:/api/v1/analytics/attendance
     */
    attendanceApiV1AnalyticsAttendanceGet: (
      query?: {
        /** Start Date */
        start_date?: string | null;
        /** End Date */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<AttendanceAnalytics, HTTPValidationError>({
        path: `/api/v1/analytics/attendance`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags analytics
     * @name PerformanceApiV1AnalyticsPerformanceGet
     * @summary Performance
     * @request GET:/api/v1/analytics/performance
     */
    performanceApiV1AnalyticsPerformanceGet: (
      query?: {
        /** Start Date */
        start_date?: string | null;
        /** End Date */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<PerformanceAnalytics, HTTPValidationError>({
        path: `/api/v1/analytics/performance`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags analytics
     * @name FinancialApiV1AnalyticsFinancialGet
     * @summary Financial
     * @request GET:/api/v1/analytics/financial
     */
    financialApiV1AnalyticsFinancialGet: (
      query?: {
        /** Start Date */
        start_date?: string | null;
        /** End Date */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<FinancialAnalytics, HTTPValidationError>({
        path: `/api/v1/analytics/financial`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags analytics
     * @name OperationalApiV1AnalyticsOperationalGet
     * @summary Operational
     * @request GET:/api/v1/analytics/operational
     */
    operationalApiV1AnalyticsOperationalGet: (
      query?: {
        /** Start Date */
        start_date?: string | null;
        /** End Date */
        end_date?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<OperationalAnalytics, HTTPValidationError>({
        path: `/api/v1/analytics/operational`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sync
     * @name QueueApiV1SyncQueuePost
     * @summary Queue
     * @request POST:/api/v1/sync/queue
     */
    queueApiV1SyncQueuePost: (
      data: SyncQueueRequest,
      params: RequestParams = {},
    ) =>
      this.request<SyncQueueResponse, HTTPValidationError>({
        path: `/api/v1/sync/queue`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sync
     * @name ChangesApiV1SyncChangesGet
     * @summary Changes
     * @request GET:/api/v1/sync/changes
     */
    changesApiV1SyncChangesGet: (
      query?: {
        /** Since */
        since?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<SyncChangesResponse, HTTPValidationError>({
        path: `/api/v1/sync/changes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sync
     * @name AckApiV1SyncAckPost
     * @summary Ack
     * @request POST:/api/v1/sync/ack
     */
    ackApiV1SyncAckPost: (data: SyncAckRequest, params: RequestParams = {}) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v1/sync/ack`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get sheikh preferences.
     *
     * @tags sheikh
     * @name GetPreferencesApiV1SheikhPreferencesGet
     * @summary Get sheikh preferences
     * @request GET:/api/v1/sheikh/preferences
     */
    getPreferencesApiV1SheikhPreferencesGet: (params: RequestParams = {}) =>
      this.request<SheikhPreferencesRead, HTTPValidationError>({
        path: `/api/v1/sheikh/preferences`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Update sheikh preferences.
     *
     * @tags sheikh
     * @name PatchPreferencesApiV1SheikhPreferencesPatch
     * @summary Update sheikh preferences
     * @request PATCH:/api/v1/sheikh/preferences
     */
    patchPreferencesApiV1SheikhPreferencesPatch: (
      data: SheikhPreferencesUpdate,
      params: RequestParams = {},
    ) =>
      this.request<SheikhPreferencesRead, HTTPValidationError>({
        path: `/api/v1/sheikh/preferences`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List wird assignments for sheikh.
     *
     * @tags wird-v2
     * @name ListAllApiV2WirdGet
     * @summary List wird assignments (sheikh)
     * @request GET:/api/v2/wird
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
        format: "json",
        ...params,
      }),

    /**
     * @description Create wird assignment.
     *
     * @tags wird-v2
     * @name CreateApiV2WirdPost
     * @summary Create wird assignment
     * @request POST:/api/v2/wird
     */
    createApiV2WirdPost: (
      data: WirdAssignmentCreate,
      params: RequestParams = {},
    ) =>
      this.request<WirdAssignmentRead, HTTPValidationError>({
        path: `/api/v2/wird`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update wird assignment.
     *
     * @tags wird-v2
     * @name UpdateApiV2WirdAssignmentIdPatch
     * @summary Update wird assignment (sheikh)
     * @request PATCH:/api/v2/wird/{assignment_id}
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
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Verify wird completion.
     *
     * @tags wird-v2
     * @name VerifyApiV2WirdAssignmentIdVerifyPost
     * @summary Verify wird completion (sheikh)
     * @request POST:/api/v2/wird/{assignment_id}/verify
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
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Reject wird completion.
     *
     * @tags wird-v2
     * @name RejectApiV2WirdAssignmentIdRejectPost
     * @summary Reject wird completion (sheikh)
     * @request POST:/api/v2/wird/{assignment_id}/reject
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
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List my wird assignments.
     *
     * @tags wird-v2
     * @name ListMyAssignmentsApiV2WirdMeGet
     * @summary List my wird assignments
     * @request GET:/api/v2/wird/me
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
        format: "json",
        ...params,
      }),

    /**
     * @description Submit wird completion.
     *
     * @tags wird-v2
     * @name CompleteApiV2WirdMeAssignmentIdCompletePost
     * @summary Submit wird completion
     * @request POST:/api/v2/wird/me/{assignment_id}/complete
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
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get calendar feed info.
     *
     * @tags calendar-v2
     * @name GetFeedApiV2CalendarFeedGet
     * @summary Get calendar feed info
     * @request GET:/api/v2/calendar/feed
     */
    getFeedApiV2CalendarFeedGet: (params: RequestParams = {}) =>
      this.request<CalendarFeedRead, HTTPValidationError>({
        path: `/api/v2/calendar/feed`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Enable or disable calendar feed.
     *
     * @tags calendar-v2
     * @name UpdateFeedApiV2CalendarFeedPatch
     * @summary Enable or disable calendar feed
     * @request PATCH:/api/v2/calendar/feed
     */
    updateFeedApiV2CalendarFeedPatch: (
      data: CalendarFeedUpdate,
      params: RequestParams = {},
    ) =>
      this.request<CalendarFeedRead, HTTPValidationError>({
        path: `/api/v2/calendar/feed`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Rotate calendar feed token.
     *
     * @tags calendar-v2
     * @name RotateFeedApiV2CalendarFeedRotatePost
     * @summary Rotate calendar feed token
     * @request POST:/api/v2/calendar/feed/rotate
     */
    rotateFeedApiV2CalendarFeedRotatePost: (params: RequestParams = {}) =>
      this.request<CalendarFeedRotateRead, HTTPValidationError>({
        path: `/api/v2/calendar/feed/rotate`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description Download ICS feed.
     *
     * @tags calendar-v2
     * @name DownloadCalendarFeedApiV2CalendarFeedFeedTokenIcsGet
     * @summary Download ICS feed
     * @request GET:/api/v2/calendar/feed/{feed_token}.ics
     */
    downloadCalendarFeedApiV2CalendarFeedFeedTokenIcsGet: (
      feedToken: string,
      params: RequestParams = {},
    ) =>
      this.request<string, HTTPValidationError>({
        path: `/api/v2/calendar/feed/${feedToken}.ics`,
        method: "GET",
        format: "text",
        ...params,
      }),

    /**
     * @description Get calendar grid view with all scheduled sessions.
     *
     * @tags calendar-v2
     * @name GetCalendarGrid
     * @summary Get calendar grid
     * @request GET:/api/v2/calendar/grid
     */
    getCalendarGrid: (params: RequestParams = {}) =>
      this.request<CalendarGridResponse, HTTPValidationError>({
        path: `/api/v2/calendar/grid`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };

  classes = {
    /**
     * @description List all classes for the current sheikh.
     *
     * @tags classes-v2
     * @name ListClasses
     * @summary List classes
     * @request GET:/api/v2/classes
     */
    listClasses: (params: RequestParams = {}) =>
      this.request<ClassGroupListResponse, HTTPValidationError>({
        path: `/api/v2/classes`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Get history and lessons for a specific class.
     *
     * @tags classes-v2
     * @name GetClassHistory
     * @summary Get class history
     * @request GET:/api/v2/classes/{schedule_id}/history
     */
    getClassHistory: (scheduleId: number, params: RequestParams = {}) =>
      this.request<ClassHistoryResponse, HTTPValidationError>({
        path: `/api/v2/classes/${scheduleId}/history`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Get attendance statistics for a specific class.
     *
     * @tags classes-v2
     * @name GetClassAttendance
     * @summary Get class attendance
     * @request GET:/api/v2/classes/{schedule_id}/attendance
     */
    getClassAttendance: (scheduleId: number, params: RequestParams = {}) =>
      this.request<ClassAttendanceSummary, HTTPValidationError>({
        path: `/api/v2/classes/${scheduleId}/attendance`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description List all classes for the current student.
     *
     * @tags classes-v2
     * @name ListMyClasses
     * @summary List my classes
     * @request GET:/api/v2/classes/me
     */
    listMyClasses: (params: RequestParams = {}) =>
      this.request<ClassGroupListResponse, HTTPValidationError>({
        path: `/api/v2/classes/me`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Get lesson history for a specific class (student view).
     *
     * @tags classes-v2
     * @name GetMyClassHistory
     * @summary Get my class history
     * @request GET:/api/v2/classes/me/{schedule_id}/history
     */
    getMyClassHistory: (scheduleId: number, params: RequestParams = {}) =>
      this.request<ClassHistoryResponse, HTTPValidationError>({
        path: `/api/v2/classes/me/${scheduleId}/history`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Get attendance statistics for a specific class (student view).
     *
     * @tags classes-v2
     * @name GetMyClassAttendance
     * @summary Get my class attendance
     * @request GET:/api/v2/classes/me/{schedule_id}/attendance
     */
    getMyClassAttendance: (scheduleId: number, params: RequestParams = {}) =>
      this.request<ClassAttendanceSummary, HTTPValidationError>({
        path: `/api/v2/classes/me/${scheduleId}/attendance`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };

  classFiles = {
    /**
     * @description Upload a class file (pdf, document, etc).
     *
     * @tags class-files-v2
     * @name UploadClassFile
     * @summary Upload class file
     * @request POST:/api/v2/class-files/{schedule_id}/files
     */
    uploadClassFile: (
      scheduleId: number,
      data: Record<string, any>,
      params: RequestParams = {},
    ) =>
      this.request<ImportNotificationRead, HTTPValidationError>({
        path: `/api/v2/class-files/${scheduleId}/files`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description List files for a specific class.
     *
     * @tags class-files-v2
     * @name ListClassFiles
     * @summary List class files
     * @request GET:/api/v2/class-files/{schedule_id}/files
     */
    listClassFiles: (scheduleId: number, params: RequestParams = {}) =>
      this.request<ClassFileRead[], HTTPValidationError>({
        path: `/api/v2/class-files/${scheduleId}/files`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Download a specific class file.
     *
     * @tags class-files-v2
     * @name DownloadClassFile
     * @summary Download class file
     * @request GET:/api/v2/class-files/{schedule_id}/files/{file_id}
     */
    downloadClassFile: (
      scheduleId: number,
      fileId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v2/class-files/${scheduleId}/files/${fileId}`,
        method: "GET",
        format: "blob",
        ...params,
      }),

    /**
     * @description Delete a specific class file.
     *
     * @tags class-files-v2
     * @name DeleteClassFile
     * @summary Delete class file
     * @request DELETE:/api/v2/class-files/{schedule_id}/files/{file_id}
     */
    deleteClassFile: (
      scheduleId: number,
      fileId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v2/class-files/${scheduleId}/files/${fileId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description List files for a specific class (student view).
     *
     * @tags class-files-v2
     * @name ListMyClassFiles
     * @summary List my class files
     * @request GET:/api/v2/class-files/me/{schedule_id}/files
     */
    listMyClassFiles: (scheduleId: number, params: RequestParams = {}) =>
      this.request<ClassFileRead[], HTTPValidationError>({
        path: `/api/v2/class-files/me/${scheduleId}/files`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Download a specific class file (student view).
     *
     * @tags class-files-v2
     * @name DownloadMyClassFile
     * @summary Download my class file
     * @request GET:/api/v2/class-files/me/{schedule_id}/files/{file_id}
     */
    downloadMyClassFile: (
      scheduleId: number,
      fileId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v2/class-files/me/${scheduleId}/files/${fileId}`,
        method: "GET",
        format: "blob",
        ...params,
      }),
  };

  notifications = {
    /**
     * @description List upcoming sessions for the current sheikh.
     *
     * @tags notifications-v2
     * @name UpcomingSessions
     * @summary Get upcoming sessions
     * @request GET:/api/v2/notifications/sessions/upcoming
     */
    upcomingSessions: (params: RequestParams = {}) =>
      this.request<UpcomingSessionResponse[], HTTPValidationError>({
        path: `/api/v2/notifications/sessions/upcoming`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description List upcoming sessions for the current student.
     *
     * @tags notifications-v2
     * @name MyUpcomingSessions
     * @summary Get my upcoming sessions
     * @request GET:/api/v2/notifications/sessions/me/upcoming
     */
    myUpcomingSessions: (params: RequestParams = {}) =>
      this.request<UpcomingSessionResponse[], HTTPValidationError>({
        path: `/api/v2/notifications/sessions/me/upcoming`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description List all notifications for the current user.
     *
     * @tags notifications-v2
     * @name ListNotifications
     * @summary List notifications
     * @request GET:/api/v2/notifications
     */
    listNotifications: (params: RequestParams = {}) =>
      this.request<NotificationRead[], HTTPValidationError>({
        path: `/api/v2/notifications`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Mark a specific notification as read.
     *
     * @tags notifications-v2
     * @name ReadNotification
     * @summary Mark notification as read
     * @request PATCH:/api/v2/notifications/{notification_id}/read
     */
    readNotification: (
      notificationId: number,
      params: RequestParams = {},
    ) =>
      this.request<NotificationRead, HTTPValidationError>({
        path: `/api/v2/notifications/${notificationId}/read`,
        method: "PATCH",
        format: "json",
        ...params,
      }),

    /**
     * @description Mark all notifications as read for the current user.
     *
     * @tags notifications-v2
     * @name ReadAllNotifications
     * @summary Mark all notifications as read
     * @request POST:/api/v2/notifications/read-all
     */
    readAllNotifications: (params: RequestParams = {}) =>
      this.request<void, HTTPValidationError>({
        path: `/api/v2/notifications/read-all`,
        method: "POST",
        ...params,
      }),
  };

  health = {
    /**
     * No description
     *
     * @name HealthHealthGet
     * @summary Health
     * @request GET:/health
     */
    healthHealthGet: (params: RequestParams = {}) =>
      this.request<Record<string, string>, any>({
        path: `/health`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
