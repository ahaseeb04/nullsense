import z from 'zod'
import { Hono } from 'hono'
import { db } from '@nullsense/db'
import { zValidator } from '@hono/zod-validator'
import { findSupportedChatModel } from '@nullsense/shared'
import { Role, Mode, MessageStatus } from '@nullsense/db/enums'

const createSessionSchema = z.object({
    title: z.string(),
    cwd: z.string().optional(),
    initialMessage: z
        .object({
            role: z.enum(Role),
            content: z.string(),
            mode: z.enum(Mode),
            model: z.string().refine((id) => !!findSupportedChatModel(id), 'Unsupported Model'),
        })
        .optional(),
})

const createSessionValidator = zValidator('json', createSessionSchema, (res, c) => {
    if (!res.success) {
        return c.json({ error: 'Invalid Request Body' }, 400)
    }
})

const app = new Hono()
    .get('/', async (c) => {
        const sessions = await db.session.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                createdAt: true,
            },
        })

        return c.json(sessions)
    })
    .get('/:id', async (c) => {
        const id = c.req.param('id')

        const session = await db.session.findUnique({
            where: { id },
            include: {
                messages: { orderBy: { createdAt: 'asc' } },
            },
        })

        if (!session) return c.json({ error: 'Session not found' }, 404)

        return c.json(session)
    })
    .post('/', createSessionValidator, async (c) => {
        const { initialMessage, ...data } = c.req.valid('json')

        const session = await db.session.create({
            data: {
                ...data,
                userId: 'admin',
                ...(initialMessage && {
                    messages: {
                        create: {
                            ...initialMessage,
                            status: MessageStatus.COMPLETE,
                        },
                    },
                }),
            },
            include: { messages: true },
        })

        return c.json(session, 201)
    })

export default app
