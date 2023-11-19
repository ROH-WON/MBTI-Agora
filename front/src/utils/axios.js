import axios from 'axios';

const serverUrl = import.meta.env.VITE_SERVER_HOST;

import useUserStore from '../store/useUserStore';

const getToken = () => {
	return localStorage.getItem('accessToken') || null;
};

const instance = axios.create({
	baseURL: serverUrl,
	timeout: 15000,
});

instance.interceptors.request.use(
	(config) => {
		const accessToken = getToken();

		if (config.data instanceof FormData) {
			config.headers['Content-Type'] = 'multipart/form-data';
		} else if (config.data instanceof Object) {
			config.headers['Content-Type'] = 'application/json';
		}
		config.headers['Authorization'] = `Bearer ${accessToken}`;

		return config;
	},
	(error) => {
		console.log(error);
		return Promise.reject(error);
	},
);

instance.interceptors.response.use(
	(response) => {
		if (response.status === 404) {
			console.log('404에러');
		}
		return response;
	},
	(error) => {
		console.error(error);
		if (error.response.status === 401) {
			useUserStore.getState().actions.logout();
		}
		return Promise.reject(error);
	},
);

export default instance;
