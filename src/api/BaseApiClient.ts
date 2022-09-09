import axios from 'axios';

const API_URL = 'https://api.modweaver.org';

export async function get<T>(url: string): Promise<T> {
	const { data, status, statusText } = await axios.get<T>(`${API_URL}${url}`);

	if (status === 200) return data;

	return Promise.reject(statusText);
}
