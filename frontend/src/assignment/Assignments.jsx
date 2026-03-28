import React, { useState, useEffect } from 'react';
import http from '../http-common';

const Assignments = () => {
	const [teachers, setTeachers] = useState([]);
	const [disciplines, setDisciplines] = useState([]);
	const [groups, setGroups] = useState([]);
	const [reportTypes, setReportTypes] = useState([]);
	const [teacherDisciplines, setTeacherDisciplines] = useState([]);
	const [sessions, setSessions] = useState([]);
	const [message, setMessage] = useState("");

	// Поля форм
	const [selTeacher, setSelTeacher] = useState("");
	const [selDiscipline, setSelDiscipline] = useState("");
	const [selTD, setSelTD] = useState("");
	const [selGroup, setSelGroup] = useState("");
	const [selReportType, setSelReportType] = useState("");

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			const [t, d, g, rt, td, s] = await Promise.all([
				http.get("/listTeachers"),
				http.get("/listDisciplines"),
				http.get("/listStudentGroups"),
				http.get("/listReportTypes"), // Убедись, что этот роут есть
				http.get("/ListTeacherDisciplines"),
				http.get("/ListSessions")
			]);
			setTeachers(t.data);
			setDisciplines(d.data);
			setGroups(g.data);
			setReportTypes(rt.data);
			setTeacherDisciplines(td.data);
			setSessions(s.data);
		} catch (e) {
			console.error("Ошибка загрузки данных", e);
		}
	};

	const handleCreateTD = async () => {
		if (!selTeacher || !selDiscipline) return alert("Выберите все поля");
		try {
			await http.post("/addTeacherDiscipline", { teacher_id: selTeacher, discipline_id: selDiscipline });
			showStatus("✅ Пара преподаватель-предмет успешно создана!");

			setSelTeacher(""); // Очистка
			setSelDiscipline(""); // Очистка

			loadData();
		} catch (e) {
			showStatus("❌ Ошибка при создании связи");
		}
	};

	const handleCreateSession = async () => {
		if (!selTD || !selGroup || !selReportType) return alert("Выберите все поля");

		try {
			await http.post("/AddSession", { // Проверь регистр /AddSession в роутах!
				teacher_discipline_id: selTD,
				student_group_id: selGroup,
				report_type_id: selReportType,
				semester: 1
			});

			showStatus("✅ Предмет успешно назначен группе!");

			// Очищаем форму
			setSelTD("");
			setSelGroup("");
			setSelReportType("");

			loadData(); // Обновляем таблицу внизу
		} catch (e) {
			showStatus("❌ Ошибка при создании назначения");
			console.error(e);
		}
	};

	// 2. Создай функцию для показа сообщения
	const showStatus = (text) => {
		setMessage(text);
		setTimeout(() => setMessage(""), 3000); // Скроем через 3 секунды
	};

	return (
		<div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
			<h2>Управление учебным планом</h2>

			{/* ШАГ 1: Связка Преподаватель + Дисциплина */}
			<div style={{ background: "#f4f4f4", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
				<h4>1. Связать преподавателя с предметом</h4>
				<select value={selTeacher} onChange={e => setSelTeacher(e.target.value)}>
					<option value="">Выберите преподавателя</option>
					{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
				</select>
				<select value={selDiscipline} onChange={e => setSelDiscipline(e.target.value)} style={{ margin: "0 10px" }}>
					<option value="">Выберите дисциплину</option>
					{disciplines.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
				</select>
				<button onClick={handleCreateTD}>Связать</button>
			</div>

			{/* ШАГ 2: Назначение группе */}
			<div style={{ background: "#eef6ff", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
				<h4>2. Назначить предмет группе</h4>
				<select value={selTD} onChange={e => setSelTD(e.target.value)}>
					<option value="">Выберите пару Препод-Предмет</option>
					{teacherDisciplines.map(td => (
						<option key={td.id} value={td.id}>
							{td.teacher?.name} — {td.discipline?.name}
						</option>
					))}
				</select>
				<select value={selGroup} onChange={e => setSelGroup(e.target.value)} style={{ margin: "0 10px" }}>
					<option value="">Выберите группу</option>
					{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
				</select>
				<select value={selReportType} onChange={e => setSelReportType(e.target.value)}>
					<option value="">Тип контроля</option>
					{reportTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
				</select>
				<button onClick={handleCreateSession} style={{ marginLeft: "10px" }}>Назначить</button>
			</div>

			{message && (
				<div style={{
					padding: "10px",
					marginBottom: "15px",
					borderRadius: "5px",
					backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
					color: message.includes("✅") ? "#155724" : "#721c24",
					textAlign: "center"
				}}>
					{message}
				</div>
			)}
			{/* ТАБЛИЦА ТЕКУЩИХ НАЗНАЧЕНИЙ */}
			<table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
				<thead>
					<tr style={{ background: "#333", color: "#fff" }}>
						<th>Группа</th>
						<th>Дисциплина</th>
						<th>Преподаватель</th>
						<th>Контроль</th>
					</tr>
				</thead>
				<tbody>
					{sessions.map(s => (
						<tr key={s.id}>
							<td>{s.student_group?.name}</td>
							<td>{s.teacher_discipline?.discipline?.name}</td>
							<td>{s.teacher_discipline?.teacher?.name}</td>
							<td>{s.report_type?.name}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Assignments;