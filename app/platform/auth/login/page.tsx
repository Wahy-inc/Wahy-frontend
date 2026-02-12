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
import { useAuth } from "@/lib/auth-context"

export default function SignIn() {
    const { isAdmin } = useAuth()
    const [state, action, pending] = useActionState(signinAdmin, undefined)
    const [Studentstate, Studentaction, Studentpending] = useActionState(signinStudent, undefined)
    const router = useRouter()

    React.useEffect(() => {
        if ((isAdmin ? state?.message : Studentstate?.message) === 'Signin successful') {
            router.replace('/platform/dashboard')
        }
    }, [state, Studentstate, router, isAdmin])
    
    return (
    <div className="w-full my-50">
    <form action={isAdmin ? action : Studentaction} className="w-xs lg:w-lg mx-auto my-10 border-2 border-slate-800 p-6 rounded-lg shadow-lg bg-slate-800 text-slate-100">
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          className="bg-slate-100 text-slate-800"
          disabled={isAdmin ? pending : Studentpending}
        />
        {isAdmin ? (state?.error?.email && <p className="text-red-500 text-sm">{state.error.email}</p>) : (Studentstate?.error?.email && <p className="text-red-500 text-sm">{Studentstate.error.email}</p>)}
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          className="bg-slate-100 text-slate-800"
          disabled={isAdmin ? pending : Studentpending}
        />
        {isAdmin ? (state?.error?.password && <p className="text-red-500 text-sm">{state.error.password}</p>) : (Studentstate?.error?.password && <p className="text-red-500 text-sm">{Studentstate.error.password}</p>)}
      </Field>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline" className="text-slate-800 border-2 border-slate-800" disabled={isAdmin ? pending : Studentpending}>
          Reset
        </Button>
        <Button type="submit" disabled={isAdmin ? pending : Studentpending}>
          {isAdmin ? (pending ? "Submitting..." : "Submit") : (Studentpending ? "Submitting..." : "Submit")}
        </Button>
      </Field>
    </FieldGroup>
    </form>
    </div>
    )
}