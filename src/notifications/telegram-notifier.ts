interface NotifierParams {
	token: string;
	chatId: string;
	message: string;
}

export const sendTelegramNotification = async ({ token, chatId, message }: NotifierParams) => {
	await fetch(
		`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=MarkdownV2 `
	)
		.then(r => r.json())
		.catch(e => console.log(e));
};
