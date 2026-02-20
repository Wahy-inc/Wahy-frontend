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
  student_id: number;
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
  item_id: String;
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
}

/** LessonCreate */
export interface LessonCreate {
  /** Student Id - Required */
  student_id: string;
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
  juz_number?: string | null;
  /** Ayah From - Optional */
  ayah_from?: string | null;
  /** Ayah To - Optional */
  ayah_to?: string | null;
  /** Quality - Optional */
  quality?: LessonQuality | null;
  /** Absence Reason - Required when attendance is not "present" */
  absence_reason?: string | null;
  /** Student Notes - Optional */
  student_notes?: string | null;
  /** Sheikh Notes - Optional */
  sheikh_notes?: string | null;
  /** Recurrence - RFC 5545 RRULE for bulk lesson creation */
  recurrence?: { rrule: string } | null;
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
  /** Day Of Week */
  day_of_week: number;
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
  /** Is Recurring */
  is_recurring: boolean;
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
      this.request<AttendanceAnalytics, HTTPValidationError>({
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
      this.request<AttendanceAnalytics, HTTPValidationError>({
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
      this.request<LessonRead, HTTPValidationError>({
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
