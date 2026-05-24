import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

import sessions from './routes/sessions'
import { sentry } from '@sentry/hono/bun'
import * as Sentry from '@sentry/hono/bun'

const app = new Hono()

app.use(
    sentry(app, {
        dsn: 'https://7a891e1d3a69d7ea624c65f93a8e555d@o4511442846351360.ingest.us.sentry.io/4511442854871040',
        tracesSampleRate: 1.0,
        enableLogs: true,
        sendDefaultPii: true,
    }),
)

app.onError((error, c) => {
    if (error instanceof HTTPException) {
        Sentry.logger.warn('Handled HTTP error', {
            status: error.status,
            message: error.message || 'Request failed',
            path: c.req.path,
            method: c.req.method,
        })

        return c.json({ error: error.message || 'Request failed' }, error.status)
    }

    Sentry.logger.error('Unhandled server error', {
        path: c.req.path,
        method: c.req.method,
        message: error instanceof Error ? error.message : 'Unknown error',
    })

    return c.json({ error: 'Internal Server Error' }, 500)
})

const routes = app.route('/sessions', sessions)

export type AppType = typeof routes

export default { port: 3000, fetch: app.fetch, idleTimeout: 255 }
