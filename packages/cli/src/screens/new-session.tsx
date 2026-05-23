import { useLocation, useNavigate } from 'react-router'
import { useTheme } from '../providers/theme'
import { useEffect } from 'react'
import { BotMessage, ErrorMessage, UserMessage } from '../components/messages'
import { SessionShell } from '../components/session-shell'

export function NewSession() {
    const navigate = useNavigate()
    const location = useLocation()
    const { colors } = useTheme()

    const state = location.state as { message?: string } | null

    useEffect(() => {
        if (!state?.message) {
            navigate('/', { replace: true })
        }
    }, [state, navigate])

    if (!state?.message) return null

    return (
        <SessionShell onSubmit={() => {}} disabled loading>
            <UserMessage message={state.message} />
            <BotMessage
                content="This response exists purely to show that messages can be rendered in sequence, which is a concept so fundamentally simple that it somehow still requires a dedicated test artifact to validate."
                model="opus-4-6"
            />
        </SessionShell>
    )
}
