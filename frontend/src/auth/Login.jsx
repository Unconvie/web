import React, { useState } from 'react';
import http from "../http-common";
import { useNavigate } from 'react-router-dom';

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleLogin = (e) => {
		e.preventDefault();
		setMessage("");

		http.post("/auth/login", { username, password })
			.then((response) => {
				console.log("Ответ сервера:", response.data); // Посмотри это в консоли браузера!

				// Сохраняем весь объект пользователя, если он пришел
				if (response.data) {
					localStorage.setItem("user", JSON.stringify(response.data));

					// Маленькая хитрость: используем window.location вместо navigate, 
					// чтобы точно сработала жесткая перезагрузка и подтянулись права
					window.location.href = "/listDisciplines";
				}
			})
			.catch((error) => {
				console.error("Ошибка запроса:", error);
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
				<button type="button" onClick={handleLogin}>Войти</button>
			</form>
			{message && <p style={{ color: "red" }}>{message}</p>}
		</div>
	);
}

export default Login;