import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
	// Проверяем, есть ли пользователь в локальном хранилище браузера
	const user = JSON.parse(localStorage.getItem('user'));

	if (!user) {
		// Если пользователя нет, перенаправляем на страницу входа
		return <Navigate to="/login" replace />;
	}

	// Если пользователь есть, показываем содержимое (children)
	return children;
};

export default ProtectedRoute;