import React, { useState } from 'react';
import http from "../http-common";
import { useNavigate } from 'react-router-dom';

function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [successful, setSuccessful] = useState(false);
	const navigate = useNavigate();

	const handleRegister = (e) => {
		e.preventDefault();
		setMessage("");
		setSuccessful(false);

		// Отправляем данные на бэкенд для создания пользователя
		http.post("/auth/register", { username, password })
			.then((response) => {
				setMessage(response.data.message || "Успешная регистрация!");
				setSuccessful(true);
				// Через 2 секунды перекидываем на страницу входа
				setTimeout(() => {
					navigate("/login");
				}, 2000);
			})
			.catch((error) => {
				const resMessage = error.response?.data?.message || "Ошибка регистрации";
				setMessage(resMessage);
				setSuccessful(false);
			});
	};

	return (
		<div style={{ maxWidth: "300px", margin: "50px auto" }}>
			<h3>Регистрация</h3>
			<form onSubmit={handleRegister}>
				<div>
					<input type="text" placeholder="Придумайте логин" value={username}
						onChange={(e) => setUsername(e.target.value)} required
						style={{ width: "100%", marginBottom: "10px" }} />
				</div>
				<div>
					<input type="password" placeholder="Придумайте пароль" value={password}
						onChange={(e) => setPassword(e.target.value)} required
						style={{ width: "100%", marginBottom: "10px" }} />
				</div>
				<button type="submit" style={{ width: "100%" }}>Зарегистрироваться</button>
			</form>

			{/* Сообщение об успехе или ошибке */}
			{message && (
				<p style={{ color: successful ? "green" : "red", marginTop: "10px" }}>
					{message}
				</p>
			)}
		</div>
	);
}

export default Register;