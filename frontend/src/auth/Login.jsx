// отвечает за сбор учетных данных пользователя (логин и пароль),
// отправку их на бэкенд для проверки и сохранение полученного JWT-токена в браузере, чтобы пользователь «оставался в системе».

import { useState } from 'react';
import http from "../http-common";

function Login() {
	// username / password: Хранят то, что пользователь вводит в поля ввода прямо сейчас.
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	// message: Хранит текст ошибки, если логин или пароль не подошли.
	const [message, setMessage] = useState("");
	// const navigate = useNavigate();

	const handleLogin = (e) => {
		// Отменяет стандартную перезагрузку формы браузером
		e.preventDefault();
		// Очищаем старые ошибки перед новой попыткой
		setMessage("");

		// отправляем POST-запрос на бэкенд. В теле запроса — объект с логином и паролем.
		http.post("/auth/login", { username, password })
			.then((response) => {
				console.log("Ответ сервера:", response.data); // Посмотри это в консоли браузера!

				// Сохраняем весь объект пользователя, если он пришел
				if (response.data) {
					// превращаем объект пользователя (где лежит имя, роли и токен) в строку и сохраняем в память браузера.
					localStorage.setItem("user", JSON.stringify(response.data));

					// Маленькая хитрость: используем window.location вместо navigate, 
					// чтобы точно сработала жесткая перезагрузка и подтянулись права
					// (Использую перезагрузку страницы вместо программного роутинга (navigate) для обновления глобального состояния приложения»)
					window.location.href = "/listDisciplines";
				}
			})
			.catch((error) => {
				console.error("Ошибка запроса:", error);
				// опциональная цепочка (?.). Если бэкенд прислал конкретную
				// причину (например, «Неверный пароль»), мы её покажем.
				// Если сервер упал или не ответил — покажем стандартное «Ошибка входа»
				const resMessage = error.response?.data?.message || "Ошибка входа";
				setMessage(resMessage);
			});
	};

	return (
		<div style={{ maxWidth: "300px", margin: "50px auto" }}>
			<h3>Вход в систему</h3>
			<form onSubmit={handleLogin}>
				<div>
					<input type="text" placeholder="Логин" value={username}
						onChange={(e) => setUsername(e.target.value)} required
						style={{ width: "100%", marginBottom: "10px" }} />
				</div>
				<div>
					<input type="password" placeholder="Пароль" value={password}
						onChange={(e) => setPassword(e.target.value)} required
						style={{ width: "100%", marginBottom: "10px" }} />
				</div>
				<button type="submit">Войти</button>
			</form>
			{message && <p style={{ color: "red" }}>{message}</p>}
		</div>
	);
}

export default Login;