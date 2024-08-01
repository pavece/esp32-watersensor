'use strict';

import * as dotenv from 'dotenv';
dotenv.config();

import Fastify, { FastifyRequest, FastifyReply } from 'fastify';

import { sensorRoutes } from '../src/routes/sensor.routes';
import { dataRoutes } from '../src/routes/data.routes';

const app = Fastify();

app.register(sensorRoutes, { prefix: '/sensor' });
app.register(dataRoutes, { prefix: '/readings' });

export default async (req: FastifyRequest, res: FastifyReply) => {
	await app.ready();
	app.server.emit('request', req, res);
};
