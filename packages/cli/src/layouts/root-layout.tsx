import { Outlet } from 'react-router'
import { Providers } from '../providers'
import { ThemedRoot } from './themed-root'

export function RootLayout() {
    return (
        <Providers>
            <ThemedRoot>
                <Outlet></Outlet>
            </ThemedRoot>
        </Providers>
    )
}
