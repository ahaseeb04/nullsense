import { TextAttributes } from '@opentui/core'
import { InputBar } from './input-bar'
import { Spinner } from './spinner'

type Props = {
    children?: React.ReactNode
    onSubmit: (text: string) => void
    disabled?: boolean
    loading?: boolean
}

export function SessionShell({ children, onSubmit, disabled = false, loading = false }: Props) {
    return (
        <box
            flexDirection="column"
            flexGrow={1}
            width="100%"
            height="100%"
            paddingX={2}
            paddingY={1}
            gap={1}
        >
            <scrollbox flexGrow={1} width="100%" stickyScroll stickyStart="bottom">
                <box gap={1}>{children}</box>
            </scrollbox>
            <box flexShrink={0}>
                <InputBar onSubmit={onSubmit} disabled={disabled} />
            </box>
            <box
                flexShrink={0}
                flexDirection="row"
                justifyContent="space-between"
                width="100%"
                height={1}
                gap={2}
                paddingLeft={1}
            >
                <box flexDirection="row" alignItems="center" gap={2}>
                    {loading ? <Spinner /> : null}
                </box>
                <box flexDirection="row" gap={1} flexShrink={0} marginLeft="auto">
                    <text>tab</text>
                    <text attributes={TextAttributes.DIM}>agents</text>
                </box>
            </box>
        </box>
    )
}
