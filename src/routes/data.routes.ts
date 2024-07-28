import { FastifyInstance } from 'fastify';
import 'dotenv/config';
import { prisma } from '../db/db';
import { SensorReading } from '@prisma/client';

interface IQueryString {
	key: string;
	limit?: number;
}

interface IReply {
	200: { success: boolean; readings: SensorReading[]; limit: number };
	'4xx': { error: string };
	'5xx': { error: string };
}

export async function dataRoutes(fastify: FastifyInstance) {
	fastify.get<{ Querystring: IQueryString; Reply: IReply }>('/', async (request, reply) => {
		const { key, limit = 100 } = request.query;

		if (key !== process.env.API_KEY) {
			reply.code(401).send({ error: 'You should provide a valid api key' });
		}

		if (Number(limit) < 0) {
			reply.code(400).send({ error: 'Limit must be a positive number' });
		}

		try {
			const readings = await prisma.sensorReading.findMany({ orderBy: { createdAt: 'desc' }, take: Number(limit) });
			reply.code(200).send({ success: true, limit, readings });
		} catch (error) {
			console.log(error);
			reply
				.code(500)
				.send({ error: 'Unexpected error ocurred while retrieving the sensor readings from the database' });
		}
	});
}
