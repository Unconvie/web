import React, { useState, useEffect } from 'react';
import http from '../http-common'; // Твой конфиг axios

const TeacherList = () => {
	const [teachers, setTeachers] = useState([]);
	const [disciplines, setDisciplines] = useState([]);
	const [selectedDisciplineId, setSelectedDisciplineId] = useState("");
	const [newTeacherName, setNewTeacherName] = useState(""); // Для создания
	const [editingId, setEditingId] = useState(null);       // ID строки, которую правим
	const [editName, setEditName] = useState("");           // Временное имя при правке
	const [selectedNewDisciplines, setSelectedNewDisciplines] = useState([]); // Массив ID
	const [editDisciplines, setEditDisciplines] = useState([]); // ID дисциплин при правке

	useEffect(() => {
		retrieveTeachers();
		retrieveDisciplines();
	}, []);

	const retrieveTeachers = () => {
		http.get("/listTeachers")
			.then(response => {
				setTeachers(response.data);
			})
			.catch(e => console.error(e));
	};

	const retrieveDisciplines = () => {
		http.get("/listDisciplines") // Убедись, что такой роут есть на бэкенде
			.then(response => {
				setDisciplines(response.data);
			})
			.catch(e => console.error(e));
	};

	// ЛОГИКА ФИЛЬТРАЦИИ
	const filteredTeachers = selectedDisciplineId
		? teachers.filter(t =>
			t.disciplines && t.disciplines.some(d => String(d.id) === String(selectedDisciplineId))
		)
		: teachers;

	// СОЗДАНИЕ
	const handleCreate = () => {
		if (!newTeacherName) return alert("Введите имя!");

		const data = {
			name: newTeacherName,
			disciplineIds: selectedNewDisciplines // Отправляем массив выбранных ID
		};

		http.post("/addTeacher", data)
			.then(response => {
				console.log("Добавлено:", response.data);
				setNewTeacherName("");
				setSelectedNewDisciplines([]); // Очищаем выбор
				retrieveTeachers(); // ПЕРЕЗАГРУЖАЕМ СПИСОК
			})
			.catch(e => console.error("Ошибка при создании:", e));
	};

	// УДАЛЕНИЕ
	const handleDelete = (id) => {
		if (window.confirm("Удалить этого преподавателя?")) {
			http.post(`/deleteTeacher/${id}`) // У тебя в роутах .post для удаления
				.then(() => retrieveTeachers())
				.catch(e => console.error(e));
		}
	};

	// СОХРАНЕНИЕ ПРАВОК
	const handleUpdate = (id) => {
		http.post(`/updateTeacher/${id}`, {
			name: editName,
			disciplineIds: editDisciplines // Отправляем новые дисциплины
		})
			.then(() => {
				setEditingId(null);
				retrieveTeachers();
			})
			.catch(e => console.error(e));
	};

	return (
		<div style={{ padding: "20px" }}>
			<h2>Управление преподавателями</h2>

			{/* ФОРМА ДОБАВЛЕНИЯ */}
			<div style={{ marginBottom: "20px", background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
				<h4>Добавить нового преподавателя:</h4>
				<input
					type="text"
					placeholder="ФИО"
					value={newTeacherName}
					onChange={(e) => setNewTeacherName(e.target.value)}
					style={{ display: "block", marginBottom: "10px", width: "300px" }}
				/>

				<p>Выберите дисциплины:</p>
				<div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
					{disciplines.map(d => (
						<label key={d.id} style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "5px", cursor: "pointer" }}>
							<input
								type="checkbox"
								checked={selectedNewDisciplines.includes(d.id)}
								onChange={(e) => {
									const id = d.id;
									setSelectedNewDisciplines(prev =>
										prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
									);
								}}
							/> {d.name}
						</label>
					))}
				</div>

				<button onClick={handleCreate}>Создать запись</button>
			</div>

			{/* ФИЛЬТР (уже был) */}
			<div style={{ marginBottom: "20px" }}>
				<label>Фильтр по дисциплине: </label>
				<select value={selectedDisciplineId} onChange={(e) => setSelectedDisciplineId(e.target.value)}>
					<option value="">Все дисциплины</option>
					{disciplines.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
				</select>
			</div>

			{/* ТАБЛИЦА */}
			<table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr style={{ backgroundColor: "#f4f4f4" }}>
						<th>ФИО</th>
						<th>Дисциплины</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{filteredTeachers.map(t => (
						<tr key={t.id}>
							<td>
								{editingId === t.id ? (
									<input
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
									/>
								) : (
									t.name
								)}
							</td>
							<td>
								{editingId === t.id ? (
									/* Режим редактирования: показываем чекбоксы */
									<div style={{ fontSize: "0.8em", display: "flex", flexWrap: "wrap", gap: "5px" }}>
										{disciplines.map(d => (
											<label key={d.id} style={{ background: "#eee", padding: "2px 5px", borderRadius: "3px", cursor: "pointer" }}>
												<input
													type="checkbox"
													checked={editDisciplines.includes(d.id)}
													onChange={() => {
														const id = d.id;
														setEditDisciplines(prev =>
															prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
														);
													}}
												/> {d.name}
											</label>
										))}
									</div>
								) : (
									/* Обычный режим: показываем список названий дисциплин */
									t.disciplines && t.disciplines.length > 0
										? t.disciplines.map(d => d.name).join(", ")
										: "—"
								)}
							</td>
							<td>
								{editingId === t.id ? (
									<>
										<button onClick={() => handleUpdate(t.id)} style={{ marginRight: "5px", color: "green" }}>💾</button>
										<button onClick={() => setEditingId(null)} style={{ color: "gray" }}>✖</button>
									</>
								) : (
									<>
										<button onClick={() => {
											setEditingId(t.id);
											setEditName(t.name);
											setEditDisciplines(t.disciplines ? t.disciplines.map(d => d.id) : []);
										}}>✏️</button>
										<button onClick={() => handleDelete(t.id)} style={{ marginLeft: "5px" }}>🗑️</button>
									</>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TeacherList;