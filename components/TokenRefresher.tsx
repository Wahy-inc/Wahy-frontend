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
                if (expireDate <= now) {
                    refreshAccessToken()
                }
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    return null
}
