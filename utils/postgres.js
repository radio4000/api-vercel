// Load the environment variables required for postgres db connection
import dotenv from 'dotenv'
const config = dotenv.config({path: './.env.local'})
if (config.error) {
	throw new Error('Missing environment variables')
}

// Connect to Postgres
import pg from 'pg'
const pool = new pg.Pool()

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err)
	process.exit(-1)
})

const postgres = {
	pool,
	query: (text, params) => {
		return pool.query(text, params)
	},
}

export default postgres