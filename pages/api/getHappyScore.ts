// pages/api/getHappyScore.ts

import { pipeline } from '@xenova/transformers'
import type { NextApiRequest, NextApiResponse } from 'next'

let classifier: any = null

async function loadModel() {
	if (!classifier) {
		classifier = await pipeline(
			'sentiment-analysis',
			'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
		)
	}
	return classifier
}

async function getSentimentScore(text: string): Promise<number> {
	const classifier = await loadModel()
	const result = await classifier(text)
	const { label, score } = result[0]
	return label === 'POSITIVE' ? score : -score
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Only POST allowed' })
	}

	const { persona, post } = req.body

	if (!persona || !post) {
		return res.status(400).json({ error: 'Missing fields' })
	}

	const [pScore, postScore] = await Promise.all([
		getSentimentScore(persona),
		getSentimentScore(post),
	])

	console.log(pScore, postScore)

	const diff = Math.abs(pScore - postScore)
	const similarity = 1 - diff / 2
	const happyScore = Math.round(similarity * 100)

	res.status(200).json({ happyScore })
}
