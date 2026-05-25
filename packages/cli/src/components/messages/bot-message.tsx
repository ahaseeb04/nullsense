import { Mode } from '@nullsense/db/enums'
import { useTheme } from '../../providers/theme'
import type { ClientMessagePart } from '../../hooks/use-chat'
import { TextAttributes } from '@opentui/core'

type Props = {
    parts: ClientMessagePart[]
    model: string
    mode: Mode
    duration?: string
    streaming?: boolean
    interrupted?: boolean
}

export function BotMessage({
    parts,
    model,
    mode,
    duration,
    streaming = false,
    interrupted = false,
}: Props) {
    const { colors } = useTheme()
    const text = parts
        .filter((p) => p.type === 'text')
        .map((p) => p.text)
        .join('')

    return (
        <box width="100%" alignItems="center">
            <box width="100%" paddingY={1}>
                <box width="100%" paddingX={3}>
                    <text>{text}</text>
                </box>
            </box>

            <box paddingX={3} paddingBottom={1} gap={1} width="100%">
                <box flexDirection="row" gap={2}>
                    <text
                        attributes={interrupted ? TextAttributes.DIM : 0}
                        fg={
                            interrupted
                                ? undefined
                                : mode === Mode.PLAN
                                  ? colors.planMode
                                  : colors.primary
                        }
                    >
                        ◉
                    </text>

                    <box flexDirection="row" gap={1}>
                        <text attributes={interrupted ? TextAttributes.DIM : 0}>
                            {mode === Mode.PLAN ? 'Plan' : 'Build'}
                        </text>
                        <text attributes={TextAttributes.DIM} fg={colors.dimSeparator}>
                            &#8250;
                        </text>
                        <text attributes={TextAttributes.DIM}>{model}</text>
                        {(duration || interrupted) && (
                            <>
                                <text attributes={TextAttributes.DIM} fg={colors.dimSeparator}>
                                    &#8250;
                                </text>
                                <text attributes={TextAttributes.DIM}>
                                    {interrupted ? 'interrupted' : duration}
                                </text>
                            </>
                        )}
                    </box>
                </box>
            </box>
        </box>
    )
}
