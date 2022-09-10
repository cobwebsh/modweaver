import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error('The API URL was not specified. Check your env vars.');

export async function get<T>(url: string): Promise<T> {
	const { data, status, statusText } = await axios.get<T>(`${API_URL}${url}`);

	if (status === 200) return data;

	return Promise.reject(statusText);
}
