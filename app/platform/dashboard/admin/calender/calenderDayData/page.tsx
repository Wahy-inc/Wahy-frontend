'use client'
import { calenderGetDayData } from "@/app/platform/actions/dashboardv2";
import { LessonRead, LessonType } from "@/lib/openApi";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Book, CheckCircle, Clock, MessageSquare, User, AlertTriangle, Award, Calendar, ArrowRight } from "lucide-react";
import DashboardPage from "../../page";

export default function CalendarDayDataPage() {
  const searchParams = useSearchParams();
  const dayID = searchParams.get("dayID");
  const [dayData, setDayData] = React.useState<LessonRead | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDayData = async (dayID: string) => {
    try {
      setLoading(true);
      const response = await calenderGetDayData(dayID);
      if (!response || response.message === 'fail' || !response.data) {
        console.error("Failed to fetch calendar day data");
        setError("Failed to load lesson data");
        return;
      }
      const data = response.data;
      setDayData(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching calendar day data:", error);
      setDayData(null);
      setError("Error fetching lesson data");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!dayID) return;
    fetchDayData(dayID);
  }, [dayID]);

  // Helper function to get lesson type display name
  const getLessonTypeDisplay = (type: LessonType): string => {
    const typeMap: Record<LessonType, string> = {
      new_memorization: "New Memorization",
      revision: "Revision",
      evaluation: "Evaluation",
      makeup: "Make-up"
    };
    return typeMap[type] || type;
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
    const surahInfo = lesson.surah_name ? `${lesson.surah_name} ${lesson.ayah_from ? `(${lesson.ayah_from}${lesson.ayah_to ? `-${lesson.ayah_to}` : ""})` : ""}` : "Not specified";

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
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4 border border-purple-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-purple-600 uppercase tracking-wide font-semibold mb-2">Subject Matter</p>
                <div className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-purple-600" />
                  <span className="text-lg font-semibold text-slate-800">{surahInfo}</span>
                </div>
                {lesson.juz_number && (
                  <p className="text-sm text-slate-600 mt-2">Juz {lesson.juz_number}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quality & Performance Section */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Quality Rating */}
            <div className="bg-gray-100 rounded-lg p-4 border-2 border-opacity-30 text-gray-700">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Quality Rating</p>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 opacity-70" />
                <span className="text-lg font-bold">Not Rated</span>
              </div>
            </div>

            {/* Attempts */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-2">Attempts</p>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-indigo-600" />
                <span className="text-lg font-bold text-slate-800">{lesson.attempts}</span>
              </div>
            </div>
          </div>

          {/* Absence Reason */}
          {lesson.absence_reason && (
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-orange-700 font-semibold mb-1">Absence Reason</p>
                <p className="text-sm text-orange-700">{lesson.absence_reason}</p>
              </div>
            </div>
          )}

          {/* Student Notes */}
          {lesson.student_notes && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-700 font-semibold mb-1">Student Feedback</p>
                <p className="text-sm text-blue-900">{lesson.student_notes}</p>
              </div>
            </div>
          )}

          {/* Sheikh Notes */}
          {lesson.sheikh_notes && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
              <User className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-700 font-semibold mb-1">Sheikh Notes</p>
                <p className="text-sm text-amber-900">{lesson.sheikh_notes}</p>
              </div>
            </div>
          )}

          {/* Recitation Text */}
          {lesson.surah_name && (
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100 mb-4">
              <Book className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-green-700 font-semibold mb-1">What Was `Recited`</p>
                <p className="text-sm text-green-900">Recited</p>
              </div>
            </div>
          )}

          {/* Homework Section */}
          {lesson.next_homework_type && (
            <>
              <Separator className="my-4" />
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-indigo-600" />
                  Next Assignment
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold mb-1">Type</p>
                    <p className="text-sm font-semibold text-slate-800">{getLessonTypeDisplay(lesson.next_homework_type)}</p>
                  </div>
                  {lesson.next_homework_surah && (
                    <div>
                      <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold mb-1">Subject</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {lesson.next_homework_surah}
                        {lesson.next_homework_ayah_from && ` (${lesson.next_homework_ayah_from}${lesson.next_homework_ayah_to ? `-${lesson.next_homework_ayah_to}` : ""})`}
                      </p>
                    </div>
                  )}
                  {lesson.next_homework_due_date && (
                    <div>
                      <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold mb-1">Due Date</p>
                      <p className="text-sm font-semibold text-slate-800">{lesson.next_homework_due_date}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {lesson.next_homework_surah && (
            <div className="flex items-start gap-3 p-3 bg-cyan-50 rounded-lg border border-cyan-100 mt-4">
              <Book className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-cyan-700 font-semibold mb-1">Homework Assignment</p>
                <p className="text-sm text-cyan-900">{lesson.next_homework_surah}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const titleElement = (
    <div className="flex flex-row justify-between my-3">
      <div id="title">
        <p className="text-4xl text-slate-950 font-bold mb-5">Lesson Details</p>
      </div>
    </div>
  );

  if (loading) {
    return <DashboardPage title={titleElement}>
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-700 text-lg">Loading lesson data...</p>
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
        <p className="text-slate-700 text-lg">No lesson data found</p>
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