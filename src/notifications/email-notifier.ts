interface EmailNotifierArgs {
	key: string;
	from: string;
	to: string;
	subject: string;
	html: string;
}

export const sendEmailNotification = async ({ key, from, to, subject, html }: EmailNotifierArgs) => {
	try {
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${key}`,
			},
			body: JSON.stringify({
				from,
				to: to.split(','),
				subject: subject,
				html: html,
			}),
		});

		if (!res.ok) {
			console.log('RESEND ERROR', res);
		}
	} catch (error) {
		console.log(error);
	}
};
