export default async function parseTrack(track: unknown): Promise<object> {
	let trackObj = {};
	try {
		if (track) {
			if (typeof track === 'string') {
				trackObj = { track: track };
			} else {
				trackObj = track;
			}
		}
	} catch (error) {
		console.log('error: ', error);
	}
	return trackObj;
}
