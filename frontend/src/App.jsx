// корень приложения. Здесь определяешь «карту» сайта: какие адреса в браузере (URL) соответствуют каким визуальным компонентам.
// здесь задается общая структура (шапка, меню), которая видна на всех страницах

// подключаем инструменты навигации (react-router-dom) и все страницы
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Header from './layout/Header';
import { Link } from "react-router-dom";

import ListDisciplines from './discipline/ListDisciplines.jsx';
import AttestationBook from "./attestation/AttestationBook";
import TeacherList from "./teacher/TeacherList.jsx";
import Assignments from "./assignment/Assignments";

import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';

import ListStudents from "./student/ListStudents";

// «охранник» на входе.
// проверяет, залогинен ли пользователь, прежде чем пустить его внутрь.
import ProtectedRoute from './common/ProtectedRoute.jsx';

// стили меню в отдельный объект
const navLinkStyle = {
	color: "white",
	textDecoration: "none",
	fontSize: "16px",
	fontWeight: "500",
	transition: "color 0.3s",
	padding: "5px 10px",
	borderRadius: "4px"
};

function App() {
	return (
		// включает режим отслеживания URL в браузере
		<BrowserRouter>
			{/* шапка сайта. Она вне блока Routes, значит, будет видна всегда. */}
			<Header />

			{/* главное меню */}
			<nav style={{
				display: "flex",
				alignItems: "center",
				gap: "25px",
				padding: "10px 20px",
				backgroundColor: "#2c3e50",
				color: "white"
			}}>
				<h2 style={{ margin: 0, fontSize: "1.2rem", color: "#ecf0f1" }}>Система Учета</h2>

				<div style={{ display: "flex", gap: "15px" }}>
					<Link to="/listDisciplines" style={navLinkStyle}>Дисциплины</Link>
					<Link to="/teachers" style={navLinkStyle}>Преподаватели</Link>
					<Link to="/listStudents" style={navLinkStyle}>Студенты</Link>
					<Link to="/assignments" style={navLinkStyle}>Назначения</Link>
					<Link to="/attestation" style={navLinkStyle}>Аттестационная книжка</Link>
				</div>
			</nav>

			<div style={{ padding: "20px" }}>
				{/* Список всех маршрутов. */}
				<Routes>
					{/* ПУБЛИЧНЫЕ МАРШРУТЫ (доступны всем) */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* ЗАЩИЩЕННЫЕ МАРШРУТЫ (только для залогиненных) */}
					{/* Если аноним попробует перейти по ссылке, его «выбросит» на страницу входа */}
					<Route
						path='/listDisciplines'
						element={
							<ProtectedRoute>
								<ListDisciplines />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/teachers"
						element={
							<TeacherList />
						}
					/>
					<Route
						path="/discipline/:id"
						element={
							<ProtectedRoute>
								<DisciplineData />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/listStudents'
						element={
							<ProtectedRoute>
								<ListStudents />
							</ProtectedRoute>
						}
					/>

					{/* редирект. Если пользователь просто зашел на сайт, его сразу отправит к списку дисциплин. */}
					<Route path="/" element={<Navigate to="/listDisciplines" />} />
					<Route path="/assignments" element={<Assignments />} />
					<Route path="/attestation" element={<AttestationBook />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;