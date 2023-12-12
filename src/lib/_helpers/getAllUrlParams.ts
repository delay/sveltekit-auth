export default async function getAllUrlParams(url: string): Promise<object> {
	let paramsObj = {};
	try {
		url = url?.slice(1); //remove leading ?
		if (!url) return {}; //if no params return
		paramsObj = await Object.fromEntries(await new URLSearchParams(url));
	} catch (error) {
		console.log('error: ', error);
	}
	return paramsObj;
}
