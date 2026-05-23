import type { Command } from './types'

export const COMMANDS: Command[] = [
    {
        name: 'new',
        description: 'Start a new conversation',
        value: '/new',
    },
    {
        name: 'agents',
        description: 'Switch agents',
        value: '/agent',
    },
    {
        name: 'models',
        description: 'Select AI model for generation',
        value: '/models',
    },
    {
        name: 'sessions',
        description: 'Browse past sessions',
        value: '/sessions',
    },
    {
        name: 'theme',
        description: 'Change color theme',
        value: '/theme',
    },
    {
        name: 'signin',
        description: 'Sign in with your browser',
        value: '/signin',
    },
    {
        name: 'signout',
        description: 'Sign out of your account',
        value: '/signout',
    },
    {
        name: 'upgrade',
        description: 'Buy more credits',
        value: '/upgrade',
    },
    {
        name: 'usage',
        description: 'Open billing portal in your browser',
        value: '/usage',
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
