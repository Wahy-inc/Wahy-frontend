import * as openApi from "./openApi"

export const dummyClassGroupItems: openApi.ClassGroupItem[] = [
  {
    schedule_id: 1,
    student_id: 101,
    student_name_en: "Ahmed Hassan",
    student_name_ar: "أحمد حسن",
    day_label: "Monday",
    start_time: "09:00",
    end_time: "10:00",
    rrule_string: "FREQ=WEEKLY;BYDAY=MO",
    effective_from: "2026-01-15",
    effective_until: "2026-12-31",
    next_occurrence: "2026-04-21",
    total_lessons: 12,
    is_active: true,
  },
  {
    schedule_id: 2,
    student_id: 102,
    student_name_en: "Fatima Mohammed",
    student_name_ar: "فاطمة محمد",
    day_label: "Tuesday",
    start_time: "10:30",
    end_time: "11:30",
    rrule_string: "FREQ=WEEKLY;BYDAY=TU,TH",
    effective_from: "2026-02-01",
    effective_until: "2026-11-30",
    next_occurrence: "2026-04-22",
    total_lessons: 18,
    is_active: true,
  },
  {
    schedule_id: 3,
    student_id: 103,
    student_name_en: "Muhammad Ali",
    student_name_ar: "محمد علي",
    day_label: "Wednesday",
    start_time: "14:00",
    end_time: "15:00",
    rrule_string: "FREQ=WEEKLY;BYDAY=WE,FR",
    effective_from: "2026-01-20",
    effective_until: null,
    next_occurrence: "2026-04-23",
    total_lessons: 24,
    is_active: true,
  },
  {
    schedule_id: 4,
    student_id: 104,
    student_name_en: "Leila Ahmed",
    student_name_ar: "ليلى أحمد",
    day_label: "Thursday",
    start_time: "15:30",
    end_time: "16:30",
    rrule_string: "FREQ=WEEKLY;BYDAY=TH",
    effective_from: "2026-03-01",
    effective_until: "2026-08-31",
    next_occurrence: "2026-04-24",
    total_lessons: 8,
    is_active: true,
  },
  {
    schedule_id: 5,
    student_id: 105,
    student_name_en: "Karim Ibrahim",
    student_name_ar: "كريم إبراهيم",
    day_label: "Friday",
    start_time: "16:00",
    end_time: "17:00",
    rrule_string: null,
    effective_from: "2026-04-15",
    effective_until: "2026-04-15",
    next_occurrence: null,
    total_lessons: 1,
    is_active: false,
  },
  {
    schedule_id: 6,
    student_id: 106,
    student_name_en: "Noor Hassan",
    student_name_ar: "نور حسن",
    day_label: "Saturday",
    start_time: "11:00",
    end_time: "12:00",
    rrule_string: "FREQ=WEEKLY;BYDAY=SA,SU",
    effective_from: "2026-01-10",
    effective_until: "2026-06-30",
    next_occurrence: "2026-04-25",
    total_lessons: 15,
    is_active: true,
  },
  {
    schedule_id: 7,
    student_id: 107,
    student_name_en: "Zainab Khalil",
    student_name_ar: "زينب خليل",
    day_label: "Sunday",
    start_time: "13:00",
    end_time: "14:00",
    rrule_string: "FREQ=WEEKLY;BYDAY=SU",
    effective_from: "2026-02-15",
    effective_until: "2026-09-30",
    next_occurrence: "2026-04-26",
    total_lessons: 20,
    is_active: true,
  },
  {
    schedule_id: 8,
    student_id: 108,
    student_name_en: "Omar Samir",
    student_name_ar: "عمر سمير",
    day_label: "Monday",
    start_time: "17:00",
    end_time: "18:00",
    rrule_string: "FREQ=WEEKLY;BYDAY=MO,WE,FR",
    effective_from: "2026-03-15",
    effective_until: "2026-10-31",
    next_occurrence: "2026-04-21",
    total_lessons: 22,
    is_active: true,
  },
]

export const getDummyClassGroupItem = (id: number): openApi.ClassGroupItem | undefined => {
  return dummyClassGroupItems.find((item) => item.schedule_id === id)
}

export const getDummyClassGroupItemsByStudentId = (
  studentId: number,
): openApi.ClassGroupItem[] => {
  return dummyClassGroupItems.filter((item) => item.student_id === studentId)
}

export const getDummyActiveClassGroupItems = (): openApi.ClassGroupItem[] => {
  return dummyClassGroupItems.filter((item) => item.is_active)
}

export const getDummyClassGroupItemsByDay = (day: string): openApi.ClassGroupItem[] => {
  return dummyClassGroupItems.filter((item) => item.day_label === day)
}
