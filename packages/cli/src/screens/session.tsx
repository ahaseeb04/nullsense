import z from 'zod'
import prettyMs from 'pretty-ms'
import { useToast } from '../providers/toast'
import { apiClient } from '../lib/api-client'
import { useEffect, useMemo, useState } from 'react'
import type { InferResponseType } from 'hono/client'
import { getErrorMessage } from '../lib/http-errors'
import { SessionShell } from '../components/session-shell'
import { useLocation, useNavigate, useParams } from 'react-router'
import { BotMessage, ErrorMessage, UserMessage } from '../components/messages'
import { useChat, type Message, type ClientMessagePart } from '../hooks/use-chat'
import { DEFAULT_CHAT_MODEL_ID, type SupportedChatModelId } from '@nullsense/shared'
import { MessageStatus } from '@nullsense/db/enums'
import { useKeyboardLayer } from '../providers/keyboard'
import { useKeyboard } from '@opentui/react'

type SessionData = InferResponseType<(typeof apiClient.sessions)[':id']['$get'], 200>

const sessionLocationSchema = z.object({
    session: z.custom<SessionData>((val) => val !== null && typeof val === 'object' && 'id' in val),
})

function mapDbMessages(dbMessages: SessionData['messages']): Message[] {
    return dbMessages.map((m): Message => {
        if (m.role === 'ERROR') {
            return { id: m.id, role: 'error', content: m.content }
        }

        if (m.role === 'USER') {
            return {
                id: m.id,
                role: 'user',
                content: m.content,
                mode: m.mode,
                model: m.model as SupportedChatModelId,
            }
        }

        return {
            id: m.id,
            role: 'assistant',
            content: m.content,
            mode: m.mode,
            model: m.model as SupportedChatModelId,
            parts: [{ type: 'text', text: m.content }],
            ...(m.duration !== null ? { duration: prettyMs(m.duration * 1000) } : {}),
            interrupted: m.status === MessageStatus.INTERRUPTED,
        }
    })
}

function ChatMessage({ message }: { message: Message }) {
    if (message.role === 'user') {
        return <UserMessage message={message.content} />
    }

    if (message.role === 'error') {
        return <ErrorMessage message={message.content} />
    }

    return (
        <BotMessage
            parts={message.parts}
            model={message.model}
            mode={message.mode}
            duration={message.duration}
            streaming={false}
            interrupted={message.interrupted}
        />
    )
}

function SessionChat({ session }: { session: SessionData }) {
    const { isTopLayer } = useKeyboardLayer()
    const [initialMessages] = useState(() => mapDbMessages(session.messages))
    const { messages, streaming, submit, abort, interrupt } = useChat(session.id, initialMessages)

    useEffect(() => {
        return () => abort()
    }, [abort])

    useKeyboard((key) => {
        if (key.name === 'escape' && isTopLayer('base') && streaming.status === 'streaming') {
            key.preventDefault()
            interrupt()
        }
    })

    return (
        <SessionShell
            onSubmit={(text) =>
                submit({ userText: text, mode: 'BUILD', model: DEFAULT_CHAT_MODEL_ID })
            }
            loading={streaming.status === 'streaming'}
            interruptible={streaming.status === 'streaming'}
        >
            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
            ))}

            {streaming.status === 'streaming' && streaming.parts.length > 0 && (
                <BotMessage
                    parts={streaming.parts}
                    model={streaming.model}
                    mode={streaming.mode}
                    streaming
                />
            )}
        </SessionShell>
    )
}

export function Session() {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const toast = useToast()

    const prefetched = useMemo(() => {
        const parsed = sessionLocationSchema.safeParse(location.state)
        return parsed.success ? parsed.data.session : null
    }, [location.state])

    const [session, setSession] = useState<SessionData | null>(prefetched)

    useEffect(() => {
        if (prefetched) return

        setSession(null)

        if (!id) return

        let ignore = false

        const fetchSession = async () => {
            try {
                const res = await apiClient.sessions[':id'].$get({
                    param: { id },
                })

                if (ignore) return

                if (!res.ok) throw new Error(await getErrorMessage(res))

                setSession(await res.json())
            } catch (error) {
                if (ignore) return

                toast.show({
                    message: error instanceof Error ? error.message : 'Failed to load session',
                })

                navigate('/', { replace: true })
            }
        }

        fetchSession()

        return () => {
            ignore = true
        }
    }, [id, prefetched, toast, navigate])

    if (!session) return <SessionShell onSubmit={() => {}} disabled loading />

    return <SessionChat key={session.id} session={session} />
}
