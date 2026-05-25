import path from 'path'
import dotenv from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

dotenv.config({
    path: path.resolve(import.meta.dirname, '../../../.env'),
})

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) throw new Error('DATABASE_URL is required but was not provided')

const adapter = new PrismaPg({ connectionString: databaseUrl })

export const db = new PrismaClient({ adapter })
