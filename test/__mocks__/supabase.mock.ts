import { FunctionsClient } from '@supabase/functions-js'
import { PostgrestClient, PostgrestFilterBuilder } from '@supabase/postgrest-js'
import { StorageClient } from '@supabase/storage-js'
import { RealtimeChannel, RealtimeChannelOptions, RealtimeClient } from '@supabase/supabase-js'
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient'
import { SupabaseService } from 'src/shared/services/supabase.service'

export class SupabaseMock implements SupabaseService {
	protected supabaseUrl: string
	protected supabaseKey: string
	auth: SupabaseAuthClient
	realtime: RealtimeClient
	protected realtimeUrl: string
	protected authUrl: string
	protected storageUrl: string
	protected functionsUrl: string
	protected rest: PostgrestClient<any, 'public', any>
	protected storageKey: string
	protected fetch?: {
		(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
		(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>
	}
	protected changedAccessToken?: string
	protected accessToken?: () => Promise<string>
	protected headers: Record<string, string>
	get functions(): FunctionsClient {
		throw new Error('Method not implemented.')
	}
	get storage(): StorageClient {
		throw new Error('Method not implemented.')
	}
	from(
		relation: unknown,
	):
		| import('@supabase/postgrest-js').PostgrestQueryBuilder<
				any,
				Table,
				TableName,
				Table extends { Relationships: infer R } ? R : unknown
		  >
		| import('@supabase/postgrest-js').PostgrestQueryBuilder<
				any,
				View,
				ViewName,
				View extends { Relationships: infer R } ? R : unknown
		  > {
		throw new Error('Method not implemented.')
	}
	schema<DynamicSchema extends string>(schema: DynamicSchema): PostgrestClient<any, DynamicSchema, any> {
		throw new Error('Method not implemented.')
	}
	rpc<FnName extends string, Fn>(
		fn: FnName,
		args?: Fn['Args'],
		options?: { head?: boolean; get?: boolean; count?: 'exact' | 'planned' | 'estimated' },
	): PostgrestFilterBuilder<
		any,
		Fn['Returns'] extends any[]
			? Fn['Returns'][number] extends Record<string, unknown>
				? Fn['Returns'][number]
				: never
			: never,
		Fn['Returns'],
		FnName,
		null
	> {
		throw new Error('Method not implemented.')
	}
	channel(name: string, opts?: RealtimeChannelOptions): RealtimeChannel {
		throw new Error('Method not implemented.')
	}
	getChannels(): RealtimeChannel[] {
		throw new Error('Method not implemented.')
	}
	removeChannel(channel: RealtimeChannel): Promise<'ok' | 'timed out' | 'error'> {
		throw new Error('Method not implemented.')
	}
	removeAllChannels(): Promise<('ok' | 'timed out' | 'error')[]> {
		throw new Error('Method not implemented.')
	}
}
