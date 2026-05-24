import { z } from 'zod'
import { useTheme } from '../providers/theme'
import { useToast } from '../providers/toast'
import { apiClient } from '../lib/api-client'
import { useEffect, useMemo, useRef } from 'react'
import { UserMessage } from '../components/messages'
import { getErrorMessage } from '../lib/http-errors'
import { useLocation, useNavigate } from 'react-router'
import { DEFAULT_CHAT_MODEL_ID } from '@nullsense/shared'
import { SessionShell } from '../components/session-shell'

const newSessionStateSchema = z.object({
    message: z.string(),
})

export function NewSession() {
    const toast = useToast()
    const { colors } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const hasStartedRef = useRef(false)

    const state = useMemo(() => {
        const parsed = newSessionStateSchema.safeParse(location.state)
        return parsed.success ? parsed.data : null
    }, [location.state])

    useEffect(() => {
        if (!state) {
            navigate('/', { replace: true })
        }
    }, [state, navigate])

    useEffect(() => {
        if (!state || hasStartedRef.current) return

        hasStartedRef.current = true

        let ignore = false

        const createSession = async () => {
            try {
                const res = await apiClient.sessions.$post({
                    json: {
                        title: state.message.slice(0, 100),
                        cwd: process.cwd(),
                        initialMessage: {
                            role: 'USER',
                            content: state.message,
                            mode: 'BUILD',
                            model: DEFAULT_CHAT_MODEL_ID,
                        },
                    },
                })

                if (ignore) return

                if (!res.ok) {
                    throw new Error(await getErrorMessage(res))
                }

                const session = await res.json()

                navigate(`/sessions/${session.id}`, { replace: true, state: { session } })
            } catch (error) {
                if (ignore) return

                toast.show({
                    message: error instanceof Error ? error.message : 'Failed to create session',
                    variant: 'error',
                })

                navigate('/', { replace: true })
            }
        }

        createSession()

        return () => {
            ignore = true
        }
    }, [state, navigate, toast])

    if (!state) return null

    return (
        <SessionShell onSubmit={() => {}} disabled loading>
            <UserMessage message={state.message} />
        </SessionShell>
    )
}
