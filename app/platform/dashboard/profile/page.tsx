'use client'

import React from "react"
import * as openApi from "@/lib/openApi"
import { getStudentMe } from "@/app/platform/actions/dashboard"
import dashboardPage from "../page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Calendar, Clock, BookOpen, DollarSign, FileText } from 'lucide-react'
import { dummyProfile } from "@/lib/dummyData"

// Set to true to use dummy data for testing
const USE_DUMMY_DATA = true

export default function Profile() {
    const [profile, setProfile] = React.useState<openApi.StudentSelfRead | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true)
                if (USE_DUMMY_DATA) {
                    // Use dummy data for testing
                    setProfile(dummyProfile)
                } else {
                    const data = await getStudentMe()
                    setProfile(data)
                }
                setError(null)
            } catch {
                setError('Failed to load profile')
                setProfile(null)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const getStatusBadgeVariant = (status: openApi.StudentStatus): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case openApi.StudentStatus.Active:
                return "default"
            case openApi.StudentStatus.OnHold:
                return "secondary"
            case openApi.StudentStatus.Graduated:
                return "outline"
            case openApi.StudentStatus.Inactive:
                return "destructive"
            default:
                return "secondary"
        }
    }

    const getRegistrationBadgeVariant = (status: openApi.RegistrationStatus): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case openApi.RegistrationStatus.Approved:
                return "default"
            case openApi.RegistrationStatus.Pending:
                return "secondary"
            case openApi.RegistrationStatus.Rejected:
                return "destructive"
            default:
                return "secondary"
        }
    }

    const formatBillingCycle = (cycle: openApi.BillingCycle) => {
        return cycle === openApi.BillingCycle.Weekly ? "Weekly" : "Monthly"
    }

    const title = (
        <div className="flex flex-row items-center gap-4">
            <User className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        </div>
    )

    if (loading) {
        return dashboardPage({
            children: <p className="text-slate-700 text-xl">Loading profile...</p>,
            title: title
        })
    }

    if (error) {
        return dashboardPage({
            children: <p className="text-red-500 text-xl">{error}</p>,
            title: title
        })
    }

    if (!profile) {
        return dashboardPage({
            children: <p className="text-slate-700 text-xl">No profile found.</p>,
            title: title
        })
    }

    const content = (
        <div className="flex flex-col gap-6">
            {/* Personal Information Card */}
            <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-600" />
                        <CardTitle className="text-xl text-slate-800">Personal Information</CardTitle>
                    </div>
                    <CardDescription>Your basic profile details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Full Name (Arabic)</p>
                            <p className="text-lg font-medium text-slate-800" dir="rtl">{profile.full_name_arabic}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Full Name (English)</p>
                            <p className="text-lg font-medium text-slate-800">{profile.full_name_english}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-500" />
                                <p className="text-sm text-slate-500">Phone</p>
                            </div>
                            <p className="text-lg font-medium text-slate-800">{profile.phone || "Not provided"}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <p className="text-sm text-slate-500">Date of Birth</p>
                            </div>
                            <p className="text-lg font-medium text-slate-800">{profile.date_of_birth || "Not provided"}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <p className="text-sm text-slate-500">Timezone</p>
                            </div>
                            <p className="text-lg font-medium text-slate-800">{profile.timezone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Student ID</p>
                            <p className="text-lg font-medium text-slate-800">#{profile.id}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-xl text-slate-800">Status</CardTitle>
                    <CardDescription>Your current enrollment status</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Account Status:</span>
                            <Badge variant={getStatusBadgeVariant(profile.status)}>
                                {profile.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Registration:</span>
                            <Badge variant={getRegistrationBadgeVariant(profile.registration_status)}>
                                {profile.registration_status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-slate-600" />
                        <CardTitle className="text-xl text-slate-800">Quran Progress</CardTitle>
                    </div>
                    <CardDescription>Your current memorization progress</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 rounded-lg text-center">
                            <p className="text-sm text-slate-500 mb-1">Current Juz</p>
                            <p className="text-3xl font-bold text-slate-800">{profile.current_juz || "-"}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg text-center">
                            <p className="text-sm text-slate-500 mb-1">Current Surah</p>
                            <p className="text-xl font-bold text-slate-800">{profile.current_surah || "-"}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg text-center">
                            <p className="text-sm text-slate-500 mb-1">Current Ayah</p>
                            <p className="text-3xl font-bold text-slate-800">{profile.current_ayah || "-"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Billing Card */}
            <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-slate-600" />
                        <CardTitle className="text-xl text-slate-800">Lesson & Billing</CardTitle>
                    </div>
                    <CardDescription>Your lesson schedule and billing information</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Lessons per Week</p>
                            <p className="text-2xl font-bold text-slate-800">{profile.lessons_per_week}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Lesson Rate</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {profile.lesson_rate ? `$${profile.lesson_rate}` : "Not set"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Billing Cycle</p>
                            <p className="text-2xl font-bold text-slate-800">{formatBillingCycle(profile.billing_cycle)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notes Card */}
            {profile.special_notes && (
                <Card className="border-slate-200">
                    <CardHeader className="border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-slate-600" />
                            <CardTitle className="text-xl text-slate-800">Special Notes</CardTitle>
                        </div>
                        <CardDescription>Additional notes from your sheikh</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-slate-700 whitespace-pre-wrap">{profile.special_notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )

    return dashboardPage({ children: content, title: title })
}
