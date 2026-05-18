'use client'

import React, { useActionState } from "react"
import { useRouter } from "next/navigation"
import { signinAdmin } from "../../actions/auth"
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
    const [state, action, pending] = useActionState(signinAdmin, undefined)
    const router = useRouter()

    useToastListener(state, {functionName: "Admin Sign In", successMessage: "Admin signed in successfully", errorMessage: "Failed to sign in as admin"})

    React.useEffect(() => {
        if (state?.message === 'Signin successful') {
            router.replace('/platform/dashboard/admin')
            localStorage.setItem('students', JSON.stringify([]))
            localStorage.setItem('schedules', JSON.stringify([]))
        }
    }, [state, router])
    
    return (
    <div className="w-full my-50">
    <form action={action} className="w-xs lg:w-lg mx-auto my-10 border-2 border-slate-800 p-6 rounded-lg shadow-lg bg-slate-800 text-slate-100">
    <FieldGroup>
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
        {(state?.error?.email && <p className="text-red-500 text-sm">{state.error.email}</p>)}
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
        {(state?.error?.password && <p className="text-red-500 text-sm">{state.error.password}</p>)}
      </Field>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline" className="text-slate-800 border-2 border-slate-800" disabled={pending}>
          {t('auth.reset_button')}
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? t('auth.submitting') : t('auth.submit_button')}
        </Button>
      </Field>
    </FieldGroup>
    </form>
    </div>
    )
}