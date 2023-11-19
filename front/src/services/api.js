import instance from '../utils/axios';

async function getApi(endpoint) {
	try {
		return await instance.get(`/${endpoint}`);
	} catch (error) {
		return Promise.reject(error);
	}
}
async function postApi(endpoint, data) {
	try {
		return await instance.post(endpoint, data || {});
	} catch (error) {
		console.log(error);
		return Promise.reject(error);
	}
}

async function putApi(endpoint, data) {
	try {
		return await instance.put(`/${endpoint}`, data);
	} catch (error) {
		return Promise.reject(error);
	}
}

async function patchApi(endpoint, data) {
	try {
		return await instance.patch(`/${endpoint}`, data);
	} catch (error) {
		return Promise.reject(error);
	}
}

async function delApi(endpoint) {
	try {
		return await instance.delete(`/${endpoint}`);
	} catch (error) {
		return Promise.reject(error);
	}
}
export { getApi, postApi, putApi, patchApi, delApi };
