import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
	const navigate = useNavigate();
	// Пытаемся достать данные пользователя из памяти браузера
	const user = JSON.parse(localStorage.getItem('user'));

	const logOut = () => {
		localStorage.removeItem('user'); // Удаляем данные при выходе
		navigate('/login'); // Отправляем на страницу входа
		window.location.reload(); // Перезагружаем, чтобы сбросить состояние
	};

	return (
		<nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#f4f4f4' }}>
			<Link to="/listDisciplines">Список дисциплин</Link>

			{/* Если пользователь вошел — показываем имя и кнопку Выход */}
			{user ? (
				<div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
					<span>Привет, <strong>{user.username}</strong></span>
					<button onClick={logOut} style={{ cursor: 'pointer' }}>Выйти</button>
				</div>
			) : (
				/* Если не вошел — кнопки входа и регистрации */
				<div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
					<Link to="/login">Вход</Link>
					<Link to="/register">Регистрация</Link>
				</div>
			)}
		</nav>
	);
}

export default Header;