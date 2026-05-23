import type { RefObject } from 'react'
import { TextAttributes, type ScrollBoxRenderable } from '@opentui/core'
import { COMMANDS } from './commands'
import { getFilteredCommands } from './filter-commands'

const MAX_VISIBLE_ITEMS = 8

const COMMAND_COL_WIDTH = Math.max(...COMMANDS.map((command) => command.name.length)) + 4

type CommandMenuProps = {
    query: string
    selectedIndex: number
    scrollRef: RefObject<ScrollBoxRenderable | null>
    onSelect: (index: number) => void
    onExecute: (index: number) => void
}

export function CommandMenu({
    query,
    selectedIndex,
    scrollRef,
    onSelect,
    onExecute,
}: CommandMenuProps) {
    const filtered = getFilteredCommands(query)
    const height = Math.min(filtered.length, MAX_VISIBLE_ITEMS)

    if (filtered.length === 0) {
        return (
            <box paddingX={1}>
                <text attributes={TextAttributes.DIM}>No matching commands</text>
            </box>
        )
    }

    return (
        <scrollbox ref={scrollRef} height={height}>
            {filtered.map((command, i) => {
                const isSelected = i === selectedIndex

                return (
                    <box
                        key={command.value}
                        flexDirection="row"
                        paddingX={1}
                        height={1}
                        overflow="hidden"
                        backgroundColor={isSelected ? '#89b4fa' : undefined}
                        onMouseMove={() => onSelect(i)}
                        onMouseDown={() => onExecute(i)}
                    >
                        <box width={COMMAND_COL_WIDTH} flexShrink={0}>
                            <text selectable={false} fg={isSelected ? 'black' : 'white'}>
                                /{command.name}
                            </text>
                        </box>
                        <box flexGrow={1} flexShrink={1} overflow="hidden">
                            <text selectable={false} fg={isSelected ? 'black' : 'gray'}>
                                {command.description}
                            </text>
                        </box>
                    </box>
                )
            })}
        </scrollbox>
    )
}
