'use client'

import React, { useActionState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "../../actions/auth"
import { Button } from "@/components/ui/button"
import * as openApi from "@/lib/openApi"
import { useLocalization } from "@/lib/localization-context"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToastListener } from "@/lib/toastListener"

export default function SignUp() {
    const { t } = useLocalization()
    const [state, action, pending] = useActionState(signup, undefined)
    const router = useRouter()

    useToastListener(state, {functionName: "Sign Up", successMessage: "Signup successful", errorMessage: "Failed to sign up"})

    React.useEffect(() => {
        if (state?.message === 'Signup successful') {
            router.replace('/platform/dashboard/student')
        }
    }, [state, router])

    return (
    <form action={action} className="w-xs lg:w-5xl mx-auto my-30 border-2 border-slate-800 p-6 rounded-lg shadow-lg bg-slate-800 text-slate-100">
    <FieldGroup>
      <div className="flex flex-row justify-between gap-3">
      <Field>
        <FieldLabel htmlFor="ar-name">{t('auth.name_arabic_label')}</FieldLabel>
        <Input 
          id="ar-name" 
          name="ar-name"
          placeholder={t('auth.name_arabic_placeholder')} 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
        />
        {state?.error?.arname && <p className="text-red-500 text-sm">{state.error.arname}</p>}
      </Field>
      <Field>
        <FieldLabel htmlFor="en-name">{t('auth.name_english_label')}</FieldLabel>
        <Input 
          id="en-name" 
          name="en-name"
          placeholder={t('auth.name_english_placeholder')} 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
        />
      {state?.error?.enname && <p className="text-red-500 text-sm">{state.error.enname}</p>}
      </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="email">{t('auth.email_label')}</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t('auth.email_placeholder')}
          className="bg-slate-100 text-slate-800"
          disabled={pending}
        />
        {state?.error?.email && <p className="text-red-500 text-sm">{state.error.email}</p>}
      </Field>
      <Field>
        <FieldLabel htmlFor="password">{t('auth.password_label')}</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={t('auth.password_placeholder')}
          className="bg-slate-100 text-slate-800"
          disabled={pending}
        />
        {state?.error?.password && <p className="text-red-500 text-sm">{state.error.password}</p>}
      </Field>
      <Field>
      <FieldLabel htmlFor="phone">{t('auth.phone_optional_label')}</FieldLabel>
        <Input 
          id="phone" 
          name="phone"
          placeholder={t('auth.phone_placeholder')} 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="text"
        />
        {state?.error?.phone && <p className="text-red-500 text-sm">{state.error.phone}</p>}
      </Field>
      <div className="flex flex-row justify-between gap-3">
      <Field>
      <FieldLabel htmlFor="date-of-birth">{t('auth.date_of_birth_optional_label')}</FieldLabel>
        <Input 
          id="date-of-birth" 
          name="date-of-birth"
          placeholder={t('auth.date_placeholder')} 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="date"
        />
        {state?.error?.dateOfBirth && <p className="text-red-500 text-sm">{state.error.dateOfBirth}</p>}
      </Field>
      <Field>
      <FieldLabel htmlFor="time-zone">Time Zone</FieldLabel>
        <Input 
          id="time-zone" 
          name="time-zone"
          placeholder="Enter your time zone (e.g., UTC+3)" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="text"
        />
        {state?.error?.timeZone && <p className="text-red-500 text-sm">{state.error.timeZone}</p>}
      </Field>
      </div>
      <div className="flex flex-row justify-between gap-3 items-center">
      <Field>
      <FieldLabel htmlFor="lessons-per-week" style={{minHeight: '3rem'}}>Classes per week</FieldLabel>
        <Input 
          id="lessons-per-week" 
          name="lessons-per-week"
          placeholder="" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="number"
        />
        {state?.error?.lessonsPerWeek && <p className="text-red-500 text-sm">{state.error.lessonsPerWeek}</p>}
      </Field>
      <Field>
      <FieldLabel htmlFor="lessons-rate" style={{minHeight: '3rem'}}>Classes rate (Optional)</FieldLabel>
        <Input 
          id="lessons-rate" 
          name="lessons-rate"
          placeholder="" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="number"
        />
        {state?.error?.lessonRate && <p className="text-red-500 text-sm">{state.error.lessonRate}</p>}
      </Field>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <label htmlFor="billingCycle" className="text-sm font-medium p-5">Billing Cycle</label>
            <Select name="billingCycle" disabled={pending}>
                <SelectTrigger className="w-full max-w-48" >
                    <SelectValue placeholder="Billing Cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Billing Cycle</SelectLabel>
                    <SelectItem value={openApi.BillingCycle.Weekly}>Weekly</SelectItem>
                    <SelectItem value={openApi.BillingCycle.Monthly}>Monthly</SelectItem>
                  </SelectGroup>
                </SelectContent>
            </Select>
        </div>
      {state?.error?.billingCycle && <p className="text-red-500 text-sm">{state.error.billingCycle}</p>}
      </div>
      </div>
      <Field>
      <FieldLabel htmlFor="special-notes">Special notes (Optional)</FieldLabel>
        <Input 
          id="special-notes" 
          name="special-notes"
          placeholder="Enter any special notes" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="text"
          style={{minHeight: '10rem'}}
        />
      </Field>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline" className="text-slate-800 border-2 border-slate-800" disabled={pending}>
          Reset
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting..." : "Submit"}
        </Button>
      </Field>
    </FieldGroup>
    </form>
    )
}