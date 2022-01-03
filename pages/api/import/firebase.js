import {requireSupabaseSession} from 'lib/middlewares/auth/supabase'
import {requireFirebaseSession} from 'lib/middlewares/auth/firebase'
import {getUserChannel} from 'lib/providers/firebase-admin'

import {migrate} from './migration-test'
// ok this is working and getting users
// could commit from here?

async function handler(req, res) {
	if (req.method === 'OPTIONS') {
		res.status(200) //.end()
		return
	}
	if (req.method !== 'POST') {
		return res.status(400).json({
			message: 'Only POST requests allowed',
		})
	}

	const {userSupabase, userFirebase} = req

	console.log({userSupabase, userFirebase})

	// Shouldn't be needed because of the middleware, but lets keep for now?
	if (!userSupabase || !userFirebase) {
		return res.status(500).send({
			message: 'Missing authentication tokens required for migration',
		})
	}

	let migrationRes = null
	try {
		migrationRes = await migrate({
			userFirebase,
			userSupabase,
		})
	} catch (error) {
		console.log('error migrating', error)
	}
	console.log('res', migrationRes)
}

// export default handler
export default requireSupabaseSession(requireFirebaseSession(handler))
