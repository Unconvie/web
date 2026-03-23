import axios from "axios";

const apiClient = axios.create({
	baseURL: "http://localhost:3000/api",
	headers: {
		"Content-Type": "application/json"
	}
});

// Добавляем перехватчик: перед каждым запросом проверяем наличие токена
apiClient.interceptors.request.use(
	(config) => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user && user.accessToken) {
			// Прикрепляем токен к заголовкам (как в продвинутых REST API)
			config.headers["x-access-token"] = user.accessToken;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default apiClient;