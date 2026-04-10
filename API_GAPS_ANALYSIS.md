# OpenAPI Specification vs TypeScript Implementation Analysis

## Summary
The `openApi.ts` file is a **73% complete** auto-generated TypeScript client for the Wahy API. It covers v1 endpoints and most v2 endpoints, but is **missing three entire v2 feature categories**: Calendar Grid, Classes, Class Files, and Notifications (v2).

**Total Missing Endpoints: 18**  
**Total Missing Types: 11**

---

## 1. Missing API Endpoints

### 1.1 Calendar Grid View (v2)
**Missing Endpoint:** `GET /api/v2/calendar/grid`

- **Purpose:** Get structured calendar data for a date range
- **Required Parameters:**
  - `start_date` (required): Start date (YYYY-MM-DD)
  - `end_date` (optional): End date (defaults to 7 days after start_date)
- **Response Type:** `CalendarGridResponse`
- **Authentication:** Student and Sheikh roles

**Impact:** Calendar UI cannot display grid view of lessons/events across a date range

---

### 1.2 Classes Group Management (v2) - 6 Endpoints Missing

#### 1.2.1 List Classes for Sheikh
**Endpoint:** `GET /api/v2/classes`
- **Summary:** List class groups (sheikh)
- **Description:** List all active classes grouped by their recurring schedule
- **Response Type:** `ClassGroupListResponse[]`
- **Auth:** Sheikh role required

#### 1.2.2 Get Class History
**Endpoint:** `GET /api/v2/classes/{schedule_id}/history`
- **Summary:** Get class history (sheikh)
- **Description:** Paginated lesson history for a specific class group
- **Parameters:**
  - `schedule_id` (path, required): Schedule ID
  - `limit` (query, optional): 1-100, default 20
  - `offset` (query, optional): default 0
- **Response Type:** `ClassHistoryResponse`
- **Auth:** Sheikh role required

#### 1.2.3 Get Class Attendance
**Endpoint:** `GET /api/v2/classes/{schedule_id}/attendance`
- **Summary:** Get class attendance (sheikh)
- **Description:** Attendance summary for a specific class group
- **Parameters:**
  - `schedule_id` (path, required): Schedule ID
  - `start_date` (query, optional): Defaults to 30 days ago
  - `end_date` (query, optional): Defaults to today
- **Response Type:** `ClassAttendanceSummary`
- **Auth:** Sheikh role required

#### 1.2.4 List My Classes
**Endpoint:** `GET /api/v2/classes/me`
- **Summary:** List my classes (student)
- **Description:** List the student's own class groups
- **Response Type:** `ClassGroupListResponse[]`
- **Auth:** Student role required

#### 1.2.5 Get My Class History
**Endpoint:** `GET /api/v2/classes/me/{schedule_id}/history`
- **Summary:** Get my class history (student)
- **Description:** Lesson history for the student's own class
- **Parameters:**
  - `schedule_id` (path, required): Schedule ID
  - `limit` (query, optional): 1-100, default 20
  - `offset` (query, optional): default 0
- **Response Type:** `ClassHistoryResponse`
- **Auth:** Student role required

#### 1.2.6 Get My Class Attendance
**Endpoint:** `GET /api/v2/classes/me/{schedule_id}/attendance`
- **Summary:** Get my class attendance (student)
- **Description:** Attendance summary for the student's own class
- **Parameters:**
  - `schedule_id` (path, required): Schedule ID
  - `start_date` (query, optional): YYYY-MM-DD format
  - `end_date` (query, optional): YYYY-MM-DD format
- **Response Type:** `ClassAttendanceSummary`
- **Auth:** Student role required

---

### 1.3 Class Files Management (v2) - 6 Endpoints Missing

#### 1.3.1 Upload Class File
**Endpoint:** `POST /api/v2/class-files/{schedule_id}/files`
- **Summary:** Upload class file (sheikh)
- **Description:** Upload a file to a class group (schedule)
- **Parameters:**
  - `schedule_id` (path, required): Schedule ID
  - `file` (body, required): File to upload (multipart/form-data)
- **Response Type:** `ClassFileRead`
- **Auth:** Sheikh role required
- **Content-Type:** `multipart/form-data`

#### 1.3.2 List Class Files
**Endpoint:** `GET /api/v2/class-files/{schedule_id}/files`
- **Summary:** List class files
- **Description:** List files for a class group (accessible to both sheikh and students in the class)
- **Parameters:**
  - `schedule_id` (path, required): Schedule ID
- **Response Type:** `ClassFileRead[]`
- **Auth:** Sheikh or Student role required

#### 1.3.3 Download Class File
**Endpoint:** `GET /api/v2/class-files/{schedule_id}/files/{file_id}`
- **Summary:** Download class file
- **Description:** Download a file from a class group
- **Parameters:**
  - `schedule_id` (path, required): Schedule ID
  - `file_id` (path, required): File ID
- **Response Type:** Binary file (blob)
- **Auth:** Sheikh or Student role required

#### 1.3.4 Delete Class File
**Endpoint:** `DELETE /api/v2/class-files/{schedule_id}/files/{file_id}`
- **Summary:** Delete class file (sheikh)
- **Description:** Delete a file from a class group
- **Parameters:**
  - `schedule_id` (path, required): Schedule ID
  - `file_id` (path, required): File ID
- **Response Type:** 204 No Content
- **Auth:** Sheikh role required

#### 1.3.5 List My Class Files
**Endpoint:** `GET /api/v2/class-files/me/{schedule_id}/files`
- **Summary:** List my class files (student)
- **Description:** List files for the student's own class
- **Parameters:**
  - `schedule_id` (path, required): Schedule ID
- **Response Type:** `ClassFileRead[]`
- **Auth:** Student role required

#### 1.3.6 Download My Class File
**Endpoint:** `GET /api/v2/class-files/me/{schedule_id}/files/{file_id}`
- **Summary:** Download my class file (student)
- **Description:** Download a file from the student's own class
- **Parameters:**
  - `schedule_id` (path, required): Schedule ID
  - `file_id` (path, required): File ID
- **Response Type:** Binary file (blob)
- **Auth:** Student role required

---

### 1.4 Notifications Management (v2) - 5 Endpoints Missing

#### 1.4.1 Get Upcoming Sessions
**Endpoint:** `GET /api/v2/notifications/sessions/upcoming`
- **Summary:** Get upcoming sessions
- **Description:** Get sessions starting within the next hour
- **Response Type:** `UpcomingSessionResponse[]`
- **Auth:** Sheikh role required

#### 1.4.2 Get My Upcoming Sessions
**Endpoint:** `GET /api/v2/notifications/sessions/me/upcoming`
- **Summary:** Get my upcoming sessions (student)
- **Description:** Get the student's own upcoming sessions
- **Response Type:** `UpcomingSessionResponse[]`
- **Auth:** Student role required

#### 1.4.3 List Notifications
**Endpoint:** `GET /api/v2/notifications`
- **Summary:** List notifications
- **Description:** List notifications for the current user
- **Parameters:**
  - `is_read` (query, optional): Filter by read/unread status
  - `limit` (query, optional): 1-100, default 50
  - `offset` (query, optional): default 0
- **Response Type:** `NotificationRead[]`
- **Auth:** Any authenticated role

#### 1.4.4 Mark Notification as Read
**Endpoint:** `PATCH /api/v2/notifications/{notification_id}/read`
- **Summary:** Mark notification as read
- **Parameters:**
  - `notification_id` (path, required): Notification ID
- **Response Type:** `NotificationRead`
- **Auth:** Any authenticated role

#### 1.4.5 Mark All Notifications as Read
**Endpoint:** `POST /api/v2/notifications/read-all`
- **Summary:** Mark all notifications as read
- **Response Type:** 204 No Content
- **Auth:** Any authenticated role

---

## 2. Missing Data Types/Interfaces

### 2.1 Calendar-Related Types

#### `CalendarGridResponse`
```typescript
{
  slots: CalendarSlotItem[]
}
```

#### `CalendarSlotItem`
```typescript
{
  date: string                        // YYYY-MM-DD
  start_time: string                  // HH:MM:SS UTC
  end_time: string                    // HH:MM:SS UTC
  schedule_id: number
  student_id: number
  student_name_en: string
  student_name_ar: string
  lesson_data: LessonRead | null      // Recorded lesson or null
}
```

---

### 2.2 Classes-Related Types

#### `ClassGroupListResponse`
```typescript
{
  classes: ClassGroupItem[]
}
```

#### `ClassGroupItem`
```typescript
{
  schedule_id: number
  student_id: number
  student_name_en: string
  student_name_ar: string
  day_label: string                   // 'Wednesday' or 'Sat, Mon'
  start_time: string                  // HH:MM:SS UTC
  end_time: string                    // HH:MM:SS UTC
  rrule_string: string | null         // RRULE or null for one-off
  effective_from: string              // YYYY-MM-DD
  effective_until: string | null      // YYYY-MM-DD
  next_occurrence: string | null      // YYYY-MM-DD
  total_lessons: number
  is_active: boolean
}
```

#### `ClassHistoryResponse`
```typescript
{
  lessons: LessonRead[]
  total: number                       // Total lessons in class
}
```

#### `ClassAttendanceSummary`
```typescript
{
  schedule_id: number
  student_name_en: string
  student_name_ar: string
  period_start: string                // YYYY-MM-DD
  period_end: string                  // YYYY-MM-DD
  expected_sessions: number
  attended_sessions: number           // present or late
  absent_sessions: number
  attendance_rate: number             // 0.0 - 1.0
}
```

#### `ClassFileRead`
```typescript
{
  id: number
  schedule_id: number
  sheikh_id: number
  original_filename: string
  stored_filename: string
  file_path: string
  file_size_bytes: number
  mime_type: string
  download_count: number
  created_at: string                  // ISO 8601 datetime
  updated_at: string                  // ISO 8601 datetime
}
```

#### `Body_upload_class_file_api_v2_class_files__schedule_id__files_post`
```typescript
{
  file: File                          // Required file to upload
}
```

---

### 2.3 Notifications-Related Types

#### `NotificationRead`
```typescript
{
  id: number
  user_id: number
  type: NotificationType              // 'upcoming_session' | 'schedule_reminder' | 'system'
  title: string
  body: string | null
  related_entity_type: string | null
  related_entity_id: number | null
  is_read: boolean
  read_at: string | null              // ISO 8601 datetime
  scheduled_for: string | null        // ISO 8601 datetime
  created_at: string                  // ISO 8601 datetime
  updated_at: string                  // ISO 8601 datetime
}
```

#### `NotificationType` (Enum)
```typescript
enum NotificationType {
  UpcomingSession = "upcoming_session",
  ScheduleReminder = "schedule_reminder",
  System = "system",
}
```

#### `UpcomingSessionResponse`
```typescript
{
  schedule_id: number
  student_id: number
  student_name_en: string
  student_name_ar: string
  start_time: string                  // HH:MM:SS UTC
  end_time: string                    // HH:MM:SS UTC
  date: string                        // YYYY-MM-DD
  minutes_until_start: number
}
```

---

## 3. Summary of Gaps

### Endpoints Status
| Category | Implemented | Missing | Total |
|----------|-------------|---------|-------|
| Auth (v1) | 5 | 0 | 5 |
| Students (v1) | 8 | 0 | 8 |
| Schedules (v1) | 6 | 0 | 6 |
| Lessons (v1) | 6 | 0 | 6 |
| Invoices (v1) | 8 | 0 | 8 |
| Library (v1) | 6 | 0 | 6 |
| Analytics (v1) | 4 | 0 | 4 |
| Sync (v1) | 3 | 0 | 3 |
| Sheikh (v1) | 2 | 0 | 2 |
| Wird (v2) | 7 | 0 | 7 |
| Calendar Feed (v2) | 4 | 0 | 4 |
| Calendar Grid (v2) | 0 | 1 | 1 |
| Classes (v2) | 0 | 6 | 6 |
| Class Files (v2) | 0 | 6 | 6 |
| Notifications (v2) | 0 | 5 | 5 |
| Health Check | 1 | 0 | 1 |
| **TOTALS** | **67** | **18** | **85** |

### Types Status
| Category | Implemented | Missing | Total |
|----------|-------------|---------|-------|
| Enums | 10 | 1 | 11 |
| Request Bodies | 20 | 1 | 21 |
| Response Models | 35 | 10 | 45 |
| **TOTALS** | **65** | **11** | **76** |

---

## 4. Impact Analysis

### High Priority (Core Features)
**Classes Management** - Required for:
- Displaying class-level lesson history and attendance
- Grouping lessons by recurring schedule
- Querying attendance patterns per class

**Class Files** - Required for:
- Uploading teaching materials to classes
- Students accessing class resources
- File management endpoints

**Calendar Grid** - Required for:
- Calendar UI/UX components
- Visual week/month views of schedule

### Medium Priority (User Experience)
**Notifications** - Provides:
- Session reminders and alerts
- Notification center UI
- User-facing alerts for upcoming lessons

---

## 5. Recommendations

### Immediate Actions
1. **Regenerate TypeScript client** from the updated openapi.json
   - Use: `swagger-typescript-api` or similar OpenAPI code generator
   - Command example: `swagger-typescript-api -p ../../Downloads/openapi.json -o ./lib/generated -n openApi`

2. **Verify generator settings**
   - Ensure `multipart/form-data` is handled correctly for file uploads
   - Verify cookie-based auth (`access_token` cookie) parameters

### If Manual Implementation is Required
Implement types and methods in this order:

1. **Phase 1 - Calendar Grid** (1 type, 1 method)
2. **Phase 2 - Classes** (4 types, 6 methods)
3. **Phase 3 - Class Files** (1 request body type, 1 response type, 6 methods)
4. **Phase 4 - Notifications** (3 types, 5 methods)

### Testing Considerations
- File upload tests for class files (multipart/form-data)
- Pagination tests for class history and notifications
- Date range parameter tests for calendar/attendance endpoints
- Cookie-based authentication across all v2 endpoints

---

## 6. File Generation Notes

The current `openApi.ts` was generated by `swagger-typescript-api`:
```
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
```

To regenerate with all endpoints, use the updated openapi.json and run the generator again. This will automatically add all missing types and methods while preserving the existing code structure.
