'use client'

import React, { useActionState } from "react"
import { useRouter } from "next/navigation"
import { signinAdmin, signinStudent } from "../../actions/auth"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useToastListener } from "@/lib/toastListener"
import { useLocalization } from "@/lib/localization-context"

export default function SignIn() {
    const { t } = useLocalization()
    const [state] = useActionState(signinAdmin, undefined)
    const [Studentstate, Studentaction, Studentpending] = useActionState(signinStudent, undefined)
    const router = useRouter()

    useToastListener(state, {functionName: "Admin Sign In", successMessage: "Admin signed in successfully", errorMessage: "Failed to sign in as admin"})
    useToastListener(Studentstate, {functionName: "Student Sign In", successMessage: "Student signed in successfully", errorMessage: "Failed to sign in as student"})

    React.useEffect(() => {
        if (state?.message === 'Signin successful' || Studentstate?.message === 'Signin successful') {
            router.replace('/platform/dashboard/student')
        }
    }, [state, Studentstate, router])
    
    return (
    <div className="w-full my-50">
    <form action={Studentaction} className="w-xs lg:w-lg mx-auto my-10 border-2 border-slate-800 p-6 rounded-lg shadow-lg bg-slate-800 text-slate-100">
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="student_code">{t('auth.student_code_label')}</FieldLabel>
        <Input
          id="student_code"
          name="student_code"
          type="text"
          className="bg-slate-100 text-slate-800"
          disabled={Studentpending}
          placeholder={t('auth.student_code_placeholder')}
        />
        {(Studentstate?.error?.student_code && <p className="text-red-500 text-sm">{Studentstate.error.student_code}</p>)}
      </Field>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline" className="text-slate-800 border-2 border-slate-800" disabled={Studentpending}>
          {t('auth.reset_button')}
        </Button>
        <Button type="submit" disabled={Studentpending}>
          {(Studentpending ? t('auth.submitting') : t('auth.submit_button'))}
        </Button>
      </Field>
    </FieldGroup>
    </form>
    </div>
    )
}