import { API_BASE_URL } from "./helpers/constants";

export const apiEndPoints = Object.freeze({
	messages: {
		getAllMessages: () => "/messages",
		getMessageById: (messageId: string) => `/messages/${messageId}`,
	},
});

// instead of axios we are using here fetch api, because we don't have complex api calls.
export const apiGetRequest = async (urlPath: string, data?: any) => {
	let url = `${API_BASE_URL}${urlPath}`;
	if (data) url += "?" + new URLSearchParams(data).toString();
	console.info(url);
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const responseJSON = await response.json();
	if (response.ok) return { data: responseJSON };
	else throw { data: responseJSON };
};
