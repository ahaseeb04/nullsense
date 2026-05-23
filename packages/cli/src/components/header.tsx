import { useTheme } from '../providers/theme'

export function Header() {
    const { colors } = useTheme()

    return (
        <box justifyContent="center" alignItems="center">
            <box flexDirection="row" justifyContent="center" gap={0.5} alignItems="center">
                <ascii-font font="tiny" text="null" color={colors.primary} />
                <ascii-font font="tiny" text="sense" color={colors.dimSeparator} />
            </box>
        </box>
    )
}
