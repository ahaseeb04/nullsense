import { useKeyboard, useRenderer } from '@opentui/react'
import { createContext, useCallback, useContext, useRef, useState } from 'react'

type Responder = () => boolean

type KeyboardContextValue = {
    push: (id: string, responder?: Responder) => void
    pop: (id: string) => void
    isTopLayer: (id: string) => boolean
    setResponder: (id: string, responder: Responder | null) => void
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null)

export function KeyboardProvider({ children }: { children: React.ReactNode }) {
    const [stack, setStack] = useState<string[]>(['base'])
    const stackRef = useRef(stack)
    stackRef.current = stack

    const responders = useRef<Map<string, Responder>>(new Map())
    const renderer = useRenderer()

    const push = useCallback((id: string, responder?: Responder) => {
        if (responder) {
            responders.current.set(id, responder)
        }

        setStack((prev) => {
            if (prev.includes(id)) {
                return prev
            }

            return [...prev, id]
        })
    }, [])

    const pop = useCallback((id: string) => {
        responders.current.delete(id)
        setStack((prev) => prev.filter((layer) => layer !== id))
    }, [])

    const isTopLayer = useCallback(
        (id: string) => {
            return stack.length === 0 || stack[stack.length - 1] === id
        },
        [stack],
    )

    const setResponder = useCallback((id: string, responder: Responder | null) => {
        if (responder) {
            responders.current.set(id, responder)
        } else {
            responders.current.delete(id)
        }
    }, [])

    useKeyboard((key) => {
        if (!key.ctrl || key.name !== 'c') return

        const curr = stackRef.current

        for (let i = curr.length - 1; i >= 0; i--) {
            const responder = responders.current.get(curr[i]!)

            if (responder && responder()) return
        }

        renderer.destroy()
    })

    return (
        <KeyboardContext.Provider value={{ push, pop, isTopLayer, setResponder }}>
            {children}
        </KeyboardContext.Provider>
    )
}

export function useKeyboardLayer() {
    const context = useContext(KeyboardContext)

    if (!context) throw new Error('useKeyboardLayer must be used within a KeyboardProvider')

    return context
}
