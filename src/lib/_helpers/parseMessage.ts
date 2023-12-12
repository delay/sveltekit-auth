export default async function parseMessage(message: unknown): Promise<object> {
	let messageObj = {};
	try {
		if (message) {
			if (typeof message === 'string') {
				messageObj = { message: message };
			} else {
				messageObj = message;
			}
		}
	} catch (error) {
		console.log('error: ', error);
	}
	return messageObj;
}
