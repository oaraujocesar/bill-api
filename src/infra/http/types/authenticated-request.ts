import { User } from '@supabase/supabase-js'
import { Request } from 'express'

export type RequestWithUser = Request & {
	user?: UserAuthenticated
}

export type UserAuthenticated = Pick<User, 'id' | 'email'>
