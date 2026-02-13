'use client'

import { useEffect } from "react"
import { toast } from "sonner"

type ActionState = {
    message?: string,
    error?: Record<string, string[]> | string,
} | undefined

interface ToastConfig {
    functionName?: string,
    successMessage?: string,
    errorMessage?: string,
    showErrors?: boolean,
}

export function useToastListener(actionState: ActionState, config: ToastConfig = {}) {
    const { functionName, successMessage, errorMessage, showErrors = true } = config
    useEffect(() => {
        if (!actionState) return

        if (actionState.error && Object.keys(actionState.error).length > 0) {
            if (showErrors) {
                toast.error(errorMessage || "An error occurred", {
                    description: Array.isArray(actionState.error) ? actionState.error.join('\n') : actionState.error.toString(),
                })
            }
            return
        }

        if (actionState.message == 'success' || actionState.message == 'Signin successful' || actionState.message == 'Signup successful') {
            toast.success(successMessage || `${functionName || 'Action'} completed successfully`)
            return
        }

        if (actionState.message && actionState.message !== 'fail') {
            const isError = actionState.message.toLowerCase().includes('error') || actionState.message.toLowerCase().includes('fail')

            if (isError) {
                toast.error(errorMessage || `${functionName || 'Action'} failed`, {
                    description: actionState.message
                })
            } else {
                toast.success(successMessage || `${functionName || 'Action'} completed successfully`, {
                    description: actionState.message
                })
            }
        }
    }, [actionState, functionName, successMessage, errorMessage, showErrors])
}