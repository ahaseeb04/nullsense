import { createCliRenderer } from '@opentui/core'
import { createRoot } from '@opentui/react'
import { Header } from './components/header'
import { InputBar } from './components/input-bar'
import { Providers } from './providers'

function App() {
    return (
        <Providers>
            <box
                alignItems="center"
                justifyContent="center"
                backgroundColor="#0d0d12"
                width="100%"
                height="100%"
                gap={2}
            >
                <Header />

                <box width="100%" maxWidth={80}>
                    <InputBar onSubmit={() => {}} />
                </box>
            </box>
        </Providers>
    )
}

const renderer = await createCliRenderer({
    targetFps: 120,
    exitOnCtrlC: false,
})

createRoot(renderer).render(<App />)
