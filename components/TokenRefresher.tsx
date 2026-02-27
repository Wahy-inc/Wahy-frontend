'use client'

import { useEffect } from 'react'
import { refreshAccessToken } from '@/app/platform/actions/auth'

export function TokenRefresher() {
    useEffect(() => {
        const interval = setInterval(() => {
            const expire = localStorage.getItem('expire')
            if (expire) {
                const expireDate = new Date(expire)
                const now = new Date()
                // Refresh if token will expire in the next 5 minutes
                const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000)
                if (expireDate <= fiveMinutesFromNow && expireDate > now) {
                    refreshAccessToken()
                } else if (expireDate <= now) {
                    // If already expired, clear tokens
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('expire')
                }
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    return null
}
