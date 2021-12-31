import got from 'got'
import config from '../../utils/config'
import noEndpoint from '../../utils/no-endpoint'
import getOEmbed from '../../utils/get-oembed'

function getChannelBySlug(slug) {
	const url = `${config.databaseURL}/channels.json?orderBy="slug"&equalTo="${slug}"`
	return got(url, {
		timeout: 6000,
		retries: 1,
	})
}

export default function handler(req, res) {
	const slug = req.query.slug

	if (!slug) return noEndpoint(res)

	return getChannelBySlug(slug)
		.then((response) => {
			const channels = JSON.parse(response.body)
			const id = Object.keys(channels)[0]
			const channel = channels[id]

			if (!channel) return noEndpoint(res)

			channel.id = id
			const embedHtml = getOEmbed(channel)
			res.status(200).send(embedHtml)
		})
		.catch((err) => {
			res.status(500).send({
				message: `Could not fetch channel "${slug}"`,
				code: 500,
				internalError: err,
			})
		})
}