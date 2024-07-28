import { FastifyInstance } from 'fastify';
import 'dotenv/config';
import { prisma } from '../db/db';

interface IQueryString {
	key: string;
	source?: string;
}

interface IReply {
	200: { success: boolean; message: string };
	'4xx': { error: string };
	'5xx': { error: string };
}

export async function sensorRoutes(fastify: FastifyInstance) {
	fastify.get<{ Querystring: IQueryString; Reply: IReply }>('/', async (request, reply) => {
		const { key = '', source = 'ESP32' } = request.query;

		if (key !== process.env.API_KEY) {
			reply.code(401).send({ error: 'You should provide a valid api key' });
		}

		try {
			// Register the sensor reading
			await prisma.sensorReading.create({ data: { source } });

			//TODO: Send notifications

			reply.code(200).send({ success: true, message: 'Sensor reading registered' });
		} catch (error) {
			console.log(error);
			reply.code(500).send({ error: 'Unexpected error while registering the sensor reading' });
		}
	});
}
