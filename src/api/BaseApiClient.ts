import axios from 'axios';

const API_URL = 'https://api.modweaver.org';

export async function get<T>(url: string): Promise<T> {
	const response = await axios.get<T>(`${API_URL}${url}`);
    
	if (response.status === 200)
		return response.data;

	return Promise.reject(response.data);
}
