'use client'
import { calenderGetDayData } from "@/app/platform/actions/dashboardv2";
import { LessonRead, LessonType } from "@/lib/openApi";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Book, CheckCircle, Clock, MessageSquare, User, Calendar, ArrowRight } from "lucide-react";
import DashboardPage from "../../page";
import { useLocalization } from "@/lib/localization-context";

export default function CalendarDayDataPage() {
  const searchParams = useSearchParams();
  const dayID = searchParams.get("dayID");
  const { t } = useLocalization();
  const [dayData, setDayData] = React.useState<LessonRead | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!dayID) return;

    const fetchDayData = async () => {
      try {
        setLoading(true);
        const response = await calenderGetDayData(dayID);
        if (!response || response.message === 'fail' || !response.data) {
          console.error("Failed to fetch calendar day data");
          setError(t('lessons.get_error'));
          return;
        }
        const data = response.data;
        setDayData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching calendar day data:", error);
        setDayData(null);
        setError(t('lessons.get_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchDayData();
  }, [dayID, t]);

  // Helper function to get lesson type display name
  const getLessonTypeDisplay = (type: LessonType): string => {
    const typeKey = `lessons.${type}`;
    return t(typeKey);
  };

  // Helper function to get attendance color
  const getAttendanceColor = (attendance: string): string => {
    switch (attendance) {
      case "present":
        return "bg-green-100 text-green-800 border-green-300";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "absent":
        return "bg-red-100 text-red-800 border-red-300";
      case "excused":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const lessonElement = (lesson: LessonRead) => {
    return (
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Type Header Bar */}
        <div className={`h-2 ${
          lesson.type === "new_memorization" ? "bg-purple-600" :
          lesson.type === "revision" ? "bg-blue-600" :
          lesson.type === "evaluation" ? "bg-orange-600" :
          "bg-green-600"
        }`} />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Lesson Type Icon Circle */}
              <div className={`${
                lesson.type === "new_memorization" ? "bg-purple-600" :
                lesson.type === "revision" ? "bg-blue-600" :
                lesson.type === "evaluation" ? "bg-orange-600" :
                "bg-green-600"
              } min-w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{getLessonTypeDisplay(lesson.type)}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {lesson.date}
                  </Badge>
                  <span className="text-slate-400 text-sm">ID: {lesson.id}</span>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-col gap-2 items-end">
              <Badge className={`gap-1 ${getAttendanceColor(lesson.attendance)}`}>
                {lesson.attendance === "present" && <CheckCircle className="w-3 h-3" />}
                {lesson.attendance === "absent" && <AlertCircle className="w-3 h-3" />}
                {lesson.attendance === "late" && <Clock className="w-3 h-3" />}
                {lesson.attendance === "excused" && <CheckCircle className="w-3 h-3" />}
                {lesson.attendance.charAt(0).toUpperCase() + lesson.attendance.slice(1)}
              </Badge>
              {lesson.pass_fail !== null && (
                <Badge variant={lesson.pass_fail ? "default" : "destructive"} className="gap-1">
                  {lesson.pass_fail ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {lesson.pass_fail ? "Passed" : "Failed"}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Subject Matter Section */}
          <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4 border border-purple-100">
            <p className="text-xs text-purple-600 uppercase tracking-wide font-semibold mb-2">{t('lessons.lesson_type')}</p>
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5 text-purple-600" />
              <span className="text-lg font-semibold text-slate-800">{getLessonTypeDisplay(lesson.type)}</span>
            </div>
          </div>

          {/* Absence Reason */}
          {lesson.absence_reason && (
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-orange-700 font-semibold mb-1">{t('lessons.absence_reason')}</p>
                <p className="text-sm text-orange-700">{lesson.absence_reason}</p>
              </div>
            </div>
          )}

          {/* Student Notes */}
          {lesson.student_notes && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-blue-700 font-semibold mb-1">{t('lessons.student_notes')}</p>
                <p className="text-sm text-blue-900">{lesson.student_notes}</p>
              </div>
            </div>
          )}

          {/* Sheikh Notes */}
          {lesson.sheikh_notes && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
              <User className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-amber-700 font-semibold mb-1">{t('lessons.sheikh_notes')}</p>
                <p className="text-sm text-amber-900">{lesson.sheikh_notes}</p>
              </div>
            </div>
          )}

          {/* What Was Heard From Sheikh */}
          {lesson.what_is_heard_from_sheikh && (
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100 mb-4">
              <Book className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-green-700 font-semibold mb-1">{t('lessons.what_heard')}</p>
                <p className="text-sm text-green-900">{lesson.what_is_heard_from_sheikh}</p>
              </div>
            </div>
          )}

          {/* Homework Section */}
          {lesson.homework && (
            <>
              <Separator className="my-4" />
              <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-indigo-600" />
                  {t('lessons.homework')}
                </h4>
                <p className="text-sm text-slate-700">{lesson.homework}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const titleElement = (
    <div className="flex flex-row justify-between my-3">
      <div id="title">
        <p className="text-4xl text-slate-950 font-bold mb-5">{t('lessons.lesson_details')}</p>
      </div>
    </div>
  );

  if (loading) {
    return <DashboardPage title={titleElement}>
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-700 text-lg">{t('lessons.loading_lessons')}</p>
      </div>
    </DashboardPage>;
  }

  if (error) {
    return <DashboardPage title={titleElement}>
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    </DashboardPage>;
  }

  if (!dayData) {
    return <DashboardPage title={titleElement}>
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-700 text-lg">{t('lessons.no_lessons_found')}</p>
      </div>
    </DashboardPage>;
  }

  return (
    <DashboardPage title={titleElement}>
      <div className="space-y-4">
        {lessonElement(dayData)}
      </div>
    </DashboardPage>
  );
}