import { FastifyInstance } from 'fastify';
import 'dotenv/config';
import { prisma } from '../db/db';
import { sendTelegramNotification } from '../notifications/telegram-notifier';
import { sendEmailNotification } from '../notifications/email-notifier';

interface IQueryString {
	key: string;
	source?: string;
	notificationType: 'all' | 'email' | 'telegram' | 'none';
}

interface IReply {
	200: { success: boolean; message: string };
	'4xx': { error: string };
	'5xx': { error: string };
}

export async function sensorRoutes(fastify: FastifyInstance) {
	fastify.post<{ Querystring: IQueryString; Reply: IReply }>('/', async (request, reply) => {
		const { key = '', source = 'ESP32', notificationType = 'telegram' } = request.query;

		if (key !== process.env.API_KEY) {
			return reply.code(401).send({ error: 'You should provide a valid api key' });
		}

		try {
			// Register the sensor reading
			await prisma.sensorReading.create({ data: { source } });

			// Send notifications (telegram)
			if (notificationType === 'all' || notificationType === 'telegram') {
				const result = await sendTelegramNotification({
					token: process.env.TELEGRAM_BOT_TOKEN ?? '',
					chatId: process.env.TELEGRAM_CHAT_ID ?? '',
					message: process.env.TELEGRAM_NOTIFICATION_MESSAGE ?? '*Sensor reading* %0ATime time to empty the can',
				});
				console.log(result);
			}

			// Send notifications (email)
			if (notificationType === 'all' || notificationType === 'email') {
				await sendEmailNotification({
					key: process.env.RESEND_API_KEY ?? '',
					from: process.env.EMAIL_NOTIFIER_FROM ?? '',
					to: process.env.EMAIL_NOTIFIER_TO ?? '',
					subject: process.env.EMAIL_NOTIFIER_SUBJECT ?? 'Water sensor reading',
					html:
						process.env.EMAIL_NOTIFIER_HTML ??
						"<h1>Water level is high</h1><p>It's time to empty the can</p><hr/><p>Sent by water ESP32 water sensor</p>",
				});
			}

			reply.code(200).send({ success: true, message: 'Sensor reading registered' });
		} catch (error) {
			console.log(error);
			reply.code(500).send({ error: 'Unexpected error while registering the sensor reading' });
		}
	});
}
