import type { Command } from './types'

export const COMMANDS: Command[] = [
    {
        name: 'new',
        description: 'Start a new conversation',
        value: '/new',
        action: (ctx) => {
            ctx.toast.show({ message: 'Starting new conversation...' })
        },
    },
    {
        name: 'agents',
        description: 'Switch agents',
        value: '/agent',
        action: (ctx) => {
            ctx.toast.show({ message: 'Switching agents...' })
        },
    },
    {
        name: 'models',
        description: 'Select AI model for generation',
        value: '/models',
        action: (ctx) => {
            ctx.toast.show({ message: 'Selecting model...' })
        },
    },
    {
        name: 'sessions',
        description: 'Browse past sessions',
        value: '/sessions',
        action: (ctx) => {
            ctx.toast.show({ message: 'Loading sessions...' })
        },
    },
    {
        name: 'theme',
        description: 'Change color theme',
        value: '/theme',
        action: (ctx) => {
            ctx.dialog.open({
                title: 'Theme Selector',
                children: '',
            })
        },
    },
    {
        name: 'signin',
        description: 'Sign in with your browser',
        value: '/signin',
        action: (ctx) => {
            ctx.toast.show({ message: 'Opening browser to sign in...' })
        },
    },
    {
        name: 'signout',
        description: 'Sign out of your account',
        value: '/signout',
        action: (ctx) => {
            ctx.toast.show({ message: 'Signing out...' })
        },
    },
    {
        name: 'upgrade',
        description: 'Buy more credits',
        value: '/upgrade',
        action: (ctx) => {
            ctx.toast.show({ message: 'Opening credits checkout...' })
        },
    },
    {
        name: 'usage',
        description: 'Open billing portal in your browser',
        value: '/usage',
        action: (ctx) => {
            ctx.toast.show({ message: 'Opening billing portal...' })
        },
    },
    {
        name: 'exit',
        description: 'Exit the application',
        value: '/exit',
        action: (ctx) => {
            ctx.exit()
        },
    },
]
