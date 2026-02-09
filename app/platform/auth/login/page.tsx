'use client'

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { signin } from "../../actions/auth"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function SignIn() {
    const [state, action, pending] = useActionState(signin, undefined)
    const router = useRouter()

    if (state?.message === 'Signin successful') {
        router.replace('/dashboard')
    }
    
    return (
    <div className="w-full my-50">
    <form action={action} className="w-xs lg:w-lg mx-auto my-10 border-2 border-slate-800 p-6 rounded-lg shadow-lg bg-slate-800 text-slate-100">
    <FieldGroup>
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
    </div>
    )
}