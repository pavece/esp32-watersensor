import Fastify from 'fastify';
import { sensorRoutes } from './routes/sensor.routes';
import { dataRoutes } from './routes/data.routes';

const fastify = Fastify({
	logger: true,
});

fastify.register(sensorRoutes, { prefix: '/sensor' });
fastify.register(dataRoutes, { prefix: '/readings' });

fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
