'use client'

import { useActionState } from "react"
import { signup } from "../../actions/auth"

const FormField = ({ label, id, type, placeholder, error, disabled }: { label: string, id: string, type: string, placeholder: string, error?: string[] | undefined, disabled: boolean }) => (
    <div className="flex flex-col gap-1">
        <label htmlFor={id} className="font-medium text-sm">{label}</label>
        <input 
            id={id} 
            name={id} 
            type={type} 
            placeholder={placeholder}
            disabled={disabled}
            className="border rounded px-3 py-2 disabled:bg-gray-100"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
)

export default function SignUp() {
    const [state, action, pending] = useActionState(signup, undefined)
    
    return (
        <form action={action} className="w-xs lg:w-lg mx-auto my-10">
            <div className="border rounded-lg shadow-lg p-6 space-y-4">
                <FormField 
                    label="Email" 
                    id="email" 
                    type="email" 
                    placeholder="email"
                    error={state?.error?.email}
                    disabled={pending}
                />
                <FormField 
                    label="Password" 
                    id="password" 
                    type="password" 
                    placeholder="password"
                    error={state?.error?.password}
                    disabled={pending}
                />
                <button 
                    type="submit" 
                    disabled={pending}
                    className="w-full bg-[#22223b] text-white py-2 rounded disabled:bg-gray-400"
                >
                    {pending ? "Signing in..." : "Sign In"}
                </button>
            </div>
        </form>
    )
}