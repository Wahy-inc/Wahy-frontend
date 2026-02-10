'use client'

import React, { useActionState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "../../actions/auth"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function SignUp() {
    const [state, action, pending] = useActionState(signup, undefined)
    const router = useRouter()

    React.useEffect(() => {
        if (state?.message === 'Signup successful') {
            router.replace('/platform/dashboard')
        }
    }, [state, router])

    return (
    <form action={action} className="w-xs lg:w-5xl mx-auto my-30 border-2 border-slate-800 p-6 rounded-lg shadow-lg bg-slate-800 text-slate-100">
    <FieldGroup>
      <div className="flex flex-row justify-between gap-3">
      <Field>
        <FieldLabel htmlFor="ar-name">Name in Arabic</FieldLabel>
        <Input 
          id="ar-name" 
          name="ar-name"
          placeholder="Ahmed Mohammed" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
        />
        {state?.error?.arname && <p className="text-red-500 text-sm">{state.error.arname}</p>}
      </Field>
      <Field>
        <FieldLabel htmlFor="en-name">Name in English</FieldLabel>
        <Input 
          id="en-name" 
          name="en-name"
          placeholder="Ahmed Mohammed" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
        />
      {state?.error?.enname && <p className="text-red-500 text-sm">{state.error.enname}</p>}
      </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          className="bg-slate-100 text-slate-800"
          disabled={pending}
        />
        {state?.error?.email && <p className="text-red-500 text-sm">{state.error.email}</p>}
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          className="bg-slate-100 text-slate-800"
          disabled={pending}
        />
        {state?.error?.password && <p className="text-red-500 text-sm">{state.error.password}</p>}
      </Field>
      <Field>
      <FieldLabel htmlFor="phone">Phone</FieldLabel>
        <Input 
          id="phone" 
          name="phone"
          placeholder="Enter your phone number" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="text"
        />
        {state?.error?.phone && <p className="text-red-500 text-sm">{state.error.phone}</p>}
      </Field>
      <div className="flex flex-row justify-between gap-3">
      <Field>
      <FieldLabel htmlFor="date-of-birth">Date of Birth</FieldLabel>
        <Input 
          id="date-of-birth" 
          name="date-of-birth"
          placeholder="yyyy-mm-dd" 
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
      <div className="flex flex-row justify-between gap-3">
      <Field>
      <FieldLabel htmlFor="current-juz" style={{minHeight: '3rem'}}>Current juz</FieldLabel>
        <Input 
          id="current-juz" 
          name="current-juz"
          placeholder="Enter your current juz" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="number"
        />
        {state?.error?.currjuz && <p className="text-red-500 text-sm">{state.error.currjuz}</p>}
      </Field>
      <Field>
      <FieldLabel htmlFor="current-surah" style={{minHeight: '3rem'}}>Current surah</FieldLabel>
        <Input 
          id="current-surah" 
          name="current-surah"
          placeholder="Enter your current surah" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="text"
        />
        {state?.error?.currsurah && <p className="text-red-500 text-sm">{state.error.currsurah}</p>}
      </Field>
      <Field>
      <FieldLabel htmlFor="current-ayah" style={{minHeight: '3rem'}}>Current ayah</FieldLabel>
        <Input 
          id="current-ayah" 
          name="current-ayah"
          placeholder="Enter your current ayah" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="number"
        />
        {state?.error?.currayah && <p className="text-red-500 text-sm">{state.error.currayah}</p>}
      </Field>
      </div>
      <div className="flex flex-row justify-between gap-3 items-center">
      <Field>
      <FieldLabel htmlFor="lessons-per-week" style={{minHeight: '3rem'}}>Lessons per week</FieldLabel>
        <Input 
          id="lessons-per-week" 
          name="lessons-per-week"
          placeholder="Enter your lessons per week" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="number"
        />
        {state?.error?.lessonsPerWeek && <p className="text-red-500 text-sm">{state.error.lessonsPerWeek}</p>}
      </Field>
      <Field>
      <FieldLabel htmlFor="lessons-rate" style={{minHeight: '3rem'}}>Lessons rate</FieldLabel>
        <Input 
          id="lessons-rate" 
          name="lessons-rate"
          placeholder="Enter your lessons rate" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="number"
        />
        {state?.error?.lessonRate && <p className="text-red-500 text-sm">{state.error.lessonRate}</p>}
      </Field>
      <Field>
      <FieldLabel htmlFor="billing-cycle" style={{minHeight: '3rem'}}>Billing cycle</FieldLabel>
        <Input 
          id="billing-cycle" 
          name="billing-cycle"
          placeholder="Enter your billing cycle (e.g., monthly, weekly)" 
          className="bg-slate-100 text-slate-800"
          disabled={pending}
          type="number"
        />
        {state?.error?.BillingCycle && <p className="text-red-500 text-sm">{state.error.BillingCycle}</p>}
      </Field>
      </div>
      <Field>
      <FieldLabel htmlFor="special-notes">Special notes</FieldLabel>
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