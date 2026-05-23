import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Header } from '../components/header'
import { InputBar } from '../components/input-bar'
import { useTheme } from '../providers/theme'

export function Home() {
    const navigate = useNavigate()
    const { colors } = useTheme()

    const handleSubmit = useCallback(
        (text: string) => {
            navigate('/sessions/new', { state: { message: text } })
        },
        [navigate],
    )

    return (
        <box
            alignItems="center"
            justifyContent="center"
            flexGrow={1}
            gap={2}
            position="relative"
            width="100%"
            height="100%"
        >
            <Header />

            <box width="100%" maxWidth={80}>
                <InputBar onSubmit={handleSubmit} />
            </box>
        </box>
    )
}
