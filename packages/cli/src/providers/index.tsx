import { DialogProvider } from './dialog'
import { KeyboardProvider } from './keyboard'
import { ToastProvider } from './toast'
import React from 'react'

const providers = [KeyboardProvider, DialogProvider, ToastProvider]

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>
    }, children)
}
