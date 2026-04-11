// динамическая часть интерфейса, которая меняется в зависимости от того, «свой» перед ней или «чужой».

// для программного перехода на страницу входа после того, как мы нажмем «Выйти»
import { Link, useNavigate } from 'react-router-dom';

function Header() {
	const navigate = useNavigate();
	// проверяем статус авторизации. Если в памяти браузера лежит объект user,
	// значит, сессия активна. Мы достаем его один раз при загрузке компонента
	const user = JSON.parse(localStorage.getItem('user'));

	const logOut = () => {
		localStorage.removeItem('user'); // Удаляем токены и данные при выходе
		navigate('/login'); // Отправляем на страницу входа
		window.location.reload(); // Полностью перезагружаем, чтобы сбросить состояние
		// гарантирует, что все части приложения (особенно интерцепторы в http-common.js)
		// мгновенно узнают о том, что токен исчез
		// Все внутренние состояния React сбрасываются до начальных.
	};

	// используется тернарный оператор для выбора того, что показать пользователю.
	return (
		<nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#f4f4f4' }}>
			{/* видна всем и всегда */}
			{/* если user авторизован */}
			<Link to="/listDisciplines">Список дисциплин</Link>

			{/* Если пользователь вошел — показываем имя и кнопку Выход */}
			{/* Показываем персонализированное приветствие. Обращение по имени */}
			{user ? (
				<div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
					<span>Привет, <strong>{user.username}</strong></span>
					<button onClick={logOut} style={{ cursor: 'pointer' }}>Выйти</button>
				</div>
			) : (
				/* Если не вошел — кнопки входа и регистрации */
				// Вместо имени показываем кнопки для авторизации или создания аккаунта.
				<div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
					<Link to="/login">Вход</Link>
					<Link to="/register">Регистрация</Link>
				</div>
			)}
		</nav>
	);
}

export default Header;