import Fastify from 'fastify';
import { sensorRoutes } from './routes/sensor.routes';

const fastify = Fastify({
	logger: true,
});

fastify.register(sensorRoutes, { prefix: '/sensor' });

fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
