import { Resend } from 'resend';

interface EmailNotifierArgs {
	key: string;
	from: string;
	to: string;
	subject: string;
	html: string;
}

export const sendEmailNotification = ({ key, from, to, subject, html }: EmailNotifierArgs) => {
	try {
		const resend = new Resend(key);
		resend.emails.send({
			from,
			to,
			subject,
			html,
		});
	} catch (error) {
		console.log(error);
	}
};
