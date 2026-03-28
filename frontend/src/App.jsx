import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Header from './layout/Header';
import { Link } from "react-router-dom";

import ListDisciplines from './discipline/ListDisciplines.jsx';
import AddDiscipline from './discipline/AddDiscipline.jsx';
import DisciplineData from './discipline/DisciplineData.jsx';
import AttestationBook from "./attestation/AttestationBook";
import TeacherList from "./teacher/TeacherList.jsx";
import Assignments from "./assignment/Assignments";

import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';

import ListStudents from "./student/ListStudents";

// Импортируем наш защитник
import ProtectedRoute from './common/ProtectedRoute.jsx';

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
		<BrowserRouter>
			<Header />

			<nav style={{
				display: "flex",
				alignItems: "center",
				gap: "25px",
				padding: "10px 20px",
				backgroundColor: "#2c3e50", // Глубокий темный цвет
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
				<Routes>
					{/* ПУБЛИЧНЫЕ МАРШРУТЫ (доступны всем) */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* ЗАЩИЩЕННЫЕ МАРШРУТЫ (только для залогиненных) */}
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
						path='/addDiscipline'
						element={
							<ProtectedRoute>
								<AddDiscipline />
							</ProtectedRoute>
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


					<Route path="/" element={<Navigate to="/listDisciplines" />} />
					<Route path="/assignments" element={<Assignments />} />
					<Route path="/attestation" element={<AttestationBook />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;