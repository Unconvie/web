import React, { useState, useEffect } from "react";
import http from "../http-common";

const AttestationBook = () => {
	const [records, setRecords] = useState([]);
	const [students, setStudents] = useState([]);
	const [sessions, setSessions] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState("");
	const [selectedSession, setSelectedSession] = useState("");
	const [grade, setGrade] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editMark, setEditMark] = useState("");
	const [filterDiscipline, setFilterDiscipline] = useState(""); // хранение выбранного фильтра

	useEffect(() => {
		loadRecords();
		// Убираем /api, так как сервер их не ждет по этому адресу
		http.get("/ListStudents").then(res => setStudents(res.data));
		http.get("/ListSessions").then(res => setSessions(res.data));
	}, []);

	const loadRecords = () => {
		http.get("/ListAttestation")
			.then(response => {
				setRecords(response.data);
			})
			.catch(e => {
				console.log(e);
			});
	};

	const handleAdd = async () => {
		try {
			await http.post("/AddAttestation", {
				student_id: selectedStudent,
				student_group_session_id: selectedSession,
				mark: grade // База ждет 'mark', а значение берем из стейта 'grade'
			});

			setGrade(""); // Очистить инпут
			loadRecords(); // Обновить таблицу
		} catch (e) {
			console.error("Ошибка при отправке:", e);
			alert("Ошибка при добавлении");
		}
	};
	const handleDelete = async (id) => {
		if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
			try {
				await http.delete(`/DeleteAttestation/${id}`); // Путь должен совпадать с роутом
				loadRecords(); // Обновляем таблицу
			} catch (e) {
				console.error("Ошибка при удалении:", e);
				alert("Не удалось удалить запись");
			}
		}
	};

	const handleUpdate = async (id) => {
		try {
			await http.put(`/UpdateAttestation/${id}`, { mark: editMark });
			setEditingId(null); // Выходим из режима редактирования
			loadRecords();      // Обновляем таблицу
		} catch (e) {
			alert("Ошибка при обновлении");
		}
	};

	// Получаем уникальный список названий дисциплин из загруженных записей
	const uniqueDisciplines = [...new Set(records
		.map(r => r.student_group_session?.teacher_discipline?.discipline?.name)
		.filter(name => name) // Убираем пустые значения
	)];
	// отфильтрованный массив, который и будем выводить в таблице
	// Сначала фильтруем, а потом сортируем результат по алфавиту
	const filteredRecords = (filterDiscipline
		? records.filter(r => r.student_group_session?.teacher_discipline?.discipline?.name === filterDiscipline)
		: records)
		.sort((a, b) => {
			const nameA = a.student?.name?.toLowerCase() || "";
			const nameB = b.student?.name?.toLowerCase() || "";
			return nameA.localeCompare(nameB);
		});

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h2>Аттестационная книжка</h2>

			{/* Блок добавления новой оценки */}
			<div style={{
				marginBottom: "30px",
				padding: "20px",
				backgroundColor: "#f9f9f9",
				borderRadius: "8px",
				border: "1px solid #ddd"
			}}>
				<h3 style={{ marginTop: 0 }}>Выставить новую оценку</h3>
				<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>

					{/* Выбор студента */}
					<select
						value={selectedStudent}
						onChange={(e) => setSelectedStudent(e.target.value)}
						style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minWidth: "200px" }}
					>
						<option value="">Выберите студента...</option>
						{students.map(s => (
							<option key={s.id} value={s.id}>{s.name}</option>
						))}
					</select>

					{/* Выбор сессии (Предмет + Группа) */}
					<select
						className="form-select"
						value={selectedSession}
						onChange={(e) => setSelectedSession(e.target.value)}
						style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minWidth: "250px" }}
					>
						<option value="">Выберите предмет и группу...</option>
						{sessions && sessions.length > 0 ? (
							sessions.map(sess => (
								<option key={sess.id} value={sess.id}>
									{sess.teacher_discipline?.discipline?.name || "Без названия"} — {sess.student_group?.name || "Без группы"}
								</option>
							))
						) : (
							<option disabled>Сессии не загружены (база пуста?)</option>
						)}
					</select>

					{/* Поле для оценки */}
					{/* Заменяем input на select для валидации */}
					<select
						value={grade}
						onChange={(e) => setGrade(e.target.value)}
						style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "150px" }}
					>
						<option value="">Оценка...</option>
						<option value="5">5 (Отлично)</option>
						<option value="4">4 (Хорошо)</option>
						<option value="3">3 (Удовл.)</option>
						<option value="2">2 (Неуд.)</option>
					</select>

					<button
						onClick={handleAdd}
						style={{
							padding: "8px 20px",
							backgroundColor: "#28a745",
							color: "white",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							fontWeight: "bold"
						}}
					>
						+ Добавить
					</button>
				</div>
			</div>
			<div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
				<label>Фильтр по дисциплине:</label>
				<select
					value={filterDiscipline}
					onChange={(e) => setFilterDiscipline(e.target.value)}
					style={{ padding: "5px", borderRadius: "4px" }}
				>
					<option value="">Все предметы</option>
					{uniqueDisciplines.map(name => (
						<option key={name} value={name}>{name}</option>
					))}
				</select>
				{filterDiscipline && (
					<button
						onClick={() => setFilterDiscipline("")}
						style={{ border: "none", background: "none", color: "blue", cursor: "pointer", textDecoration: "underline" }}
					>
						Сбросить
					</button>
				)}
			</div>

			{/* Таблица с результатами */}
			<table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
				<thead>
					<tr style={{ backgroundColor: "#333", color: "white", textAlign: "left" }}>
						<th style={{ padding: "12px", border: "1px solid #444" }}>Студент</th>
						<th style={{ padding: "12px", border: "1px solid #444" }}>Дисциплина</th>
						<th style={{ padding: "12px", border: "1px solid #444" }}>Оценка</th>
						<th style={{ padding: "12px", border: "1px solid #444" }}>Действия</th>
					</tr>
				</thead>
				<tbody>
					{filteredRecords.length > 0 ? (
						filteredRecords.map((r, index) => (
							<tr key={r.id}>
								<td style={{ padding: "12px" }}>{r.student?.name}</td>
								<td style={{ padding: "12px" }}>{r.student_group_session?.teacher_discipline?.discipline?.name}</td>

								{/* Ячейка с оценкой */}
								<td style={{ padding: "12px" }}>
									{editingId === r.id ? (
										/* Комментарии внутри тернарного оператора лучше убрать или писать так */
										<select
											value={editMark}
											onChange={(e) => setEditMark(e.target.value)}
											style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
										>
											<option value="5">5 (Отлично)</option>
											<option value="4">4 (Хорошо)</option>
											<option value="3">3 (Удовл.)</option>
											<option value="2">2 (Неуд.)</option>
										</select>
									) : (
										<strong>{r.mark || "—"}</strong>
									)}
								</td>

								{/* Ячейка с кнопками */}
								<td style={{ padding: "12px", textAlign: "center" }}>
									{editingId === r.id ? (
										<>
											<button onClick={() => handleUpdate(r.id)} style={{ marginRight: "5px", color: "green" }}>💾</button>
											<button onClick={() => setEditingId(null)} style={{ color: "gray" }}>✖</button>
										</>
									) : (
										<>
											<button
												onClick={() => { setEditingId(r.id); setEditMark(r.mark); }}
												style={{ marginRight: "10px", cursor: "pointer" }}
											>
												✏️
											</button>
											<button onClick={() => handleDelete(r.id)} style={{ color: "red", cursor: "pointer" }}>
												🗑️
											</button>
										</>
									)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>
								{filterDiscipline ? "По выбранной дисциплине записей нет" : "Записей пока нет"}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default AttestationBook;