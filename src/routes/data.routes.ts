import 'dotenv/config';
import { FastifyInstance } from 'fastify';
import { prisma } from '../db/db';
import { SensorReading } from '@prisma/client';

interface IQueryString {
	key: string;
	page?: number;
	itemsPerPage?: number;
}

interface IReply {
	200: { success: boolean; readings: SensorReading[]; page: number; itemsPerPage: number };
	'4xx': { error: string };
	'5xx': { error: string };
}

export async function dataRoutes(fastify: FastifyInstance) {
	fastify.get<{ Querystring: IQueryString; Reply: IReply }>('/', async (request, reply) => {
		const { key, page: selectedPage = 1, itemsPerPage: selectedItems = 100 } = request.query;
		const page = +selectedPage - 1;
		const itemsPerPage = +selectedItems;

		if (key !== process.env.API_KEY) {
			return reply.code(401).send({ error: 'You should provide a valid api key' });
		}

		if (isNaN(page) || isNaN(itemsPerPage)) {
			return reply.code(400).send({ error: 'page and itemsPerPage must be a number' });
		}

		try {
			const readings = await prisma.sensorReading.findMany({
				orderBy: { createdAt: 'desc' },
				take: itemsPerPage,
				skip: page * itemsPerPage,
			});
			reply.code(200).send({ success: true, page: page + 1, itemsPerPage, readings });
		} catch (error) {
			console.log(error);
			reply
				.code(500)
				.send({ error: 'Unexpected error ocurred while retrieving the sensor readings from the database' });
		}
	});
}
