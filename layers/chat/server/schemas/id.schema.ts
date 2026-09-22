import { z } from 'zod'

export const entityIdSchema = z.uuid('ID must be a valid UUID')
