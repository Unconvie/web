// позволяет новому пользователю создать аккаунт.
// В отличие от входа, здесь мы не сохраняем токен сразу (после регистрации нужно войти вручную)
// а просто уведомляем базу данных о новом «жителе» и отправляем пользователя на страницу логина.

import { useState } from 'react';
import http from "../http-common";
// так как нам нужно программно переместить пользователя на страницу входа без перезагрузки всей страницы.
import { useNavigate } from 'react-router-dom';

function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	// флаг. нужен, чтобы менять цвет текста сообщения (зеленый для успеха, красный для ошибки)
	// и понимать, нужно ли запускать таймер редиректа
	const [successful, setSuccessful] = useState(false);
	const navigate = useNavigate();

	// Обработка регистрации
	const handleRegister = (e) => {
		e.preventDefault();
		setMessage("");
		// // Сбрасываем статус перед новой попыткой
		setSuccessful(false);

		// Отправляем данные на бэкенд для создания пользователя
		http.post("/auth/register", { username, password })
			.then((response) => {
				setMessage(response.data.message || "Успешная регистрация!");
				setSuccessful(true);
				//«вежливый» интерфейс.
				// Если перекинуть пользователя мгновенно, он не успеет прочитать, что всё прошло успешно.
				// даем 2 секунды, чтобы порадоваться зеленой надписи, и только потом вызываем Maps("/login")
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
		// Ограничиваем ширину формы
		<div style={{ maxWidth: "300px", margin: "50px auto" }}>
			<h3>Регистрация</h3>
			{/* позволяет форме реагировать не только на клик по кнопке,
			но и на нажатие Enter в любом из полей.
			привязала сюда функцию handleRegister, которая делает запрос на сервер */}
			<form onSubmit={handleRegister}>
				<div>{/* Поле всегда показывает то, что лежит в state */}
					<input type="text" placeholder="Придумайте логин" value={username}
						// Как только пользователь нажимает любую клавишу, срабатывает событие e.
						// Мы берем новое значение из e.target.value и записываем его в state через setUsername
						// required: браузерная проверка. Кнопка не нажмется, если поле пустое.
						onChange={(e) => setUsername(e.target.value)} required
						style={{ width: "100%", marginBottom: "10px" }} />
				</div>
				<div>
					{/* type="password": Маскирует символы точками или звездочками */}
					<input type="password" placeholder="Придумайте пароль" value={password}
						onChange={(e) => setPassword(e.target.value)} required
						style={{ width: "100%", marginBottom: "10px" }} />
				</div>
				{/* «При нажатии на меня — запускай событие onSubmit» */}
				<button type="submit" style={{ width: "100%" }}>Зарегистрироваться</button>
			</form>

			{/* Сообщение об успехе или ошибке */}
			{message && (
				// Тернарный оператор: Если successful === true, применится цвет green, иначе — red
				<p style={{ color: successful ? "green" : "red", marginTop: "10px" }}>
					{message}
				</p>
			)}
		</div>
	);
}

export default Register;