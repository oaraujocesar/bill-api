import { User } from '@supabase/supabase-js'
import { FastifyRequest } from 'fastify'

export type RequestWithUser = FastifyRequest & {
	user?: UserAuthenticated
}

export type UserAuthenticated = Pick<User, 'id' | 'email'>
