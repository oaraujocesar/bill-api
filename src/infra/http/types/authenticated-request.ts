import { User } from '@supabase/supabase-js'
import { Request } from 'express'

export type RequestWithUser = Request & {
	user?: Pick<User, 'id' | 'email'>
}
